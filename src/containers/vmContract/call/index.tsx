import { observable, action, reaction } from 'mobx'
import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import swal from 'sweetalert2'
import _ from 'lodash'
import isInt from 'validator/lib/isInt'

// model
import { VmcontractAbi } from '@/models/vmContract'

// store
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

// components
import PasswordConfirm from '@/components/passwordConfirm'
import FunctionCaller from './functionCaller'
import { validateEnteringAmount, formatAmount } from '@/utils'

import { I18nCollectionContract } from '@/i18n/i18n'
import { helper } from '@dipperin/dipperin.js'
import styles from './styles'
import { ErrMsg } from '@/utils/constants'
interface WrapProps extends RouteComponentProps {
  vmContract: VmContractStore
  wallet: WalletStore
  // address: string
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

interface CallRes {
  success: boolean
  info: string | { error: { message: string } } | undefined
}

@inject('vmContract', 'wallet')
@observer
export class Call extends React.Component<IProps> {
  @observable
  name: string = ''
  @observable
  params: string = ''
  @observable
  showDialog: boolean = false
  @observable
  amount: string = '0'
  @observable
  gas: string = '1000000'
  @observable
  gasPrice: string = '1'
  @observable
  abi: VmcontractAbi[] = []

  constructor(props) {
    super(props)
    const { vmContract } = this.props
    const address = this.props.vmContract.path.split(':')[1]
    const callContract = vmContract.contract.get(address)
    if (callContract) {
      this.abiChange(callContract.contractAbi)
    }
    reaction(
      () => this.props.vmContract.path,
      (path: string) => {
        const ad = path.split(':')[1]
        const callContract1 = vmContract.contract.get(ad)
        if (callContract1) {
          this.abiChange(callContract1.contractAbi)
        }
      }
    )
  }

  @action
  handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateEnteringAmount(e.target.value)) {
      this.amount = e.target.value
    }
  }

  @action
  handleBlurAmount = () => {
    const formattedAmount = formatAmount(this.amount)
    this.amount = formattedAmount
  }

  @action
  abiChange = (abiByte: string) => {
    this.abi = JSON.parse(helper.Bytes.toString(abiByte)) as VmcontractAbi[]
  }

  @action
  nameChange = e => {
    this.name = e.target.value
  }

  @action
  paramsChange = e => {
    this.params = e.target.value
  }

  /**
   * @param e: React.ChangeEvent<{ value: string }>
   */
  @action
  gasChange = e => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.gas = e.target.value
    }
  }

  /**
   * e: React.ChangeEvent<{ value: string }
   */
  @action
  gasPriceChange = e => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.gasPrice = e.target.value
    }
  }

  @action
  handleCall = async (funcName: string, params: string, constant?: boolean): Promise<CallRes | void> => {
    this.name = funcName
    this.params = params
    if (constant) {
      const { vmContract } = this.props
      const address = this.props.vmContract.path.split(':')[1]
      if (this.abi.find(abi => abi.name === this.name)!.constant === 'true') {
        // TODO: change following two func into one in vmContract Store
        const callContract = vmContract.contract.get(address)!
        const callRes = await vmContract.confirmConstantCallContractMethod(
          callContract.contractAddress,
          callContract.contractAbi,
          this.name,
          this.gas,
          this.gasPrice,
          this.params ? this.params.split(',').map(param => param.trim()) : []
        )
        return callRes as CallRes
      }
    } else {
      this.handleShowDialog()
    }
  }

  dialogConfirm = async (password: string): Promise<CallRes | void> => {
    const { labels, vmContract } = this.props
    const address = this.props.vmContract.path.split(':')[1]
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const callContract = vmContract.contract.get(address)!
      const callRes = await vmContract.confirmCallContractMethod(
        callContract.contractAddress,
        callContract.contractAbi,
        this.name,
        this.amount,
        this.gas,
        this.gasPrice,
        this.params ? this.params.split(',').map(param => param.trim()) : []
      )
      if (callRes.success) {
        await swal.fire({
          title: labels.callDialog.callSuccess,
          icon: 'success',
          timer: 1000
        })
        this.handleCloseDialog()
        // console.log('after swal fire', callRes)
        return callRes as CallRes
      } else {
        this.handleCloseDialog()
        let errorText: string = callRes.info || ''
        // if (callRes.info === `ResponseError: Returned error: "this transaction already in tx pool"`) {
        //   errorText = labels.swal.alreadyInTxPool
        // }
        // if (callRes.info === `ResponseError: Returned error: "tx nonce is invalid"`) {
        //   errorText = labels.swal.invalidNonce
        // }
        // if (callRes.info === `ResponseError: Returned error: "new fee is too low to replace the old one"`) {
        //   errorText = labels.swal.tooLowfee
        // }
        if (ErrMsg.hasOwnProperty(callRes.info as string)) {
          errorText = labels.swal[ErrMsg[callRes.info as string]]
        }
        if (errorText.includes('NoEnoughBalance') || errorText.includes('insufficient balance')) {
          errorText = labels.swal.insufficientFunds
        }

        await swal.fire({
          title: labels.callDialog.callFail,
          text: errorText,
          icon: 'error'
        })
      }
    } else {
      swal.fire({
        icon: 'error',
        title: labels.callDialog.incorrectPassword
      })
    }
    return {
      success: false,
      info: 'unknown'
    }
  }

  handleDialogConfirm = _.debounce(this.dialogConfirm, 1000)

  @action
  handleCloseDialog = () => {
    this.showDialog = false
  }

  @action
  handleShowDialog = () => {
    this.showDialog = true
  }

  render() {
    const { vmContract, classes, labels } = this.props
    const address = this.props.vmContract.path.split(':')[1]
    const callContract = vmContract.contract.get(address)
    if (!callContract) {
      // return null
      return <div>No callContract</div>
    }
    return (
      <Fragment>
        <div className={classes.title}>
          <span>{labels.contractCall}</span>
        </div>
        <div className={classes.inputRow}>
          <span>{labels.value}</span>
          <input
            type="text"
            value={this.amount}
            // required={true}
            onChange={this.handleChangeAmount}
            onBlur={this.handleBlurAmount}
          />
        </div>
        <div className={classes.inputRow}>
          <span>{labels.gas}</span>
          <input type="text" value={this.gas} required={true} onChange={this.gasChange} />
        </div>
        <div className={classes.inputRow}>
          <span>{labels.gasPrice}</span>
          <input type="text" value={this.gasPrice} required={true} onChange={this.gasPriceChange} />
        </div>

        {this.abi
          .filter(item => item.name !== 'init')
          .map(item => (
            <FunctionCaller labels={labels} func={item} onCall={this.handleCall} key={item.name} />
          ))}

        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}

export const StyleTransferToken = withStyles(styles)(Call)

const TransferTokenWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleTransferToken {...other} labels={t('contract:contract')} />
}

export default withTranslation()(TransferTokenWrap)
// export default withNamespaces('contract')(StyleTransferToken)
