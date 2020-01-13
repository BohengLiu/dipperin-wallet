import Loading from '@/components/loading'
import LoadingStore from '@/stores/loading'
import WalletStore from '@/stores/wallet'
import { withStyles, WithStyles } from '@material-ui/core'
import classNames from 'classnames'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import selectNet from '@/components/chainNodeSetting'

// components
import Sidebar from '../components/sidebar'

// containers
import Main from '@/containers/main'
import CreateLayout from '../containers/createLayout'
import Import from '../containers/import'
import Login from '../containers/login'

// route config
import routes from './menuRouteConfig'

import { onUpdateVersion, sendUpdateVersion, onDownloadProgress, cancelDipperinDownload } from '@/ipc'

// images
import Logo from '../images/logo.png'

// style
import styles from './routeStyle'

const UPDATED = 'updated'
const DOWNLOADING = 'downloading'
const RUNNING = 'running'

interface Props extends RouteComponentProps<{}>, WithStyles<typeof styles>, WithTranslation {
  loading: LoadingStore
  wallet: WalletStore
}

@inject('loading', 'wallet')
@observer
class Routes extends React.Component<Props> {
  // @observable
  // showLoding: boolean = false
  @observable
  updateStatus: string = ''
  @observable
  progress: number = 0.005
  @observable
  cancelDownload: string = ''

  @action
  componentDidMount() {
    const isChinese = this.props.i18n.language === 'zh-CN'
    onUpdateVersion((status: string) => {
      switch (status) {
        case DOWNLOADING:
          this.props.loading.downloading = true
          this.newUpdateStatus(isChinese ? '下载中' : 'Downloading')
          break
        case UPDATED:
          this.props.loading.downloading = true
          this.newUpdateStatus(isChinese ? '更新中' : 'Updating')
          break
        case RUNNING:
          this.props.loading.downloading = false
          break
      }
    })
    // update dipperin version
    sendUpdateVersion()
    onDownloadProgress(this.updateProgress)

    this.cancelDownload = isChinese ? '取消' : 'Cancel'
  }

  @action
  newUpdateStatus = (status: string) => {
    this.updateStatus = status
  }

  @action
  updateProgress = (progress: number) => {
    if (progress > this.progress) {
      this.progress = progress
    }
  }

  handleCancelDipperinDownload = () => {
    cancelDipperinDownload()
    this.props.loading.downloading = false
  }

  render() {
    const {
      classes,
      location,
      history,
      wallet,
      loading: { downloading }
    } = this.props
    return (
      <Fragment>
        <Sidebar logo={Logo} routes={routes} location={location} history={history} wallet={wallet} />
        <div className={classNames(classes.main, { [classes.filter]: downloading })}>
          <Route path="/" exact={true} component={selectNet} />
          <Route path="/create" exact={true} component={selectNet} />
          <Switch location={location}>
            <Route path="/" exact={true} component={Import} />
            <Route path="/login" exact={true} component={Login} />
            <Route path="/create" component={CreateLayout} />
            <Route path="/main" component={Main} />
          </Switch>
        </div>
        {downloading && (
          <Loading
            title={this.updateStatus}
            progress={this.progress}
            onCancel={this.handleCancelDipperinDownload}
            cancelText={this.cancelDownload}
          />
        )}
      </Fragment>
    )
  }
}

export default withTranslation()(withStyles(styles)(Routes))
