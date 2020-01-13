import { computed, observable, reaction, runInAction, action } from 'mobx'
import { isString } from 'lodash'

import {
  insertVmContract,
  getVmContract,
  deleteVmContract,
  updateVmContractStatus,
  updateVmContract,
  getReceipt,
  insertReceipt
} from '@/db'
import {
  // DEFAULT_CHAIN_ID,
  TRANSACTION_STATUS_FAIL,
  TRANSACTION_STATUS_SUCCESS,
  VM_CONTRACT_ADDRESS
} from '@/utils/constants'

import VmContractModel, { VmContractObj } from '../models/vmContract'
import { getCurrentNet } from '@/utils/node'
import { generateTxResponse } from '@/utils/errors'
import { getNowTimestamp } from '@/utils'

import RootStore from './root'
import { TxResponse } from './transaction'
import Dipperin, {
  VmContract
  // helper
} from '@dipperin/dipperin.js'
import Receipt from '@/models/receipt'

import Errors from '../utils/errors'

// import ExtraData from './vmTestData'

const HTTPHOST = 'http://localhost:7783'
class VmContractStore {
  private _store: RootStore

  private _dipperin: Dipperin
  // key is contract txHash
  @observable
  private _pendingContract: Map<string, VmContractModel> = new Map()
  // current contract (created & favorite)
  @observable
  private _contract: Map<string, VmContractModel> = new Map()

  @observable
  private _contractTxsMap: Map<string, string[]> = new Map()

  @observable
  private _receipts: Map<string, Receipt[]> = new Map()

  /**
   * @example
   * '0x00000...001:create'
   */
  @observable
  private _path: string = ':'

  constructor(store: RootStore) {
    this._store = store
    this._dipperin = new Dipperin(HTTPHOST)
    // TODO: try to remove this part by changing rely function
    reaction(
      () => this._store.account.activeAccount,
      () => {
        this.load()
      }
    )
  }

  @action
  updateDipperin(newDipperin: Dipperin) {
    this._dipperin = newDipperin
  }

  @computed
  get contracts(): VmContractModel[] {
    const contracts: VmContractModel[] = []
    // if activeAccount does not exist
    if (!this._store.account.activeAccount) {
      return contracts
    }
    const accountAddress = this._store.account.activeAccount.address
    this._contract.forEach((contract: VmContractModel) => {
      const owners = contract.owner.map((item: string) => item.toLocaleLowerCase())
      if (owners.includes(accountAddress.toLocaleLowerCase())) {
        contracts.push(contract)
      }
    })
    return contracts.sort((a, b) => a.timestamp - b.timestamp)
  }

  @computed
  get pendingContracts(): VmContractModel[] {
    const pendingContracts: VmContractModel[] = []
    // if activeAccount does not exist
    if (!this._store.account.activeAccount) {
      return pendingContracts
    }

    const accountAddress = this._store.account.activeAccount.address
    this._pendingContract.forEach((contract: VmContractModel) => {
      const owners = contract.owner.map((item: string) => item.toLocaleLowerCase())
      if (owners.includes(accountAddress.toLocaleLowerCase())) {
        pendingContracts.push(contract)
      }
    })
    return pendingContracts.sort((a, b) => a.timestamp - b.timestamp)
  }

  // current address contract
  get contract() {
    return this._contract
  }

  get pendingContract() {
    return this._pendingContract
  }

  get receipts() {
    return this._receipts
  }

  startUpdate() {
    this._store.timer.on('update_vmContracts', this.updateContractStatus.bind(this), 5000)
    this._store.timer.on('update_vmContracts_receipts', this.getContractReceipt.bind(this), 3000)
    this._store.timer.on('update_vmContracts_DRC20_token', this.updataDRC20ContractsToken.bind(this), 3000)
  }

  async confirmTransaction(
    address: string,
    amount: string,
    memo: string,
    gas?: string,
    gasPrice?: string
  ): Promise<TxResponse> {
    const transaction = this._store.transaction.getSignedTransactionData(address, amount, memo, gas, gasPrice)
    try {
      // const privateKey = this._store.wallet.getPrivateKeyByPath(this._store.account.activeAccount.path)
      // const transaction = this._store.transaction.createNewTransaction(address, amount, memo, gas, gasPrice)
      // transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      const res = await this._dipperin.dr.sendSignedTransaction(transaction.signedTransactionData)
      if (!isString(res)) {
        const errRes = res
        return generateTxResponse(false, errRes.error)
      }
      if (res === transaction.transactionHash) {
        // Append Transaction
        const activeAccountAddress = this._store.account.activeAccount.address
        this._store.transaction.appendTransaction(activeAccountAddress, [transaction.toJS()])
        // Plus account nonce
        this._store.account.activeAccount.plusNonce()
        return generateTxResponse(true, transaction.transactionHash)
      } else {
        return generateTxResponse(false)
      }
    } catch (err) {
      return generateTxResponse(false, err)
    }
  }

  async estimateGas(
    address: string,
    amount: string,
    memo: string,
    gas?: string,
    gasPrice?: string
  ): Promise<TxResponse> {
    const transaction = this._store.transaction.getSignedTransactionData(address, amount, memo, gas, gasPrice)
    try {
      // const privateKey = this._store.wallet.getPrivateKeyByPath(this._store.account.activeAccount.path)
      // const transaction = this._store.transaction.createNewTransaction(address, amount, memo, gas, gasPrice)
      // transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      let res
      if (this._store.isRemoteNode) {
        res = await this._store.dipperin.dr.estimateGas(transaction.signedTransactionData)
      } else {
        res = await this._dipperin.dr.estimateGas(transaction.signedTransactionData)
      }
      return generateTxResponse(true, Number(res).toString())
    } catch (err) {
      // console.error(String(err))
      if (err instanceof Errors.NoEnoughBalanceError) {
        return generateTxResponse(false, err.message)
      }
      return generateTxResponse(false, err)
    }
  }

  async createContractEstimateGas(code: string, abi: string, amount: string, params?: string[]): Promise<TxResponse> {
    try {
      const contract = new VmContractModel({
        contractCode: code,
        contractAbi: abi,
        initParams: params,
        owner: this._store.account.activeAccount.address
      })

      const res = await this.estimateGas(VM_CONTRACT_ADDRESS, amount, contract.contractData, '1', '1')

      return res
    } catch (err) {
      return generateTxResponse(false, err)
    }
  }

  async confirmCreateContract(
    code: string,
    abi: string,
    gas: string,
    gasPrice: string,
    amount: string,
    params?: string[]
  ): Promise<TxResponse> {
    try {
      const contract = new VmContractModel({
        contractCode: code,
        contractAbi: abi,
        initParams: params,
        owner: this._store.account.activeAccount.address
      })
      // const callData = Array.prototype.slice.call(Buffer.from(contract.contractData.replace('0x', ''), 'hex'))
      // console.log('contractData', callData)
      let res
      if (this._store.isRemoteNode) {
        res = await this._store.transaction.confirmTransaction(
          VM_CONTRACT_ADDRESS,
          amount,
          contract.contractData,
          gas,
          gasPrice
        )
      } else {
        res = await this.confirmTransaction(VM_CONTRACT_ADDRESS, amount, contract.contractData, gas, gasPrice)
      }

      if (res.success) {
        contract.txHash = res.info as string
        runInAction(() => {
          this._pendingContract.set(contract.txHash, contract)
        })
        // insert to all contract
        insertVmContract(contract.toJS(), getCurrentNet())
        return generateTxResponse(true)
      } else {
        return generateTxResponse(false, res.info)
      }
    } catch (err) {
      return generateTxResponse(false, err)
    }
  }

  async addContract(abi: string, address: string): Promise<TxResponse> {
    const contract = new VmContractModel({
      contractAbi: abi,
      contractAddress: address,
      owner: this._store.account.activeAccount.address,
      status: 'success'
    })
    // console.log('contractData', contract.contractData)
    if (
      this._contract.has(address) &&
      this._contract.get(address)!.hasOwner(this._store.account.activeAccount.address)
    ) {
      return generateTxResponse(false, 'The Contract has already existed!')
    } else if (this._contract.has(address)) {
      this._contract.get(address)!.addOwner(this._store.account.activeAccount.address)
      await insertVmContract(this._contract.get(address)!.toJS(), getCurrentNet())
    } else {
      runInAction(() => {
        this._contract.set(contract.contractAddress, contract)
      })
      await insertVmContract(contract.toJS(), getCurrentNet())
    }
    // insert to all contract
    // console.log('after addContract', this._contract.get(address))

    return generateTxResponse(true)
  }

  async getLogs(blockHash: string, fromBlock: number, toBlock: number, addresses: string[], topics: string[][]) {
    try {
      // console.log('vmcontract store getLogs..........')
      const res = await this._store.dipperin.dr.vmContract.getLogs(blockHash, fromBlock, toBlock, addresses, topics)
      // console.log('getLogs', res)
      return generateTxResponse(true, res)
    } catch (e) {
      return generateTxResponse(false, e)
    }
  }

  async confirmCallContractMethod(
    address: string,
    abi: string,
    methodName: string,
    amount: string,
    gas: string,
    gasPrice: string,
    params: string[] = []
  ) {
    try {
      const callData = VmContract.createCallMethod(abi, methodName, ...params)

      const res = await this._store.transaction.confirmTransaction(address, amount, callData, gas, gasPrice)
      if (res.success) {
        const txs = this._contractTxsMap.get(address) || []
        this._contractTxsMap.set(address, [...txs, res.info as string])
        // console.log('new tx', [...this._contractTxsMap.get(address)])
        return generateTxResponse(true, res.info)
      } else {
        return generateTxResponse(false, res.info)
      }
    } catch (err) {
      return generateTxResponse(false, err)
    }
  }

  async confirmConstantCallContractMethod(
    address: string,
    abi: string,
    methodName: string,
    gas: string,
    gasPrice: string,
    params: string[] = []
  ) {
    try {
      const callData = VmContract.createCallMethod(abi, methodName, ...params)
      const hash = this._store.transaction.getSignedTransactionData(address, '0', callData, gas, gasPrice)
        .signedTransactionData
      const res = await this._store.dipperin.dr.callConstFunc(hash, 0)
      return generateTxResponse(true, res as string)
    } catch (err) {
      return generateTxResponse(false, err)
    }
  }

  @action
  async load() {
    const contractDb = await getVmContract(getCurrentNet())
    runInAction(() => {
      this.getContractsFromObj(contractDb).forEach(contract => {
        if (contract.contractAddress) {
          this._contract.set(contract.contractAddress, contract)
        } else if (contract.txHash) {
          this._pendingContract.set(contract.txHash, contract)
        }
      })
    })
    const receipts = await getReceipt(getCurrentNet())
    // console.log(receipts)
    runInAction(() => {
      receipts.forEach(receipt => {
        const preReceipts = this._receipts.get(receipt.address as string) || []
        if (!preReceipts.find(item => item.transactionHash === receipt.transactionHash)) {
          preReceipts.push(receipt)
          this._receipts.set(receipt.address as string, preReceipts)
        }
      })
    })
  }

  @action
  clear() {
    this._contract.clear()
    this._pendingContract.clear()
  }
  @action
  deleteContract = async (contract: VmContractModel) => {
    if (contract.status === TRANSACTION_STATUS_SUCCESS) {
      this._contract.delete(contract.contractAddress)
    } else {
      this._pendingContract.delete(contract.txHash)
    }
    await deleteVmContract(contract.txHash)
  }
  @action
  updateContract = async (contract: VmContractModel) => {
    await updateVmContract(contract.toJS())
  }

  reload() {
    this.clear()
    this.load()
  }

  getContractReceipt() {
    this._contractTxsMap.forEach(async (txs, address) => {
      // console.log('removeTxs1',txs)
      const removeTxs = await Promise.all(
        txs.map(async tx => {
          try {
            const res = await this._store.dipperin.dr.vmContract.getReceiptByTxHash(tx)
            // console.log(tx,res)
            if (res) {
              const preReceipts = this._receipts.get(address) || []
              preReceipts.push(res)
              this._receipts.set(address, preReceipts)
              insertReceipt(res, address)
              return tx
            }
            return
          } catch (err) {
            return
          }
        })
      )
      // console.log('removeTxs2', removeTxs, this._receipts)
      const newTxs = txs.filter(tx => !removeTxs.find(t => tx === t))
      this._contractTxsMap.set(address, newTxs)
    })
  }

  getABI = async (address: string) => {
    const res = await this._store.dipperin.dr.getAbi(address)
    // console.log("vmcontract getAbI response", res)
    return res
  }

  updateContractStatus() {
    // const newContracts: VmContractModel[] = []
    this._pendingContract.forEach(contract => {
      if (!contract.isSuccess && !contract.isOverLongTime(getNowTimestamp())) {
        this._store.dipperin.dr.vmContract
          .getContractByHash(contract.txHash)
          .then(res => {
            if (!res) {
              // if the contract does not exist while the tx is on chain, we can set fail
              this._store.dipperin.dr.getTransaction(contract.txHash).then(txRes => {
                if (txRes === contract.txHash) {
                  contract.setFail()
                  // update contract in db
                  updateVmContractStatus(
                    contract.txHash,
                    TRANSACTION_STATUS_FAIL,
                    contract.contractAddress,
                    getCurrentNet()
                  )
                }
              })

              if (contract.isOverTime(getNowTimestamp())) {
                contract.setFail()
                // update contract in db
                updateVmContractStatus(
                  contract.txHash,
                  TRANSACTION_STATUS_FAIL,
                  contract.contractAddress,
                  getCurrentNet()
                )
              }
              return
            } else {
              if (res) {
                contract.contractAddress = res
                contract.setSuccess()
                runInAction(() => {
                  this._contract.set(contract.contractAddress, contract)
                  this._pendingContract.delete(contract.txHash)
                })
                // console.log('update contract status.....................')
                // update contract in db
                updateVmContractStatus(
                  contract.txHash,
                  TRANSACTION_STATUS_SUCCESS,
                  contract.contractAddress,
                  getCurrentNet()
                )
              }
            }
          })
          .catch(err => {
            if (contract.isOverTime(new Date().valueOf())) {
              contract.setFail()
              // update contract in db
              updateVmContractStatus(
                contract.txHash,
                TRANSACTION_STATUS_FAIL,
                contract.contractAddress,
                getCurrentNet()
              )
            }
          })
      }
    })
    // console.log('newContracts keys',newContracts.length)
    // newContracts.forEach(contract=>{
    //   console.log('new contract')
    //   if(contract.contractAddress) {
    //     console.log('new contract to _contract')
    //     this._contract.set(contract.contractAddress, contract)
    //     console.log('after casting', this._contract.get(contract.contractAddress))
    //   }
    // })
  }

  /**
   * update DRC20 contract token
   */
  updataDRC20ContractsToken() {
    this._contract.forEach(async contract => {
      const { isDRC20, contractAddress, contractAbi } = contract
      if (isDRC20) {
        const res = await this.confirmConstantCallContractMethod(
          contractAddress,
          contractAbi,
          'getBalance',
          '100000',
          '1',
          [this.currentActiveAccount]
        )
        if (res.success && typeof res.info === 'string') {
          contract.setDRC20Token(res.info)
        }
      }
    })
  }

  private getContractsFromObj(contractObj: VmContractObj[] = []) {
    return contractObj.map(item => {
      return VmContractModel.fromObj(item)
    })
  }

  @computed
  get path() {
    return this._path
  }

  @computed
  get currentActiveAccount() {
    return this._store.account.activeAccount.address
  }

  @action
  setPath = (address: string, dist: string): boolean => {
    if (!address.includes(':') && !dist.includes(':')) {
      // TODO: validate address and dist
      this._path = `${address}:${dist}`
      // a useful log
      // console.log(this._path)
      return true
    } else {
      return false
    }
  }
}

export default VmContractStore
