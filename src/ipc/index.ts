import { Event, ipcRenderer } from 'electron'
import {
  NODE_RESTART_SUCCESS,
  UPDATED,
  DOWNLOAD_PROGRESS,
  UPDATE_VERSION,
  SET_NODE_NET,
  UPDATE_NODE,
  OPEN_TMP,
  OPEN_DIPPERIN,
  START_NODE,
  STOP_NODE,
  START_SUCCESS,
  START_MINER_NODE_SUCCESS,
  START_MINER_NODE,
  START_NODE_FAILURE,
  START_MINER_NODE_FAILURE,
  DELETE_CSWALLET,
  DELETE_CSWALLET_SUCCESS,
  DIPPERIN_IPC,
  DIPPERIN_IPC_RESPONSE,
  CHAIN_IPC_PATH,
  CHAIN_DATA_DIR,
  MOVE_CHAIN_DATA_DIR,
  CANCEL_DIPPERIN_DOWNLOAD,
  MOVE_DATA_STATUS
} from '@/utils/constants'
import { getIsRemoteNode } from '@/utils/node'

export const onNodeRestart = (updateCallback: () => void, finallCallback: () => void) => {
  ipcRenderer.on(NODE_RESTART_SUCCESS, (_: Event, eventType: string) => {
    if (eventType === UPDATED) {
      // update success
      updateCallback()
    }
    finallCallback()
  })
}

export const onDownloadProgress = (cb: (progress: number) => void) => {
  ipcRenderer.on(DOWNLOAD_PROGRESS, (_: Event, progress: number) => {
    cb(progress)
  })
}

export const onUpdateVersion = (cb: (status: string) => void) => {
  ipcRenderer.on(UPDATE_VERSION, (_: Event, status: string) => {
    cb(status)
  })
}

export const onStartNodeSuccess = (cb: () => void) => {
  ipcRenderer.on(START_SUCCESS, () => {
    cb()
  })
}

export const onceStartNodeSuccess = (cb: () => void) => {
  ipcRenderer.once(START_SUCCESS, () => {
    cb()
  })
}

export const onceStartMinerNodeSuccess = (cb: () => void) => {
  ipcRenderer.on(START_MINER_NODE_SUCCESS, () => {
    cb()
  })
}

export const removeOnceStartMinerNodeSuccess = () => {
  ipcRenderer.removeAllListeners(START_MINER_NODE_SUCCESS)
}

export const onStartNodeFailure = (cb: () => void) => {
  ipcRenderer.once(START_NODE_FAILURE, () => {
    cb()
  })
}

export const onceStartMinerNodeFailure = (cb: () => void) => {
  ipcRenderer.once(START_MINER_NODE_FAILURE, () => {
    cb()
  })
}

export const removeOnceStartMinerNodeFailure = () => {
  ipcRenderer.removeAllListeners(START_MINER_NODE_FAILURE)
}

export const sendStartNode = () => {
  ipcRenderer.send(START_NODE)
}

export const sendStopNode = () => {
  ipcRenderer.send(STOP_NODE)
}

export const sendStartMineNode = () => {
  ipcRenderer.send(START_MINER_NODE)
}

export const sendUpdateVersion = () => {
  const isRemoteNode = getIsRemoteNode()
  if (!isRemoteNode) {
    // update local node version and start
    ipcRenderer.send(UPDATE_VERSION)
  }
}

export const setNodeNet = (net: string) => {
  ipcRenderer.send(SET_NODE_NET, net)
}

export const updateNode = () => {
  ipcRenderer.send(UPDATE_NODE)
}

export const openTmp = () => {
  ipcRenderer.send(OPEN_TMP)
}

export const openDipperin = () => {
  ipcRenderer.send(OPEN_DIPPERIN)
}

export const deleteCsWallet = (net: string) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(DELETE_CSWALLET, net)
    setTimeout(() => {
      reject(new Error('deleteCsWallet timeout!'))
    }, 5000)
    ipcRenderer.once(DELETE_CSWALLET_SUCCESS, () => {
      resolve()
    })
  })
}

// TODO: arrange the error
export const dipperinIpc = (rpcString: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      JSON.parse(rpcString)
    } catch (e) {
      reject(e)
    }
    const jsonRpc = JSON.parse(rpcString)
    if (typeof jsonRpc === 'object' && 'id' in jsonRpc) {
      // send
      ipcRenderer.send(DIPPERIN_IPC, rpcString)
      // handle response
      ipcRenderer.once(DIPPERIN_IPC_RESPONSE, (_: Event, response: string) => {
        const jsonResponse = JSON.parse(response)
        if (typeof jsonResponse === 'object' && 'id' in jsonResponse && jsonRpc.id === jsonResponse.id) {
          resolve(jsonResponse)
        } else if (typeof jsonResponse === 'object' && 'error' in jsonResponse) {
          reject(new Error(jsonResponse.error!.message))
        } else {
          resolve(response)
        }
      })
      setTimeout(() => {
        reject(new Error('dipperin ipc timeout'))
      }, 2000)
    } else {
      reject(new Error('incorrect input'))
    }
  })
}

export const getChainIpcPath = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(CHAIN_IPC_PATH)
    ipcRenderer.once(CHAIN_IPC_PATH, (_: Event, response) => {
      resolve(response)
    })
    setTimeout(() => {
      reject(`getChainIpcPath timeout`)
    }, 1500)
  })
}

export const getChainDataDir = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(CHAIN_DATA_DIR)
    ipcRenderer.once(CHAIN_DATA_DIR, (_: Event, response: string) => {
      resolve(response)
    })
    setTimeout(() => {
      reject('getChainIpcPath timeout')
    }, 1500)
  })
}

/**
 * @param newPath
 */
export const moveChainData = (newPath: string) => {
  ipcRenderer.send(MOVE_CHAIN_DATA_DIR, newPath)
}

export const moveChainDataListener = (cb: (success: boolean) => void) => {
  ipcRenderer.on(MOVE_DATA_STATUS, (_: Event, success: boolean) => {
    cb(success)
  })
}

export const cancelDipperinDownload = () => {
  ipcRenderer.send(CANCEL_DIPPERIN_DOWNLOAD)
}
