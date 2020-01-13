import { BrowserWindow, Event, ipcMain } from 'electron'
import log from 'electron-log'
import settings from 'electron-settings'

import packageJSON from '../../package.json'
import doesDipperinExist from '../operations/doesDipperinExist'
import fetchDipperin, { cancelDipperinDownload } from '../operations/fetchDipperin'
import handleError from '../operations/handleError'
import { openDipperin, openTmp, deleteCSWallet, getChainDataDir, moveFiles } from '../operations/openFile'
// import {
//   killDipperin,
//   runDipperin,
//   runDipperinMiner,
//   dipperinIpcRequest,
//   getChainIpcPath
// } from '../operations/runDipperin'
import updateDipperin from '../operations/updateDipperin'
import DipperinManager from '../operations'

const UPDATE_VERSION = 'updateVersion'
const CANCEL_DIPPERIN_DOWNLOAD = 'cancelDipperinDownload'
const UPDATE_NODE = 'updateNode'
const SET_NODE_NET = 'setNodeNet'
const NODE_RESTART_SUCCESS = 'nodeRestartSuccess'

const OPEN_TMP = 'openTmp'
const OPEN_DIPPERIN = 'openDipperin'

const UPDATED = 'updated'
const DOWNLOADING = 'downloading'
const RUNNING = 'running'
const SET_NET = 'setNet'

// start/stop node
const START_NODE = 'startNode'
const STOP_NODE = 'stopNode'
// const START_MINER_NODE = 'startMinerNode'
const DELETE_CSWALLET = 'deleteCSWallet'
const DELETE_CSWALLET_SUCCESS = 'deleteCSWalletSuccess'
const DIPPERIN_IPC = 'dipperinIpc'
const DIPPERIN_IPC_RESPONSE = 'dipperinIpcResponse'
const CHAIN_IPC_PATH = 'chainIpcPath'
const CHAIN_DATA_DIR = 'chainDataDir'
const MOVE_CHAIN_DATA_DIR = 'moveChainDataDir'

export const START_MINER_NODE_FAILURE = 'startMinerNodeFailure'
export const START_NODE_FAILURE = 'startNodeFailure'
export const START_MINER_NODE_SUCCESS = 'startMinerNodeSuccess'
export const START_SUCCESS = 'startSucces'

export const MOVE_DATA_STATUS = 'moveDataStatus'

export const dipperinManager = new DipperinManager()

const initIPC = (mainWindow: BrowserWindow) => {
  // Check dipperin version and update
  ipcMain.on(UPDATE_VERSION, async (event: Event) => {
    await handleUpdateVersion(event, mainWindow)
  })

  ipcMain.on(CANCEL_DIPPERIN_DOWNLOAD, ()=>{
    cancelDipperinDownload()
  })

  // Update dipperin version
  ipcMain.on(UPDATE_NODE, async (event: Event) => {
    await handleUpdateDepperin(event, mainWindow)
  })

  // Set node net
  ipcMain.on(SET_NODE_NET, async (event: Event, netEnv: string) => {
    log.info(`change type ${netEnv}`)
    await handleUpdateNodeType(event, netEnv, mainWindow)
  })

  // Open file
  ipcMain.on(OPEN_TMP, openTmp)
  ipcMain.on(OPEN_DIPPERIN, openDipperin)
  ipcMain.on(DELETE_CSWALLET, async (event: Event, net: string) => {
    deleteCSWallet(net)
    event.sender.send(DELETE_CSWALLET_SUCCESS)
  })

  ipcMain.on(START_NODE, () => {
    log.info('start node')
    dipperinManager.runDipperin(settings.get('netEnv') as string, mainWindow)
  })

  ipcMain.on(STOP_NODE, () => {
    log.info('stop node')
    dipperinManager.killDipperin()
  })

  // ipcMain.on(START_MINER_NODE, () => {
  //   log.info('start miner node')
  //   dipperinManager.runDipperinMiner(settings.get('netEnv') as string, mainWindow)
  // })

  ipcMain.on(DIPPERIN_IPC, async (event: Event, rpcString: string) => {
    try {
      const response = await dipperinManager.ipcRequest(rpcString)
      event.sender.send(DIPPERIN_IPC_RESPONSE, response)
    } catch (e) {
      log.info('dipperin ipc error:', e.message)
      event.sender.send(DIPPERIN_IPC_RESPONSE, JSON.stringify({ error: { message: e.message } }))
    }
  })

  ipcMain.on(CHAIN_IPC_PATH, async (event: Event) => {
    const response = dipperinManager.dipperinIpcPath || ''
    event.sender.send(CHAIN_IPC_PATH, response)
  })

  ipcMain.on(CHAIN_DATA_DIR, (event: Event) => {
    const chainDataDir = getChainDataDir() || ''
    event.sender.send(CHAIN_DATA_DIR, chainDataDir)
  })

  ipcMain.on(MOVE_CHAIN_DATA_DIR, (event: Event, newPath: string) => {
    moveFiles(newPath, event)
  })
}

// Update node version
const handleUpdateDepperin = async (event: Event, mainWindow: BrowserWindow) => {
  log.info('Update dipperin')
  dipperinManager.killDipperin()
  await updateDipperin(mainWindow)
  // await runDipperin(settings.get('netEnv') as string, mainWindow)
  dipperinManager.runDipperin(settings.get('netEnv') as string, mainWindow)
  event.sender.send(NODE_RESTART_SUCCESS, UPDATED)
}

// Update version
const handleUpdateVersion = async (event: Event, mainWindow: BrowserWindow) => {
  try {
    const preDepperinVersion = settings.get('version')
    const isExist = await doesDipperinExist()

    if (!isExist) {
      event.sender.send(UPDATE_VERSION, DOWNLOADING)
      await fetchDipperin(mainWindow)
    } else {
      if (preDepperinVersion !== packageJSON.dipperin.version) {
        event.sender.send(UPDATE_VERSION, UPDATED)
        await updateDipperin(mainWindow)
      }
    }

    // await runDipperin(settings.get('netEnv') as string, mainWindow)
    dipperinManager.runDipperin(settings.get('netEnv') as string, mainWindow)
    event.sender.send(UPDATE_VERSION, RUNNING)
  } catch (err) {
    handleError(err)
  }
}

// Set node net
const handleUpdateNodeType = async (event, netEnv, mainWindow) => {
  settings.set('netEnv', netEnv)
  dipperinManager.killDipperin()
  // await runDipperin(netEnv, mainWindow)
  dipperinManager.runDipperin(netEnv, mainWindow)
  event.sender.send(NODE_RESTART_SUCCESS, SET_NET)
}

export const removeDipperin = () => {
  dipperinManager.removeAllListeners()
}

export default initIPC
