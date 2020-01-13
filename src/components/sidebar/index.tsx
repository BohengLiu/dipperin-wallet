import React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import classNames from 'classnames'
import { withTranslation, WithTranslation } from 'react-i18next'
import { NavLink, RouteComponentProps } from 'react-router-dom'

import { Drawer, Hidden, List, ListItem, ListItemText, Tooltip, ClickAwayListener } from '@material-ui/core'
// @material-ui/core components
import { withStyles, WithStyles } from '@material-ui/core/styles'

// core components
import { DashboardRoutes } from '../../routes/menuRouteConfig'
import WalletStore from '@/stores/wallet'

import PackageJson from '@/../package.json'
import { formatUTCTime } from '@/utils'
import { I18nCollectionWallet } from '@/i18n/i18n'
import style from './sidebarStyle'

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface Props extends WithStyles<typeof style>, WrapProps {
  labels: I18nCollectionWallet['sidebar']
}

@observer
export class Sidebar extends React.Component<Props> {
  @observable isShowWalletInfo: boolean = false
  @action showWalletInfo = () => {
    this.isShowWalletInfo = true
  }
  @action hideWalletInfo = () => {
    this.isShowWalletInfo = false
  }
  backToHome = () => {
    this.props.history.push('/')
  }

  drawerDisable = (pathname: string) => {
    switch (true) {
      case Boolean(pathname.match('/wallet')):
      case Boolean(pathname.match('/contract')):
      case Boolean(pathname.match('/vm_contract')):
      case Boolean(pathname.match('/setting')):
      case Boolean(pathname.match('/mine')):
        return false
      default:
        return true
    }
  }

  render() {
    const {
      location,
      classes,
      logo,
      image,
      routes,
      labels,
      wallet: { blockInfo }
    } = this.props
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName: string): boolean => {
      return location.pathname.indexOf(routeName) > -1
    }
    const drawerDisable = this.drawerDisable(location.pathname) // TODO with router
    const links = (
      <List className={classes.list}>
        {routes.map((prop, key) => {
          if ('redirect' in prop) {
            return null
          }
          const isActive = activeRoute(prop.path)
          const listItemClasses = classNames({
            [classes.active]: isActive
          })
          const whiteFontClasses = classNames({
            [classes.whiteFont]: isActive
          })
          return (
            <NavLink
              to={prop.path}
              className={classNames(classes.item, {
                [classes.setting]: prop.path.match('/main/setting'),
                ['tour-setting']: prop.path.match('/main/setting')
              })}
              activeClassName="active"
              key={key}
            >
              <ListItem button={false} className={classNames(classes.itemLink, listItemClasses)}>
                <div className={classes.iconWrap}>
                  <img className={classes.icon} draggable={false} src={isActive ? prop.iconActive : prop.icon} />
                </div>
                <ListItemText
                  primary={labels[prop.sidebarName]}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          )
        })}
      </List>
    )
    const brand = (
      <div className={classes.logo} onClick={this.showWalletInfo}>
        <a className={classes.logoLink}>
          <div className={classes.logoImage}>
            <img src={logo} alt="logo" className={classes.img} />
          </div>
        </a>
        <ClickAwayListener onClickAway={this.hideWalletInfo}>
          <div className={classNames('blockInfo', this.isShowWalletInfo && 'activeInfo')}>
            <div className={classes.infoDetail}>
              <div className={classes.infoTitle}>{labels.title}</div>
              <div className={classes.infoItem}>
                <div className={classes.infoIcon} />
                <div className={classes.itemLabel}>{labels.walletVersion}:</div>
                <div className={classes.itemValue}>{PackageJson.version}</div>
              </div>
              <div className={classes.infoItem}>
                <div className={classes.infoIcon} />
                <div className={classes.itemLabel}>{labels.dipperinVersion}:</div>
                <div className={classes.itemValue}>{PackageJson.dipperin.version}</div>
              </div>
              <div className={classes.infoItem}>
                <div className={classes.infoIcon} />
                <div className={classes.itemLabel}>{labels.height}:</div>
                <div className={classes.itemValue}>{blockInfo && Number(blockInfo.number)}</div>
              </div>
              <div className={classes.infoItem}>
                <div className={classes.infoIcon} />
                <div className={classes.itemLabel}>{labels.timestamp}:</div>
                <Tooltip title={(blockInfo && formatUTCTime(String(Number(blockInfo.timestamp)))) || ''}>
                  <div className={classes.itemValue}>
                    {blockInfo && formatUTCTime(String(Number(blockInfo.timestamp)))}
                  </div>
                </Tooltip>
              </div>
              <div className={classes.infoItem}>
                <div className={classes.infoIcon} />
                <div className={classes.itemLabel}>Nonce:</div>
                <Tooltip title={(blockInfo && blockInfo.nonce) || ''} classes={{ tooltip: classes.noMaxWidth }}>
                  <div className={classes.itemValue}>{blockInfo && blockInfo.nonce}</div>
                </Tooltip>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      </div>
    )
    return (
      <div>
        <Hidden smDown={true} implementation="css">
          <Drawer
            anchor="left"
            variant="permanent"
            open={true}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {brand}
            <div className={classes.sidebarWrapper}>{links}</div>
            {image !== undefined && (
              <div className={classes.background} style={{ backgroundImage: 'url(' + image + ')' }} />
            )}
          </Drawer>
        </Hidden>
        {drawerDisable && <div className={classes.shadow} />}
      </div>
    )
  }
}

export const StyleSidebar = withStyles(style)(Sidebar)

interface WrapProps extends Pick<RouteComponentProps, 'history' | 'location'> {
  wallet: WalletStore
  logo: string
  routes: DashboardRoutes[]
  color?: 'info' | 'success' | 'warning' | 'danger' | 'primary'
  image?: string
}
// export default withNamespaces()(withStyles(style)(Sidebar))

const SidebarWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleSidebar {...other} labels={t('wallet:sidebar')} />
}

export default withTranslation()(SidebarWrap)
