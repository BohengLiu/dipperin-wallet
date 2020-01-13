// export const LOCALHOST = 'http://localhost:7783'
export const LOCALHOST = 'ws://localhost:8893'

/**
 * Settings
 */
export const WALLET_ID = 'walletId'
export const IS_REMOTE = 'isRemote'

/**
 * Wallet
 */

export const DEFAULT_ERR_TIMES = 0
export const DEFAULT_LOCK_TIME = ''
export const LOCKTIMES = 8 // wrong password times

/**
 * Account
 */

export const ACCOUNTS_PATH = `m/44'/709394'/0'/0`
export const FIRST_ACCOUNT_ID = '1'

/**
 * Transaction
 */

export const DEFAULT_HASH_LOCK = ''
// export const DEFAULT_CHAIN_ID = '0x01'
export const DEFAULT_CHAIN_ID = '0x02'

export const TRANSACTION_STATUS_PENDING = 'pending'
export const TRANSACTION_STATUS_SUCCESS = 'success'
export const TRANSACTION_STATUS_FAIL = 'fail'

export const TRANSACTION_LIMIT_TIME = 600000

/**
 * Contract
 */

/**
 * DB
 */

export const ACCOUNT_DB = 'account'
export const TRANSACTION_DB = 'transaction'
export const WALLET_DB = 'wallet'
export const CONTRACT_DB = 'contract'
export const VM_CONTRACT_DB = 'vmContrat'
export const FAVORITE_CONTRACT = 'favoriteContract'
export const OWNER_DB = 'owner'
export const RECEIPT_DB = 'receipt'
export const MINE_DB = 'mine'
export const CONFIG_DB = 'config'

export enum CONFIG_TYPE {
  CHAIN_DATA_DIR,
  MINER_MNEMONIC
}

/**
 * Worker
 */

export const FILTER_TRANSACTIONS_REQ = 'FILTER_TRANSACTIONS_REQ'
export const FILTER_TRANSACTIONS_RESP = 'FILTER_TRANSACTIONS_RESP'

/**
 * IPC
 */

export const NODE_RESTART_SUCCESS = 'nodeRestartSuccess'
export const UPDATE_VERSION = 'updateVersion'
export const SET_NODE_NET = 'setNodeNet'
export const UPDATE_NODE = 'updateNode'
export const DOWNLOAD_PROGRESS = 'downloadProgress'

export const UPDATED = 'updated'
export const NET_ENV = 'netEnv'

export const OPEN_TMP = 'openTmp'
export const OPEN_DIPPERIN = 'openDipperin'

export const START_NODE = 'startNode'
export const STOP_NODE = 'stopNode'
export const START_SUCCESS = 'startSucces'
export const START_NODE_FAILURE = 'startNodeFailure'
export const START_MINER_NODE = 'startMinerNode'
export const START_MINER_NODE_FAILURE = 'startMinerNodeFailure'
export const START_MINER_NODE_SUCCESS = 'startMinerNodeSuccess'
export const DELETE_CSWALLET = 'deleteCSWallet'
export const DELETE_CSWALLET_SUCCESS = 'deleteCSWalletSuccess'
export const DIPPERIN_IPC = 'dipperinIpc'
export const DIPPERIN_IPC_RESPONSE = 'dipperinIpcResponse'
export const CHAIN_IPC_PATH = 'chainIpcPath'
export const CHAIN_DATA_DIR = 'chainDataDir'
export const MOVE_CHAIN_DATA_DIR = 'moveChainDataDir'
export const CANCEL_DIPPERIN_DOWNLOAD = 'cancelDipperinDownload'

/**
 * node net
 */

export const DEFAULT_NET = 'venus'

export const VENUS = 'venus'
export const MERCURY = 'mercury'
export const TEST = 'test'
export const LOCAL = 'local'

export const CHAIN_ID_DIC = {
  [VENUS]: '0x02',
  [TEST]: '0x640',
  [LOCAL]: '0x641'
}

export const REMOTE_NET = {
  [VENUS]: 'remoteVenus',
  [TEST]: 'remoteTest'
}

// export const REMOTE_TEST = 'remoteTest'
// export const REMOTE_MECURY = 'remoteMecury'
// export const REMOTE_VENUS = 'remoteVenus'

/**
 * net/host obj
 */
export const NET_HOST_OBJ = {
  [TEST]: 'http://172.16.5.201:3035',
  // [REMOTE_TEST]: 'http://172.16.5.15:8999',
  // [REMOTE_MECURY]: 'http://14.17.65.122:3035'
  [VENUS]: 'http://14.17.65.122:3035'
  // [REMOTE_VENUS]: 'http://172.16.5.201:3035'
}
/**
 * timer event name
 */
export enum TIMET_NAME {
  CONNECTING = 'connecting'
}

export const VM_CONTRACT_ADDRESS = '0x00120000000000000000000000000000000000000000'

/**
 * move data event status
 */
export const MOVE_DATA_STATUS = 'moveDataStatus'

// key:error from backend  value:label in i18n config
export const ErrMsg = {
  'no Balance': 'noBalance',
  'Returned error: "this transaction already in tx pool"': 'inPoolError',
  'ResponseError: Returned error: "new fee is too low to replace the old one"': 'tooLowfee',
  'invalid address': 'invalidAddress',
  noEnoughBalance: 'noEnoughBalance',
  'ResponseError: Returned error: "this transaction already in tx pool"': 'alreadyInTxPool',
  'ResponseError: Returned error: "tx nonce is invalid"': 'invalidNonce',
  'Error: Network Error': 'networkError',
  'insufficient balance': 'noEnoughBalance'
}
