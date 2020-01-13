// import BN from 'bignumber.js'
import { action, observable, reaction, computed, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import swal from 'sweetalert2'
import _ from 'lodash'

import PasswordConfirm from '@/components/passwordConfirm'
import { I18nCollectionTransaction } from '@/i18n/i18n'
import AccountStore from '@/stores/account'
import TransactionStore from '@/stores/transaction'
import WalletStore from '@/stores/wallet'
import { isValidAmount, formatAmount } from '@/utils'
import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/styles'
import { Utils } from '@dipperin/dipperin.js'
import BN from 'bignumber.js'
import { ErrMsg } from '@/utils/constants'

import styles from './sendStyle'

interface WrapProps {
  wallet?: WalletStore
  account?: AccountStore
  transaction?: TransactionStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionTransaction['send']
}

@inject('wallet', 'account', 'transaction')
@observer
export class Send extends React.Component<IProps> {
  /**
   * send state
   */
  @observable
  address: string = ''
  @observable
  amount: string = ''
  @observable
  memo: string = ''
  @observable
  waitConfirm: boolean = false
  @observable
  gasPrice: string = '1'
  @observable
  estimateGas: string = '21000'
  @observable
  showDialog: boolean = false
  @computed
  get poundage() {
    return Number(this.gasPrice) * Number(this.estimateGas)
  }
  constructor(props: IProps) {
    super(props)

    reaction(() => props.account!.activeAccount, this.initState)
  }

  @action
  setEstimateGas = (newGas: string | undefined) => {
    if (newGas && /^[0-9]*$/.test(newGas) && Number(newGas) >= 21000) {
      this.estimateGas = newGas
    }
  }

  @action
  setWaitConfirm = (flag: boolean) => {
    this.waitConfirm = flag
  }

  @action
  setShowDialog = (flag: boolean) => {
    this.showDialog = flag
  }

  handleGetEstimateGas = async () => {
    runInAction(() => {
      if (this.amount) {
        this.amount = formatAmount(this.amount)
      }
      // console.log(this.amount)
    })
    const hexAddress = `0x${this.address.replace('0x', '')}`
    try {
      this.validateAddress(hexAddress)
      this.validateAmount(this.amount)
      const res = await this.props.transaction!.estimateGas(hexAddress, this.amount, this.memo)
      if (res.success) {
        this.setEstimateGas(res.info)
        this.setWaitConfirm(true)
      }
    } catch (e) {
      // console.log(e)
    }
  }

  validateAddress = (address: string) => {
    if (!Utils.isAddress(address)) {
      const label = this.props.labels
      throw new Error(label.swal.invalidAddress)
    }
  }

  validateAmount = (amount: string) => {
    if (!isValidAmount(amount)) {
      const label = this.props.labels
      throw new Error(label.swal.invalidAmount)
    }
  }

  validateExtraData = (extraData: string) => {
    if (extraData.length > 2048) {
      const label = this.props.labels
      throw new Error(label.swal.tooMuchExtraData)
    }
  }

  validateBalance = () => {
    const label = this.props.labels
    const balance = this.props.account!.activeAccount.balance
    const amountUnit = new BN(this.amount)
    const bnUnit = new BN(balance)
    const poundage = new BN(Utils.fromUnit(String(this.poundage)))
    if (bnUnit.lt(amountUnit.plus(poundage), 10)) {
      throw new Error(label.swal.insufficientFunds)
    }
  }

  handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      this.validateAddress(this.address)
      this.validateAmount(this.amount)
      this.validateExtraData(this.memo)
      this.validateBalance()
      this.handleShowDialog()
    } catch (err) {
      swal.fire(err.message, '', 'error')
    }
  }

  handleCloseDialog = () => {
    this.setShowDialog(false)
  }

  wrappedConfirmTransaction = (
    address: string,
    amount: string,
    memo: string,
    gas: string,
    gasPrice: string
  ): Promise<{ success: boolean; info?: string }> => {
    return new Promise(async (resolve, reject) => {
      const timeoutTimer = setTimeout(() => {
        reject(new Error(this.props.labels.swal.networkError))
      }, 5000)
      const res = await this.props.transaction!.confirmTransaction(address, amount, memo, gas, gasPrice)
      clearTimeout(timeoutTimer)
      resolve(res)
    })
  }

  send = async () => {
    this.handleCloseDialog()
    const { labels } = this.props
    const hexAddress = `0x${this.address.replace('0x', '')}`
    let gas
    if (this.estimateGas && /^[0-9]*$/.test(this.estimateGas)) {
      gas = String(Number(this.estimateGas) * 2)
    } else {
      gas = '21000'
    }
    // const gas: string = String(Number(this.estimateGas)! * 2) | '120000'
    try {
      const res = await this.wrappedConfirmTransaction(hexAddress, this.amount, this.memo, gas, this.gasPrice)
      if (res.success) {
        this.handleCloseDialog()
        this.initState()
        await swal.fire({
          text: labels.swal.success,
          icon: 'success',
          confirmButtonText: labels.swal.confirm,
          timer: 1000
        })
        this.props.transaction!.updateTransactionType()
      } else {
        let errorText: string = res.info || ''
        if (ErrMsg.hasOwnProperty(res.info as string)) {
          errorText = labels.swal[ErrMsg[res.info as string]]
        }
        // if (res.info === `ResponseError: Returned error: "this transaction already in tx pool"`) {
        //   errorText = labels.swal.alreadyInTxPool
        // }
        // if (res.info === `ResponseError: Returned error: "tx nonce is invalid"`) {
        //   errorText = labels.swal.invalidNonce
        // }
        // if (res.info === `ResponseError: Returned error: "new fee is too low to replace the old one"`) {
        //   errorText = labels.swal.tooLowfee
        // }
        if (errorText.includes('NoEnoughBalance') || errorText.includes('insufficient balance')) {
          errorText = labels.swal.insufficientFunds
        }
        await swal.fire({
          title: labels.swal.fail,
          text: errorText,
          icon: 'error',
          confirmButtonText: labels.swal.confirm
        })
      }
    } catch (e) {
      const errorText: string = e.message || ''
      // if (e.message.includes('NoEnoughBalance') || e.message.includes('insufficient balance')) {
      //   errorText = labels.swal.insufficientFunds
      // }
      console.log('send err', e)
      await swal.fire({
        title: labels.swal.fail,
        text: errorText,
        icon: 'error',
        confirmButtonText: labels.swal.confirm
      })
    }
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = await this.props.wallet!.checkPassword(password)
    if (res) {
      this.send()
    } else {
      await swal.fire({
        icon: 'error',
        title: labels.swal.incorrectPassword
      })
    }
  }

  handleDialogConfirm = _.debounce(this.dialogConfirm, 1000)

  @action
  initState = () => {
    this.waitConfirm = false
    this.gasPrice = '1'
    this.address = ''
    this.memo = ''
    this.amount = ''
    this.estimateGas = '21000'
  }

  @action
  addressChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^(0x)?[0-9a-f]{0,44}$/i.test(e.target.value.toLowerCase())) {
      this.address = e.target.value
    }
  }

  @action
  amountChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.amount = e.target.value.toString()
    // this.handleGetTxFee()
  }

  @action
  memoChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.memo = e.target.value
    // this.handleGetTxFee()
  }

  @action
  gasPriceChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.gasPrice = e.target.value
    // this.handleGetTxFee()
  }

  @action
  handleShowDialog = () => {
    this.showDialog = true
  }

  @action
  handleAddGasPrice = () => {
    this.gasPrice = String(Number(this.gasPrice) + 1)
    // console.log('gasPrice', this.gasPrice)
  }

  @action
  handleSubGasPrice = () => {
    if (Number(this.gasPrice) > 1) {
      this.gasPrice = String(Number(this.gasPrice) - 1)
    }
  }

  handleAmountKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }

  render() {
    const { labels, classes } = this.props
    return (
      <div>
        <form onSubmit={this.handleSend}>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.to}</InputLabel>
            <Input value={this.address} onChange={this.addressChange} onBlur={this.handleGetEstimateGas} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.amount}</InputLabel>
            <Input
              type="number"
              onKeyDown={this.handleAmountKeyUp}
              value={this.amount}
              onChange={this.amountChange}
              onBlur={this.handleGetEstimateGas}
            />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.note}</InputLabel>
            <Input
              value={this.memo}
              onChange={this.memoChange}
              onBlur={this.handleGetEstimateGas}
              inputProps={{ maxLength: 200 }}
            />
          </FormControl>
          <FormControl fullWidth={true} margin="dense">
            <InputLabel>{labels.fee}</InputLabel>
            <Input type="text" value={`${Utils.fromUnit(String(this.poundage))} DIP`} disabled={true} />
            <div className={classes.poundageChange}>
              <span className={classes.poundageAdd} onClick={this.handleAddGasPrice} />
              <span className={classes.poundageSub} onClick={this.handleSubGasPrice} />
            </div>
          </FormControl>
          {/* <p className={classes.min}>{this.estimateGas && `${labels.estimateGas}: ${this.estimateGas}`}</p> */}
          <Button
            // disabled={!this.address || !this.amount}
            variant="contained"
            color="primary"
            className={classes.confirmButton}
            type="submit"
          >
            {labels.transfer}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </div>
    )
  }
}

const SendWithStyle = withStyles(styles)(Send)

const SendWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <SendWithStyle {...other} labels={t('transaction:send')} />
}

export default withTranslation()(SendWrap)
