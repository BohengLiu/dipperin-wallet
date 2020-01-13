import { observable, when, action, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import Account from '@/containers/account'
// containers
import AccountInfo from '@/containers/accountInfo'
import Accounts from '@/containers/accounts'
import Setting from '@/containers/setting'
import Mine from '@/containers/mine'
// import SmartContract from '@/containers/smartContract'
import VmContract from '@/containers/vmContract'
// stores
import WalletStore from '@/stores/wallet'
import settings from '@/utils/settings'

// components
import MainTour from './mainTour'

interface Props extends RouteComponentProps<{}> {
  wallet: WalletStore
}

@inject('wallet')
@observer
class Main extends React.Component<Props> {
  @observable
  showAccounts: boolean = false
  @observable
  showTour: boolean = false

  constructor(props) {
    super(props)

    if (!props.wallet.isHaveWallet) {
      this.props.history.push('/')
      return
    }
    if (!props.wallet.isUnlock) {
      props.history.push('/login')
      return
    }

    when(
      () => props.wallet.showLock,
      () => {
        props.history.push('/login')
      }
    )
  }
  componentDidMount() {
    this.showGuide()
  }

  showAccountsPage = () => this.toogleAccountsPage(true)

  handleClose = () => this.toogleAccountsPage(false)

  @action
  toogleAccountsPage = (isShow: boolean) => (this.showAccounts = isShow)

  toogleTransferPage = (isSend: boolean) => {
    this.props.history.push('/main/wallet', { isSend })
  }

  showGuide = async () => {
    if (!settings.get('showAccountGuide')) {
      runInAction(() => {
        this.showTour = true
      })
    }
  }

  @action
  closeTour = () => {
    this.props.history.push('/main/wallet')
    this.handleClose()
    this.showTour = false
    settings.set('showAccountGuide', true)
  }

  render() {
    const { location, wallet } = this.props
    if (!wallet!.isHaveWallet || !wallet.isUnlock) {
      return null
    }
    return (
      <Fragment>
        <AccountInfo history={this.props.history} changeAccount={this.showAccountsPage} />
        <Switch location={location}>
          <Route path="/main/wallet" component={Account} />
          <Route path="/main/setting" component={Setting} />
          {/* <Route path="/main/contract" component={SmartContract} /> */}
          <Route path="/main/vm_contract" component={VmContract} />
          <Route path="/main/mine" component={Mine} />
        </Switch>
        {this.showAccounts && <Accounts handleClose={this.handleClose} history={this.props.history} />}
        {this.showTour && (
          <MainTour
            closeTour={this.closeTour}
            toogleAccountsPage={this.toogleAccountsPage}
            toogleTransferPage={this.toogleTransferPage}
          />
        )}
      </Fragment>
    )
  }
}

export default Main
