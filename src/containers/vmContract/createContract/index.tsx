import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import debounce from 'lodash/debounce'
// import isFloat from 'validator/lib/isFloat'
import isInt from 'validator/lib/isInt'
import classNames from 'classnames'

import PasswordConfirm from '@/components/passwordConfirm'
// import returnImg from '@/images/return.png'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'
import AccountStore from '@/stores/account'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { VmcontractAbi } from '@/models/vmContract'

import SelctFile from '@/images/select-file.png'
import SelectedFile from '@/images/select-file-ed.png'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'
import { helper } from '@dipperin/dipperin.js'
import { isVmContractAddress, validateEnteringAmount, formatAmount } from '@/utils'
import { ErrMsg } from '@/utils/constants'

interface WrapProps extends RouteComponentProps<{}> {
  account?: AccountStore
  wallet?: WalletStore
  vmContract?: VmContractStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('wallet', 'vmContract', 'account')
@observer
export class CreateContract extends React.Component<IProps> {
  // @observable
  // estimateGas: number
  inputABI: HTMLInputElement | null
  inputWasm: HTMLInputElement | null

  /**
   * if use register list? that's a question
   */

  // REGISTER_STRING_INPUT = ['code','abi','amount','gas','gasPrice','param']
  // * consider set the state into private
  @observable
  private stringField: Map<string, string> = new Map()
  @observable
  flags: Map<string, boolean> = new Map()

  constructor(props) {
    super(props)
    this.initState()
  }

  @computed
  get jsonAbi() {
    const abiString = this.stringField.get('abi')
    if (abiString) {
      return JSON.parse(helper.Bytes.toString(abiString))
    } else {
      return []
    }
  }

  @action
  setStringField = (key: string, value: string) => {
    // pre validator or process
    this.stringField.set(key, value)
  }

  @action
  setFlags = (key: string, value: boolean) => {
    this.flags.set(key, value)
  }

  getStringField = (key: string): string => {
    return this.stringField.get(key) || ''
  }

  getFlag = (key: string): boolean => {
    return Boolean(this.flags.get(key))
  }

  /**
   * call the function when start and leave
   */
  initState = () => {
    this.setStringField('code', '')
    this.setStringField('inputWasmPlaceholder', '')
    this.setStringField('abi', '')
    this.setStringField('inputABIPlaceholder', '')
    this.setStringField('amount', '0')
    this.setStringField('gas', '')
    this.setStringField('gasPrice', '1')
    this.setStringField('params', '')
    this.setStringField('estimateGas', '')
    this.setStringField('contractAddress', '')
    this.setFlags('showDialog', false)
    this.setFlags('isCreated', true)
    this.setFlags('showDetailParams', false)
  }

  handleJumpToCreated = () => {
    this.setFlags('isCreated', true)
  }

  handleJumpToFavorite = () => {
    this.setFlags('isCreated', false)
  }

  handleChangeCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].name.split('.').reverse()[0] !== 'wasm') {
        await swal.fire({
          icon: 'error',
          title: this.props.labels.errorWasmFile
        })
        return
      }
      this.setStringField('inputWasmPlaceholder', e.target.files[0].name)
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        const code = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        this.setStringField('code', code)
      }
    }
  }

  validateAbi = (rawAbi: string) => {
    try {
      // TODO: validate the inner Content of file
      JSON.parse(helper.Bytes.toString(rawAbi))
      return true
    } catch (e) {
      return false
    }
  }

  handleChangeAbi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log(e.target.files[0].name.split('.').reverse())
      if (e.target.files[0].name.split('.').reverse()[0] !== 'json') {
        await swal.fire({
          icon: 'error',
          title: this.props.labels.errorAbiFile
        })
        return
      }
      this.setStringField('inputABIPlaceholder', e.target.files[0].name)
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        const abi = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        if (this.validateAbi(abi)) {
          this.setStringField('abi', abi)
        } else {
          this.inputABI!.value = ''
          this.setStringField('inputABIPlaceholder', '')
          swal.fire({
            icon: 'error',
            title: this.props.labels.errorAbiFile
          })
        }
      }
    }
  }

  handleChangeParams = (e: React.ChangeEvent<{ value: string }>) => {
    this.setStringField('params', e.target.value)
  }

  handleToggleDetailParam = () => {
    const newFlag = !this.flags.get('showDetailParams')
    this.setFlags('showDetailParams', newFlag)
  }

  handleChangeGas = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.setStringField('gas', e.target.value)
    }
  }

  handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateEnteringAmount(e.target.value)) {
      this.setStringField('amount', e.target.value)
    }
  }

  handleBlurAmount = () => {
    const formattedAmount = formatAmount(this.getStringField('amount'))
    this.setStringField('amount', formattedAmount)
  }

  handleChangeGasPrice = (e: React.ChangeEvent<{ value: string }>) => {
    if (e.target.value || e.target.value === '') {
      this.setStringField('gasPrice', e.target.value)
    }
  }

  handleChangeContractAddress = (e: React.ChangeEvent<{ value: string }>) => {
    const address = e.target.value
    const pureAddress = `${address.replace('0x', '')}`
    if (/^[0-9a-fA-F]{0,44}$/.test(pureAddress)) {
      this.setStringField('contractAddress', address)
    }
  }

  getContractGas = async () => {
    // TODO: add validator for every input of createContractEstimateGas
    const code = this.getStringField('code')
    const abi = this.getStringField('abi')
    const amount = '0'
    const params = this.stringField
      .get('params')!
      .split(',')
      .map(param => param.trim())
    const estimateGasRes = await this.props.vmContract!.createContractEstimateGas(code, abi, amount, params)
    // console.log('createContractEstimateGas', estimateGasRes)
    if (!estimateGasRes.success) {
      return
    }
    try {
      // TODO: add validator for estimateGas
      const estimateGas = estimateGasRes.info || ''
      this.setStringField('estimateGas', estimateGas)
      if (!this.stringField.get('gas')) {
        this.setStringField('gas', estimateGas)
      }
    } catch (e) {
      console.error('estimate gas error', e)
    }
  }

  handleChangeParam(param: string, e: React.ChangeEvent<{ value: string }>) {
    this.setStringField(param, e.target.value)
  }

  validateParams = () => {
    const label = this.props.labels.createSwal
    // validates params' length
    const params = (this.stringField.get('params') || '').split(',')
    const initFunc = (this.jsonAbi.find(
      abi => abi.name === 'init' && abi.type === 'function'
    ) as unknown) as VmcontractAbi
    if (params.length !== initFunc.inputs.length) {
      throw new Error(label.paramsLengthErr)
    }
    // TODO: validates parameters' type
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (this.flags.get('isCreated')) {
      try {
        if (!this.stringField.get('abi')) {
          throw new Error(this.props.labels.createSwal.noAbi)
        }
        if (!this.stringField.get('code')) {
          throw new Error(this.props.labels.createSwal.noWASM)
        }
        this.validateParams()
        if (!this.stringField.get('gas')) {
          throw new Error(this.props.labels.createSwal.noGas)
        }
        if (!this.stringField.get('gasPrice')) {
          throw new Error(this.props.labels.createSwal.noGasPrice)
        }
        this.handleShowDialog()
      } catch (e) {
        const label = this.props.labels.createSwal
        swal.fire(label.createErr, e.message, 'error')
      }
    } else {
      this.handleAddContract()
    }
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      // TODO: add validator for every input of createContractEstimateGas
      const code = this.getStringField('code')
      const abi = this.getStringField('abi')
      const gas = this.getStringField('gas')
      const gasPrice = this.getStringField('gasPrice')
      const amount = this.getStringField('amount')
      const params = this.getStringField('params')
        .split(',')
        .map(param => param.trim())
      const contractRes = await this.props.vmContract!.confirmCreateContract(code, abi, gas, gasPrice, amount, params)

      if (contractRes.success) {
        await swal.fire({
          title: labels.createSwal.createSuccess,
          icon: 'success',
          timer: 1000
        })
        this.handleCloseDialog()
      } else {
        this.handleCloseDialog()
        const errorText = this.transformErrorInfo(contractRes.info as string)
        swal.fire({
          title: labels.createSwal.createErr,
          text: errorText,
          icon: 'error'
        })
      }
    } else {
      await swal.fire({
        icon: 'error',
        title: labels.createSwal.incorrectPassword
      })
    }
  }

  transformErrorInfo = (info: string): string => {
    const labels = this.props.labels
    // if (info === 'Error: Network Error') {
    //   return labels.createSwal.networkError
    // }
    // if (info === 'insufficient balance') {
    //   return labels.createSwal.noEnoughBalance
    // }

    // if (info === `ResponseError: Returned error: "this transaction already in tx pool"`) {
    //   return labels.swal.alreadyInTxPool
    // }
    // if (info === `ResponseError: Returned error: "tx nonce is invalid"`) {
    //   return labels.swal.invalidNonce
    // }
    // if (info === `ResponseError: Returned error: "new fee is too low to replace the old one"`) {
    //   return labels.swal.tooLowfee
    // }
    if (ErrMsg.hasOwnProperty(info)) {
      return labels.swal[ErrMsg[info]]
    }
    if (info.includes('InvalidConnectionError')) {
      return labels.swal.networkError
    }
    if (info.includes('NoEnoughBalance') || info.includes('insufficient balance')) {
      return labels.swal.insufficientFunds
    }
    return info
  }

  handleDialogConfirm = debounce(this.dialogConfirm, 1000)

  validateContractAddress = (address: string) => {
    const { labels } = this.props
    if (!isVmContractAddress(address)) {
      throw new Error(labels.createSwal.contractAddressErr)
    }
  }

  handleAddContract = async () => {
    // e: React.MouseEvent
    // e.preventDefault()
    const { labels } = this.props
    try {
      const contractAddress = this.getStringField('contractAddress')
      this.validateContractAddress(contractAddress)
      const abi = this.getStringField(`abi:${contractAddress.toLocaleLowerCase()}`)
      if (abi.length === 0) {
        try {
          await this.getAbi()
          if (this.getStringField(`abi:${contractAddress.toLocaleLowerCase()}`).length === 0) {
            throw new Error()
          }
        } catch (e) {
          swal.fire({
            title: labels.createSwal.createErr,
            text: labels.createSwal.getAbi,
            icon: 'error'
          })
          return
        }
      }
      // if (abi.length === 0) {
      //   swal.fire({
      //     title: labels.createSwal.createErr,
      //     text: labels.createSwal.getAbi,
      //     type: 'error'
      //   })
      //   return
      // }
      const contractRes = await this.props.vmContract!.addContract(abi, contractAddress)
      if (contractRes.success) {
        await swal.fire({
          title: labels.createSwal.createSuccess,
          icon: 'success',
          timer: 1000
        })
      } else {
        swal.fire({
          title: labels.createSwal.createErr,
          text: contractRes.info,
          icon: 'error'
        })
      }
    } catch (e) {
      swal.fire({
        title: labels.createSwal.createErr,
        text: e.message,
        icon: 'error'
      })
    }
  }

  handleCloseDialog = () => {
    this.setFlags('showDialog', false)
  }

  handleShowDialog = () => {
    this.setFlags('showDialog', true)
  }

  handleOnShowDetailParams = () => {
    this.setFlags('showDetailParams', false)
  }

  handleConfirmGenParams(initFunc: VmcontractAbi) {
    const params = initFunc.inputs.map(input => this.stringField.get(input.name)).join(',')
    this.setStringField('params', params)
    this.handleOnShowDetailParams()
    this.getContractGas()
  }

  addfile = () => {
    if (this.inputABI) {
      this.inputABI.click()
    }
  }

  addWasmFile = () => {
    if (this.inputWasm) {
      this.inputWasm.click()
    }
  }

  getAbi = async () => {
    const contractAddress = this.getStringField('contractAddress')
    if (isVmContractAddress(contractAddress)) {
      const res = await this.props.vmContract!.getABI(contractAddress)
      if ('abiArr' in res) {
        const abi = helper.Bytes.fromString(JSON.stringify(res!.abiArr))
        this.setStringField(`abi:${contractAddress.toLocaleLowerCase()}`, abi)
      }
    }
  }

  render() {
    const { classes, labels } = this.props
    let initFunc: VmcontractAbi | undefined
    let placeholder: string | '' = ''
    const abis = this.jsonAbi
    if (abis.length) {
      initFunc = (abis.find(abi => abi.name === 'init' && abi.type === 'function') as unknown) as VmcontractAbi
      // console.log(initFunc)
      if (initFunc.inputs) {
        placeholder = initFunc.inputs.map(input => `${input.type} ${input.name}`).join(',')
      }
    }

    return (
      <Fragment>
        <div className={classes.tab}>
          <div className={classes.tabLeft}>
            <Button
              onClick={this.handleJumpToCreated}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: this.flags.get('isCreated') })}
            >
              {labels.created}
            </Button>
          </div>
          <div className={classes.tabRight}>
            <Button
              onClick={this.handleJumpToFavorite}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: !this.flags.get('isCreated') })}
            >
              {labels.favorite}
            </Button>
          </div>
        </div>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          {this.flags.get('isCreated') && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.abi}</span>
                <div
                  style={this.stringField.get('inputABIPlaceholder') ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addfile}
                >
                  {this.stringField.get('inputABIPlaceholder')
                    ? this.stringField.get('inputABIPlaceholder')
                    : labels.selectFile}
                  <img src={this.stringField.get('inputABIPlaceholder') ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ opacity: 0, zIndex: -1, width: 1, height: 1, position: 'absolute', left: 100 }}
                  type="file"
                  // required={true}
                  onChange={this.handleChangeAbi}
                  ref={input => {
                    this.inputABI = input
                  }}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.code}</span>
                <div
                  style={this.stringField.get('inputWasmPlaceholder') ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addWasmFile}
                >
                  {this.stringField.get('inputWasmPlaceholder')
                    ? this.stringField.get('inputWasmPlaceholder')
                    : labels.selectFile}
                  <img src={this.stringField.get('inputWasmPlaceholder') ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ opacity: 0, zIndex: -1, width: 1, height: 1, position: 'absolute', left: 100 }}
                  type="file"
                  // required={true}
                  onChange={this.handleChangeCode}
                  ref={input => {
                    this.inputWasm = input
                  }}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.initParams}</span>
                <div className={classes.paramsBox}>
                  <input
                    type="text"
                    className={classes.initParamsInput}
                    disabled={this.flags.get('showDetailParams')}
                    value={this.stringField.get('params') || ''}
                    placeholder={placeholder}
                    // required={initFunc && initFunc.inputs.length > 0}
                    onChange={this.handleChangeParams}
                    onBlur={this.getContractGas}
                  />
                  {initFunc && initFunc.inputs.length > 0 && (
                    <span className={classes.arrow} onClick={this.handleToggleDetailParam}>
                      {this.flags.get('showDetailParams') ? '▲' : '▼'}
                    </span>
                  )}
                  <Fragment>
                    {this.flags.get('showDetailParams') && initFunc && initFunc.inputs.length > 0 && (
                      <div className={classes.detailInputs}>
                        {initFunc.inputs.map((input, index) => (
                          <div key={index} className={classes.paramRow}>
                            <span>{input.name}:</span>
                            <input
                              type="text"
                              // className={classes.inputText}
                              placeholder={input.type}
                              value={this.stringField.get(input.name) || ''}
                              onChange={this.handleChangeParam.bind(this, input.name)}
                            />
                          </div>
                        ))}
                        <Button
                          disabled={false}
                          variant="contained"
                          color="primary"
                          // style={{ background: color }}
                          className={classes.paramBtn}
                          // type="submit"
                          onClick={this.handleConfirmGenParams.bind(this, initFunc)}
                        >
                          {labels.confirm}
                        </Button>
                      </div>
                    )}
                  </Fragment>
                </div>
              </div>
              <div className={classes.inputRow}>
                <span>{labels.value}</span>
                <input
                  type="text"
                  value={this.stringField.get('amount') || ''}
                  onChange={this.handleChangeAmount}
                  onBlur={this.handleBlurAmount}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gas}</span>
                <input
                  type="text"
                  value={this.stringField.get('gas') || ''}
                  // required={true}
                  onChange={this.handleChangeGas}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gasPrice}</span>
                <input
                  type="text"
                  value={this.stringField.get('gasPrice') || ''}
                  // required={true}
                  onChange={this.handleChangeGasPrice}
                />
              </div>
              <div className={classes.inputRow}>
                <span style={{ width: 80, fontSize: 10 }}>{labels.estimateGas}</span>
                <span style={{ width: 220, fontSize: 10 }}>
                  {this.stringField.get('estimateGas')
                    ? Number(this.stringField.get('estimateGas')).toLocaleString()
                    : ''}
                </span>
              </div>

              <Button variant="contained" color="primary" className={classes.button} type="submit">
                {labels.create}
              </Button>
            </Fragment>
          )}

          {!this.flags.get('isCreated') && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.address}</span>
                <input
                  type="text"
                  value={this.stringField.get('contractAddress') || ''}
                  // required={true}
                  onChange={this.handleChangeContractAddress}
                  // onBlur={this.getAbi}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.button} type="submit">
                {labels.add}
              </Button>
            </Fragment>
          )}
        </form>

        {this.flags.get('showDialog') && (
          <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />
        )}
      </Fragment>
    )
  }
}

export const StyleCreateContract = withStyles(styles)(CreateContract)

const CreateContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreateContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreateContractWrap)
