import React from 'react'
import classNames from 'classnames'
import AccountModel from '@/models/account'
import { withStyles, WithStyles, Button } from '@material-ui/core'
import DropButtons from '@/components/dropButtons'
import swal from 'sweetalert2'
import { I18nCollectionAccount } from '@/i18n/i18n'
import styles from '../accountsStyle'
import { getShowName } from '@/utils'
import { observer } from 'mobx-react'

import Copy from '@/images/copy.png'
// import Edit from '@/images/edit.png'

interface BigAccountProps extends WithStyles<typeof styles> {
  account: AccountModel
  activeId: string
  handleChangeActiveAccount: (id: string) => void
  labels: I18nCollectionAccount['accounts']
  showDialogConfirm: (account: AccountModel) => void
  deleteAccount: (id: string) => void
}
@observer
export class BigAccount extends React.Component<BigAccountProps> {
  handleChangeActiveAccount = () => {
    this.props.handleChangeActiveAccount(this.props.account.id)
  }
  copyAddress = (address: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        icon: 'success',
        timer: 1500,
        title: this.props.labels.copySuccess
      })
    }
    document.body.removeChild(input)
  }
  editAccountName = (): void => {
    const { showDialogConfirm, account } = this.props
    showDialogConfirm(account)
  }
  removeAccount = () => {
    const {
      account: { id },
      activeId,
      deleteAccount
    } = this.props
    if (id === activeId) {
      swal.fire({
        showCloseButton: false,
        icon: 'warning',
        timer: 2000,
        text: this.props.labels.deleteAccountWarning
      })
      return
    }
    deleteAccount(id)
  }

  formatNumber = (num: number, w: number) => {
    const m = 10 ** w
    const b = Math.floor(num * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  render() {
    const { classes, account, activeId, labels } = this.props
    const defaultName = account.name ? account.name : `${labels.account}${account.id}`
    const showName = getShowName(defaultName)
    const btnArr = [
      {
        label: labels.modifyName,
        handleFunc: this.editAccountName
      },
      {
        label: labels.deleteAccount,
        handleFunc: this.removeAccount
      }
    ]
    return (
      <div className={classNames(classes.bigItem, 'tour-account')} onClick={this.handleChangeActiveAccount}>
        <div className={classes.moreWrap}>
          <DropButtons btnArray={btnArr} />
        </div>
        <div className={classes.bigAccountName}>
          <span>{showName}</span>
        </div>
        <div className={classNames(classes.bigId, { ['small-font']: String(account.id).length > 2 })}>{account.id}</div>
        <p className={classes.bigBalance} title={account.balance}>
          {this.formatNumber(Number(account.balance), 6)}
        </p>
        <p className={classes.bigDip}>DIP</p>
        <p className={classes.bigAddress}>{account.address}</p>
        <Button className={classes.copy} onClick={this.copyAddress.bind(this, account.address)}>
          <img src={Copy} alt="" title="copy" />
        </Button>
        {account.id === activeId && <img className={classes.current} src={labels.currentAccount} alt="" />}
      </div>
    )
  }
}

export default withStyles(styles)(BigAccount)
