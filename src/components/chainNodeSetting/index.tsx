import React, { ReactNode } from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { MenuItem, withStyles, WithStyles, Menu } from '@material-ui/core'
import { I18nCollectionWallet } from '@/i18n/i18n'
import os from 'os'
import pathModule from 'path'

import RootStore from '@/stores/root'
import { withTranslation, WithTranslation } from 'react-i18next'
import { netConfig } from './config'
import { CHAIN_DATA_DIR, IS_REMOTE } from '@/utils/constants'
import { sleep } from '@/utils'
import settings from '@/utils/settings'
import { setNodeNet } from '@/ipc'
import { setCurrentNet, setIsRemoteNode, getCurrentNet, getIsRemoteNode } from '@/utils/node'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  labels: I18nCollectionWallet['import']
  root?: RootStore
}

@inject('root')
@observer
class NodeSetting extends React.Component<Props> {
  @observable anchorEl: HTMLElement | null = null
  @observable chainDataDir: string = ''
  @observable currentNetI18key: string = ''
  @observable isRemote?: boolean
  chainDataDirInput: HTMLInputElement

  constructor(props: Props) {
    super(props)
    this.setChainDataDirFromSetting()
    this.setDefautNetFromSetting()
  }

  setDefautNetFromSetting = () => {
    const isRemote = getIsRemoteNode()
    const net = getCurrentNet()
    netConfig.forEach(item => {
      if (item.isRemote === isRemote && net === item.net) {
        this.setCurrentNetI18key(item.i18Key)
      }
    })
  }

  @action
  handleSelectNet = (e: React.MouseEvent) => {
    this.anchorEl = e.currentTarget as HTMLElement
  }

  @action
  handleClose = () => {
    this.anchorEl = null
  }

  seletNodeNet = (isRemote: boolean, net: string, i18Key: string) => () => {
    this.handleClose()
    if (this.currentNetI18key === i18Key) {
      return
    }
    this.setCurrentNetI18key(i18Key)
    // update settings netEnv
    setCurrentNet(net)
    // update isRemote in settings
    setIsRemoteNode(isRemote)
    // update isRemote in root store
    if (isRemote !== this.props.root!.isRemoteNode) {
      this.props.root!.toggleIsRemoteNode()
    }
    // disconnect node
    this.props.root!.stopConnectNode()

    if (isRemote) {
      // change provide
      this.props.root!.changeRemoteProvide(net)
    } else {
      // (ipc)restart local node with different net
      setNodeNet(net)
      // reconnect node in ipc event listener
      this.props.root!.reconnect()
    }
  }

  handleClickChangeDir = () => {
    this.chainDataDirInput.click()
  }

  handleChangeDir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const path = e.target.files[0].path
      if (this.chainDataDir === path) {
        return
      }
      this.setChainDataDir(path)
      // change chain data dir in settings
      settings.set(CHAIN_DATA_DIR, path)
      if (!settings.get(IS_REMOTE)) {
        this.props.root!.stopNode()
        await sleep(1000)
        this.props.root!.startNode()
      }
    }
  }

  chainDataDirRef = (instance: HTMLInputElement) => {
    if (instance) {
      instance.setAttribute('webkitdirectory', '')
      instance.setAttribute('directory', '')
      instance.setAttribute('multiple', '')
    }
    this.chainDataDirInput = instance
  }

  setChainDataDirFromSetting = () => {
    this.setChainDataDir(
      (settings.get(CHAIN_DATA_DIR) as string) || pathModule.join(os.homedir(), 'tmp', 'dipperin_apps')
    )
  }

  @action
  setChainDataDir = (path: string) => {
    this.chainDataDir = path
  }

  @action
  setCurrentNetI18key = (netI18Key: string) => {
    this.currentNetI18key = netI18Key
  }

  render() {
    const { classes, labels } = this.props
    return (
      <div className={classes.settingWrap}>
        <div className={classes.netWrap}>
          <div className={classes.select} onClick={this.handleSelectNet}>
            <p>{labels.select[this.currentNetI18key || 'selectNet']} </p>
            <span className={classes.icon}>{this.anchorEl ? '▲' : '▼'}</span>
          </div>
          <StyledMenu open={Boolean(this.anchorEl)} anchorEl={this.anchorEl} onClose={this.handleClose}>
            {netConfig.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  className={classes.item}
                  onClick={this.seletNodeNet(item.isRemote, item.net, item.i18Key)}
                >
                  {labels.select[item.i18Key]}
                </MenuItem>
              )
            })}
          </StyledMenu>
        </div>
        <div className={classes.dirSelect} onClick={this.handleClickChangeDir}>
          <p className={classes.dirLabel}>{labels.select.storage}</p>
          <p className={classes.chainDir} title={this.chainDataDir}>
            {this.chainDataDir}
          </p>
          <div className={classes.selectorIcon} />
        </div>
        <input
          type="file"
          onChange={this.handleChangeDir}
          ref={this.chainDataDirRef}
          style={{ opacity: 0, zIndex: -1, width: 1, height: 1, position: 'absolute', left: 100 }}
        />
      </div>
    )
  }
}

const StyleCompoent = withStyles(styles)(NodeSetting)

const styleCompoentWithI18 = (props: WithTranslation) => {
  const { t } = props
  return <StyleCompoent labels={t('wallet:import')} />
}

export default withTranslation()(styleCompoentWithI18)

interface StyleMenu {
  children: ReactNode
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
}

const StyledMenu = withStyles({
  paper: {
    marginTop: 10,
    width: 166,
    border: '1px solid rgba(255,255,255,.6)',
    background: 'rgba(255,255,255,.1)'
  }
})((props: StyleMenu) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
))
