import classNames from 'classnames'
import i18next from 'i18next'
import { observable, action, reaction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import { getShowName } from '@/utils'

import { I18nCollectionAccount } from '@/i18n/i18n'
import ChangeAccount from '@/images/change-account.png'
import Lock from '@/images/lock-wallet.png'
import WhiteLock from '@/images/whiteLock.png'
import AccountStore from '@/stores/account'
import WalletStore from '@/stores/wallet'
import RootStore from '@/stores/root'
import { Button, Fab } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// import {
// sendStartNode,
// sendStopNode,
// onStartNodeSuccess
// } from '@/ipc'

import Start from '@/images/reset.png'
import Stop from '@/images/reset.png'
import Loading from '@/images/loading.png'

import styles from './accountStyle'

interface Props extends WithStyles<typeof styles>, WrapperProps {
  root?: RootStore
  wallet?: WalletStore
  account?: AccountStore
  labels: I18nCollectionAccount['accountInfo']
  language: string
  changeLanguage: (lng: string, callback?: i18next.Callback | undefined) => void
}

@inject('wallet', 'account', 'root')
@observer
export class AccountInfo extends React.Component<Props> {
  @observable
  showInfo: boolean = false
  @observable
  nodeRuning: boolean = false
  @observable
  loading: boolean = false
  @observable
  timer: NodeJS.Timer

  constructor(props: Props) {
    super(props)
    if (props.root!.isConnecting) {
      this.changeNodeRunning(true)
    }

    reaction(
      () => props.root!.isConnecting,
      (isConnecting: boolean) => {
        this.changeNodeRunning(isConnecting)
        // setTimeout(() => {
        // }, 1000)
      }
    )

    // onStartNodeSuccess(this.nodeStartSuccess)
  }

  componentDidMount() {
    window.addEventListener('click', this.closeInfo)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeInfo)
  }

  // nodeStartSuccess = () => {
  //   this.timer = setTimeout(() => {
  //     // this.changeLoading(false)
  //     // this.changeNodeRunning(true)
  //     this.props.root!.reconnect()
  //   }, 1000)
  // }

  @action
  changeNodeRunning = (flag: boolean) => {
    this.changeLoading(false)
    this.nodeRuning = flag
  }

  @action
  changeLoading = (flag: boolean) => {
    this.loading = flag
  }

  @action
  closeInfo = () => {
    this.showInfo = false
  }

  stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // lock wallet
  handleLock = () => {
    this.props.history.push('/login')
  }

  // change language
  handleChangeLang = () => {
    const lang = this.props.language
    this.props.changeLanguage(lang === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  // stop/start local node
  handleToggleNode = () => {
    if (this.loading) {
      return
    }
    if (this.nodeRuning) {
      // stop node
      this.changeLoading(true)
      // sendStopNode()
      this.props.root!.stopNode()
      // this.props.root!.stopConnectNode()
    } else {
      // start node
      this.changeLoading(true)
      // sendStartNode()
      this.props.root!.startNode()
    }
  }

  formatNumber = (num: number, w: number) => {
    const m = 10 ** w
    const b = Math.floor(num * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  render() {
    const { classes, labels, changeAccount, account, root } = this.props
    // const { blockInfo } = wallet!
    const { activeAccount } = account!
    const { isRemoteNode, isMovingData } = root!
    if (!activeAccount) {
      return null
    }
    const name = activeAccount.name ? activeAccount.name : `${labels.account} ${activeAccount.id}`
    const shortName = getShowName(name)

    return (
      <div className={classes.accountInfo}>
        <Button className={classes.changeBtn}>
          <div
            onClick={changeAccount}
            className={classNames(classes.left, { ['small-font']: String(activeAccount.id).length > 2 })}
            data-tour="change-account"
          >
            {activeAccount.id}
            <img className={classes.changeImg} src={ChangeAccount} alt="" draggable={false} />
          </div>
        </Button>
        <div className={classes.right} id="selector1">
          <p title={name}>{shortName}</p>
          <p>
            {this.formatNumber(Number(activeAccount.balance), 6)}
            <span>&nbsp;&nbsp;DIP</span>
          </p>
          {Number(activeAccount.lockMoney) > 0 && (
            <p>
              <img src={WhiteLock} />
              <span> &nbsp;{this.formatNumber(Number(activeAccount.lockMoney), 6)} &nbsp;DIP</span>
            </p>
          )}
          <p>{activeAccount.address}</p>
        </div>
        <div className={classes.btnWrap}>
          {!isRemoteNode && !isMovingData && (
            <div className={classNames(classes.btnItem, classes.nodeSwitch)}>
              <Fab
                className={classNames(classes.btn, { [classes.running]: this.nodeRuning })}
                onClick={this.handleToggleNode}
              >
                {this.loading ? (
                  <img src={Loading} className={classes.loading} />
                ) : this.nodeRuning ? (
                  <img src={Stop} />
                ) : (
                  <img src={Start} />
                )}
              </Fab>
              <p>{this.nodeRuning ? labels.stop : labels.start}</p>
            </div>
          )}
          <div className={classNames(classes.btnItem, classes.lock)}>
            <Fab className={classes.btn} onClick={this.handleLock}>
              <img src={Lock} />
            </Fab>
            <p>{labels.lock}</p>
          </div>
          <div className={classNames(classes.btnItem, classes.global)}>
            <Fab className={classes.btn} onClick={this.handleChangeLang}>
              <span>{labels.langAb}</span>
            </Fab>
            <p>{labels.langAb}</p>
          </div>
        </div>
      </div>
    )
  }
}

export const AccountInfoWithStyle = withStyles(styles)(AccountInfo)

interface WrapperProps extends Pick<RouteComponentProps, 'history'> {
  changeAccount: (...args: any[]) => void
}

const AccountInfoWrapper = (props: WithTranslation & WrapperProps) => {
  const { t, i18n, ...other } = props

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <AccountInfoWithStyle
      {...other}
      language={i18n.language}
      changeLanguage={changeLanguage}
      labels={t('account:accountInfo')}
    />
  )
}

export default withTranslation()(AccountInfoWrapper)
