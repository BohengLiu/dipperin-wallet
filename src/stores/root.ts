import { action, computed, observable, reaction } from 'mobx'
import Worker from 'worker-loader!@/workers/block.worker'

import AccountStore from '@/stores/account'
import { FILTER_TRANSACTIONS_REQ, FILTER_TRANSACTIONS_RESP, LOCALHOST, TIMET_NAME } from '@/utils/constants'
import { RespTransaction } from '@/workers/block.worker'
import Dipperin, { WebsocketProvider, Utils } from '@dipperin/dipperin.js'

import { resetDB } from '@/db'
import { sendStopNode, onStartNodeSuccess, sendStartNode } from '@/ipc'
import { getIsRemoteNode, getRemoteHost, getCurrentNet } from '@/utils/node'
import LoadingStore from './loading'
import TimerStore from './timer'
import TransactionStore from './transaction'
import WalletStore from './wallet'
import VmContractStore from './vmContract'

// interface Window {
//   dipperin: any
// }

// declare var window: Window

class RootStore {
  wallet: WalletStore
  account: AccountStore
  transaction: TransactionStore
  loading: LoadingStore
  timer: TimerStore
  // contract: ContractStore
  vmContract: VmContractStore
  dipperin: Dipperin

  private _subscribeBlock

  @observable
  private _isConnecting: boolean = false
  @observable
  private _isRemoteNode: boolean
  @observable
  private _isMovingData: boolean = false
  constructor() {
    this.initDipperin()
    this.loading = new LoadingStore()
    this.timer = new TimerStore()
    this.wallet = new WalletStore(this)
    this.account = new AccountStore(this)
    this.transaction = new TransactionStore(this)
    // this.contract = new ContractStore(this)
    this.vmContract = new VmContractStore(this)
    this.startCheckConnect()
    this.loadData()

    // init isRemoteNode
    this._isRemoteNode = getIsRemoteNode()

    reaction(
      () => this._isConnecting,
      isConnecting => {
        // this._isConnecting = isConnecting
        if (isConnecting) {
          this.startUpdate()
        } else {
          this.stopUpdate()
          this.wallet.resetBlockInfo()
        }
      }
    )
    onStartNodeSuccess(this.nodeStartSuccess)
  }

  @computed
  get isConnecting(): boolean {
    return this._isConnecting
  }

  @computed
  get isRemoteNode(): boolean {
    return this._isRemoteNode
  }

  @computed
  get isMovingData(): boolean {
    return this._isMovingData
  }

  /**
   * stop connect node
   * 1. change net
   * 2. update node
   * 3. close node
   */
  @action
  stopConnectNode() {
    this.clearTimer()
    this._isConnecting = false
    this.reloadData()
  }

  /**
   * reconnct
   * 1. after change net
   * 2. updata node success
   * 3. start node
   */
  reconnect() {
    this.reconnectDipperin()
    this.startCheckConnect()
  }

  @action
  toggleIsRemoteNode() {
    this._isRemoteNode = !this.isRemoteNode
  }

  @action
  setIsMovingData(isMoving: boolean) {
    this._isMovingData = isMoving
  }

  /**
   * change ws host (toggle remote node)
   */
  changeRemoteProvide(remoteNet?: string) {
    const host = remoteNet ? getRemoteHost(remoteNet) : LOCALHOST
    this.setDipperinProvide(host)
    this.checkIsConnect()
  }

  startCheckConnect = () => {
    this.checkIsConnect()
    this.timer.on(
      TIMET_NAME.CONNECTING,
      () => {
        this.checkIsConnect()
      },
      5000
    )
  }

  /**
   * Clear all data
   */
  async clear(isReset?: boolean) {
    this.account.clear()
    this.transaction.clear()
    // this.contract.clear()
    this.vmContract.clear()
    if (isReset) {
      resetDB()
      this.wallet.clear()
    }
  }

  /**
   * Start the transaction subscribe
   */
  @action
  startSubscribe() {
    const worker = new Worker()
    if (this._subscribeBlock) {
      this._subscribeBlock.unsubscribe()
    }
    this._subscribeBlock = this.dipperin.dr.subscribeBlock((_, res) => {
      if (!res) {
        return
      }
      this.account.accounts.map(account => {
        worker.postMessage({
          type: FILTER_TRANSACTIONS_REQ,
          txs: res.transactions,
          timestamp: res.timestamp,
          account: account.address,
          alreadyHaveTxs: (this.transaction.transactionsMap.get(account.address) || []).map(tx => tx.transactionHash)
        })
      })
    })
    worker.addEventListener('message', e => {
      if (e.data.type === FILTER_TRANSACTIONS_RESP) {
        const txs = e.data.txs.map((tx: RespTransaction) => ({
          ...tx,
          extraData: Utils.decodeBase64(tx.extraData!)
        }))
        this.transaction.appendTransaction(e.data.address, txs)
        // this.contract.updateStatusFromSubscribe(txs)
      }
    })
  }

  /**
   * Load data from data store
   */
  async loadData(isForChangeNet?: boolean) {
    if (!isForChangeNet) {
      const loadWallet = await this.wallet.load()
      if (!loadWallet) {
        return
      }
    }
    await this.account.load()
    await this.transaction.load()
    // await this.contract.load()
    await this.vmContract.load()
    this.startUpdate()
  }

  /**
   * Start loop update
   */
  startUpdate() {
    if (!this.isConnecting) {
      return
    }
    this.wallet.startUpdate()
    this.account.startUpdate()
    this.transaction.startUpdate()
    // this.contract.startUpdate()
    this.vmContract.startUpdate()
    this.startSubscribe()
  }

  /**
   * reload data
   */
  reloadData() {
    this.clear()
    this.loadData(true)
  }

  private initDipperin(): void {
    this.setDipperinProvide(this.getHost())
    // window.dipperin = this.dipperin
  }

  private reconnectDipperin(): void {
    this.setDipperinProvide(this.getHost())
  }

  private getHost(): string {
    const isRemoteNode = getIsRemoteNode()
    if (isRemoteNode) {
      const remoteNet = getCurrentNet()
      return getRemoteHost(remoteNet)
    }
    return LOCALHOST
  }

  private nodeStartSuccess = () => {
    setTimeout(() => {
      this.reconnect()
      this.wallet.startService()
    }, 1000)
  }

  /**
   * should Call the function manually:
   * 1. init
   * 2. change remote net
   */
  private checkIsConnect = async () => {
    this.dipperin.net
      .isConnecting()
      .then(res => {
        this.changeIsConnecting(res)
        if (!res) {
          // remote use http request
          const isRemote = getIsRemoteNode()
          if (isRemote) {
            return
          }
          this.reconnectDipperin()
        }
      })
      .catch(err => {
        console.error('checkIsConnect', err)
        this.changeIsConnecting(false)
      })
  }

  @action
  private setDipperinProvide(host: string) {
    let provide: string | WebsocketProvider = host
    if (host.match('ws')) {
      provide = new WebsocketProvider(host)
    }
    this.dipperin = new Dipperin(provide)
  }

  @action
  private changeIsConnecting = (isConnect: boolean) => {
    this._isConnecting = isConnect
  }

  /**
   * stop all interval (include check connect)
   */
  private clearTimer() {
    this.timer.clear()
  }

  /**
   * stop update data (exclude check connect)
   */
  private stopUpdate() {
    this.timer.stopUpdate()
  }

  stopNode() {
    if (this._isConnecting) {
      sendStopNode()
      this.stopConnectNode()
    }
    this.wallet.setMineState('init')
  }

  startNode = async () => {
    if (!this._isConnecting) {
      sendStartNode()
    }
  }
}

export default RootStore
