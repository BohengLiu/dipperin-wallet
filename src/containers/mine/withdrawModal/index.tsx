import { observable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Utils } from '@dipperin/dipperin.js'
import { withTranslation, WithTranslation } from 'react-i18next'
import swal from 'sweetalert2'

import { I18nCollectionMine } from '@/i18n/i18n'
import { ErrMsg } from '@/utils/constants'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { validateAddress } from '@/utils'

import styles from './styles'

interface WrapProps {
  onClose: () => void
  onConfirm: (address: string, value: string) => Promise<void | string>
  address: string
  balance: string
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionMine['withdraw']
}

@observer
export class WithdrawModal extends React.Component<IProps> {
  @observable
  targetAddress: string = ''
  @observable
  value: string = ''
  @observable
  withdrawAmountUnit: string

  constructor(props) {
    super(props)
    runInAction(() => {
      this.targetAddress = this.props.address
      this.value = `${this.formatBalance(this.props.balance)} DIP`
      this.withdrawAmountUnit = this.props.balance
    })
  }

  formatBalance(num: string) {
    const amount = Utils.fromUnit(num)
    if (amount.match(/^([0-9]+(\.[0-9]{1,6})?)/)) {
      return amount.match(/^([0-9]+(\.[0-9]{1,6})?)/)![0]
    } else {
      return '0'
    }
  }

  @action
  handleChangeTargetAddress = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^(0x)?[0-9a-f]{0,44}$/i.test(e.target.value.toLowerCase())) {
      this.targetAddress = e.target.value
    }
  }

  @action
  handleChangeValue = (e: React.ChangeEvent<{ value: string }>) => {
    if (/(^([1-9][0-9]*)?([0-9]\.[0-9]{0,6})?$)|^0$/i.test(e.target.value)) {
      this.value = e.target.value
    }
  }

  @action
  handleOnFocus = () => {
    this.value = this.value.replace(' DIP', '')
  }

  @action
  handleOnblur = () => {
    // get rid of 0.000000
    let fmtValue = this.value
    fmtValue = fmtValue.replace(/([0-9]*\.[0-9]*[1-9])(0*)$/, '$1')
    fmtValue = fmtValue.replace(/([0-9]*)\.$/, '$1')
    runInAction(() => {
      this.value = fmtValue + ' DIP'
      this.withdrawAmountUnit = Utils.toUnit(fmtValue)
    })
  }

  handleOnConfrim = async () => {
    try {
      validateAddress(this.targetAddress)
      const result = await this.props.onConfirm(this.targetAddress, this.withdrawAmountUnit)
      if (result) {
        throw new Error(result)
      }
      swal.fire({
        text: this.props.labels.success,
        icon: 'success',
        timer: 3000
      })
      this.props.onClose()
    } catch (e) {
      let text: string
      if (ErrMsg.hasOwnProperty(e.message)) {
        text = this.props.labels[ErrMsg[e.message]]
      } else {
        text = e.message
      }
      // switch (e.message) {
      //   case `no Balance`:
      //     text = this.props.labels.noBalance
      //     break
      //   case `Returned error: "this transaction already in tx pool"`:
      //     text = this.props.labels.inPoolError
      //     break
      //   case `invalid address`:
      //     text = this.props.labels.invalidAddress
      //     break
      //   case `noEnoughBalance`:
      //     text = this.props.labels.noEnoughBalance
      //     break
      //   case `ResponseError: Returned error: "this transaction already in tx pool"`:
      //     text = this.props.labels.alreadyInTxPool
      //     break
      //   case `ResponseError: Returned error: "tx nonce is invalid"`:
      //     text = this.props.labels.invalidNonce
      //     break
      //   case `ResponseError: Returned error: "new fee is too low to replace the old one"`:
      //     text = this.props.labels.tooLowfee
      //     break
      //   default:
      //     text = e.message
      // }
      swal.fire({
        icon: 'error',
        timer: 3000,
        text
      })
    }
  }

  render() {
    const { classes, onClose, labels } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <div className={classes.dialogMain}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            <span className={classes.dialogTitle}>{labels.withdraw}</span>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p className={classes.inputLabel}>{labels.receipt}</p>
            <textarea
              className={classes.input}
              style={{ height: '54px', marginBottom: '10px' }}
              value={this.targetAddress}
              onChange={this.handleChangeTargetAddress}
            />
            <p className={classes.inputLabel}>{labels.withdrawAmount}</p>
            <textarea
              className={classes.input}
              style={{ height: '36px' }}
              value={this.value}
              onChange={this.handleChangeValue}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnblur}
            />
            <p className={classes.postInfo}>
              {labels.availableAmount}
              {`${this.formatBalance(this.props.balance)} DIP`}
            </p>
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button
              variant="contained"
              className={classes.dialogBtn}
              style={{ background: '#F2F3F7' }}
              color="primary"
              onClick={onClose}
            >
              <span style={{ color: '#838899' }}>{labels.cancel}</span>
            </Button>
            <Button variant="contained" className={classes.dialogBtn} color="primary" onClick={this.handleOnConfrim}>
              {labels.confirm}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }
}

const WithdrawModalWithStyle = withStyles(styles)(WithdrawModal)

const WithdrawModalWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <WithdrawModalWithStyle {...other} labels={t('mine:withdraw')} />
}

export default withTranslation()(WithdrawModalWrap)
