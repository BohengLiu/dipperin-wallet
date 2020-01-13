// import classnames from 'classnames'
import { observable, runInAction, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import _ from 'lodash'

import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import WalletStore from '../../stores/wallet'
import RootStore from '@/stores/root'
import styles from './loginStyle'

import settings from '@/utils/settings'
import { I18nCollectionWallet } from '@/i18n/i18n'

// lock time (ms)
const LOCKTIME = 7200000
// const LOCKTIME = 10000

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
  root: RootStore
}

interface ILoginProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionWallet['login']
}

@inject('wallet', 'root')
@observer
export class Login extends React.Component<ILoginProps> {
  @observable
  time = ''
  @observable
  password = ''
  @observable
  interval: NodeJS.Timer

  @action
  componentWillMount() {
    if (!this.props.wallet || !this.props.wallet.isHaveWallet) {
      this.props.history.replace('/')
      return
    }

    this.checkLock()
    this.interval = setInterval(this.checkLock, 1000)
    const { labels } = this.props
    document.title = labels.swal.documentTitle
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  @action
  checkLock = () => {
    const { wallet } = this.props

    const lockTime = wallet.lockTime
    if (lockTime) {
      const now = new Date().valueOf()
      const diffTime = Number(now) - Number(lockTime)
      const remainTime = LOCKTIME - diffTime
      this.time = `${addZero(Math.floor(remainTime / 3600000))} : ${addZero(
        Math.floor((remainTime % 3600000) / 60000)
      )} : ${addZero(Math.floor((remainTime % 60000) / 1000))}`
      if (diffTime < LOCKTIME) {
        wallet.toggleLock(true)
      } else {
        wallet.toggleLock(false)
      }
    }
  }

  @action
  passwordInput = e => {
    this.password = e.target.value
  }

  confirm = async () => {
    const { labels } = this.props
    // e.preventDefault()
    if (!this.password) {
      swal.fire({
        icon: 'error',
        title: labels.swal.emptyPassword
      })
      return
    }
    const { wallet, history } = this.props
    const loginRes = await wallet.unlockWallet(this.password)
    if (!loginRes) {
      await swal.fire({
        icon: 'error',
        title: labels.swal.incorrectPassword
      })
      runInAction(() => {
        this.password = ''
      })
      return
    }
    await swal.fire({
      text: labels.swal.success,
      icon: 'success',
      timer: 1000
    })

    history.push('/main/wallet')
  }

  confirmCallBack = _.debounce(this.confirm, 1000)

  handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    this.confirmCallBack()
  }

  // reset wallet
  handleReset = async () => {
    const { labels, root } = this.props
    const res = await swal.fire({
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: labels.swal.cancel,
      confirmButtonText: labels.swal.confirm,
      icon: 'warning',
      text: labels.swal.warnText,
      title: labels.swal.warn,
      reverseButtons: true
    })
    if (res.value) {
      root.clear(true)

      settings.set('showAccountGuide', false)

      this.props.history.push('/')
    }
  }

  render() {
    const { labels, classes, wallet } = this.props

    if (!wallet || !wallet.isHaveWallet) {
      return null
    }

    const { showLock, unlockErrTimes } = wallet
    // show reset btn
    const showReset = unlockErrTimes > 2 ? true : false
    return (
      <div className={classes.login}>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <p className={classes.title}>{labels.title}</p>

          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.password}</InputLabel>
            <Input type="password" autoFocus={true} value={this.password} onChange={this.passwordInput} />
          </FormControl>
          <Button
            disabled={!this.password}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.unlock}
          </Button>
          {showReset && (
            <Fragment>
              <p className={classes.resetText}>{labels.resetText}</p>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleReset}>
                {labels.resetWallet}
              </Button>
            </Fragment>
          )}
        </form>
        {showLock && (
          <div className={classes.timeLock}>
            <div className={classes.lockBg}>
              <p>{labels.lockText}</p>
              <p>{this.time}</p>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export const StyleLogin = withStyles(styles)(Login)
const LoginWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleLogin {...other} labels={t('wallet:login')} />
}

export default withTranslation()(LoginWrap)

// export default withNamespaces('login')(StyleLogin)

const addZero = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`
}
