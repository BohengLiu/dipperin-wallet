import Nedb from 'nedb'

import { AccountObj } from '@/models/account'
import { ContractObj } from '@/models/contract'
import { WalletObj } from '@/models/wallet'
import ReceiptModel from '@/models/receipt'
// import { OwnerAddressDb } from '@/stores/contract'
import {
  ACCOUNT_DB,
  CONTRACT_DB,
  DEFAULT_NET,
  FAVORITE_CONTRACT,
  OWNER_DB,
  TRANSACTION_DB,
  TRANSACTION_STATUS_SUCCESS,
  WALLET_DB,
  VM_CONTRACT_DB,
  RECEIPT_DB,
  MINE_DB // FIXME: to remove
  // CONFIG_DB
} from '@/utils/constants'

import { TransactionInterface } from '../models/transaction'
import { VmContractObj } from '@/models/vmContract'

const getDB = (type: string): Nedb => {
  const { remote } = require('electron')
  const path = remote.app.getPath('userData')
  return new Nedb({ filename: `${path}/${type}.db`, autoload: true })
}

export const getAccount = async (): Promise<AccountObj[]> => {
  const db = getDB(ACCOUNT_DB)

  let account: AccountObj[] = []
  account = (await new Promise(resolve => {
    db.find({})
      .sort({ id: 1 })
      .exec((_, res: AccountObj[]) => {
        resolve(res)
      })
  })) as AccountObj[]
  return account
}
export const updateSingleAccount = async (account: AccountObj) => {
  const db = getDB(ACCOUNT_DB)
  await new Promise(resolve => {
    db.update({ id: account.id }, { $set: account }, {}, (err, _) => {
      resolve(true)
    })
  })
}

export const insertAccount = async (account: AccountObj[] | AccountObj) => {
  const db = getDB(ACCOUNT_DB)
  await new Promise(resolve => {
    db.insert(account, (_, res) => {
      resolve(true)
    })
  })
}

export const removeAccount = async (id: number) => {
  const db = getDB(ACCOUNT_DB)
  await new Promise(resolve => {
    db.remove({ id }, (_, res) => {
      resolve(true)
    })
  })
}

export const getTx = async (address: string, net: string = DEFAULT_NET): Promise<TransactionInterface[]> => {
  const db = getDB(TRANSACTION_DB)
  const tx = (await new Promise(resolve => {
    db.find({
      $or: [
        { from: address },
        { to: address, status: TRANSACTION_STATUS_SUCCESS },
        { from: address.toLocaleLowerCase() },
        { to: address.toLocaleLowerCase(), status: TRANSACTION_STATUS_SUCCESS }
      ],
      net
    })
      .sort({ timestamp: 1 })
      .exec((_, res: TransactionInterface[]) => {
        resolve(res)
      })
  })) as TransactionInterface[]
  return tx
}

export const getContractTx = async (
  address: string,
  contractAddress: string,
  net: string = DEFAULT_NET
): Promise<TransactionInterface[]> => {
  const db = getDB(TRANSACTION_DB)

  const tx = (await new Promise(resolve => {
    db.find({ from: address, to: contractAddress, net })
      .sort({ timestamp: 1 })
      .exec((_, res: TransactionInterface[]) => {
        resolve(res)
      })
  })) as TransactionInterface[]
  return tx
}

export const insertTx = (tx: TransactionInterface, net: string = DEFAULT_NET) => {
  const db = getDB(TRANSACTION_DB)
  db.update({ _id: tx.transactionHash, net }, { $set: { ...tx, net } }, { upsert: true })
}

export const updateTx = (txHash: string, updateObj: any, net: string = DEFAULT_NET) => {
  const db = getDB(TRANSACTION_DB)
  db.update({ _id: txHash, net }, { $set: updateObj })
}

/**
 * insert wallet
 */

export const insertWallet = (walletObj: WalletObj) => {
  const db = getDB(WALLET_DB)
  db.update({ walletId: walletObj.walletId }, walletObj, { upsert: true })
}

/**
 * get walelt by walelt id
 */

export const getWallet = async (walletId?: number): Promise<WalletObj | undefined> => {
  const db = getDB(WALLET_DB)

  const wallet = (await new Promise(resolve => {
    db.find({ walletId }, (_, res) => {
      resolve(res[0])
    })
  })) as WalletObj | undefined

  return wallet
}

/**
 * get active account id
 */

export const getActiveId = async (walletId: number): Promise<string> => {
  const db = getDB(WALLET_DB)

  const activeId = (await new Promise(resolve => {
    db.find({ walletId }, (_, res: WalletObj[]) => {
      resolve(res[0] ? res[0].activeAccountId : '1')
    })
  })) as string

  return activeId
}

export const getErrTimes = async (walletId: number): Promise<number> => {
  const db = getDB(WALLET_DB)

  const errTimes = (await new Promise(resolve => {
    db.find({ walletId }, (_, res: WalletObj[]) => {
      resolve(res[0] ? res[0].unlockErrTimes : 0)
    })
  })) as number

  return errTimes
}

export const getLockTime = async (walletId: number): Promise<string> => {
  const db = getDB(WALLET_DB)
  const lockTime = (await new Promise(resolve => {
    db.find({ walletId }, (_, res: WalletObj[]) => {
      resolve(res[0] ? res[0].lockTime : '')
    })
  })) as string

  return lockTime
}

export const updateLockTime = (walletId: number, lockTime: string) => {
  const db = getDB(WALLET_DB)
  db.update({ walletId }, { $set: { lockTime } })
}

export const updateActiveId = (walletId: number, activeAccountId: string) => {
  const db = getDB(WALLET_DB)
  db.update({ walletId }, { $set: { activeAccountId } })
}

export const updateErrTimes = (walletId: number, unlockErrTimes: number = 0) => {
  const db = getDB(WALLET_DB)
  db.update({ walletId }, { $set: { unlockErrTimes } })
}

/**
 * vm contract
 */
export const deleteVmContract = async (txHash: string) => {
  const db = getDB(VM_CONTRACT_DB)
  await new Promise(resolve => {
    db.remove({ txHash }, (_, res) => {
      resolve(true)
    })
  })
}

export const insertVmContract = (contract: VmContractObj, net: string = DEFAULT_NET) => {
  const db = getDB(VM_CONTRACT_DB)
  db.update({ txHash: contract.txHash }, { $set: { ...contract, net } }, { upsert: true })
}

export const updateVmContractStatus = (
  txHash: string,
  status: string,
  contractAddress: string,
  net: string = DEFAULT_NET
) => {
  const db = getDB(VM_CONTRACT_DB)
  db.update({ txHash, net }, { $set: { status, contractAddress } }, { multi: true })
}

export const updateVmContract = async (contract: VmContractObj) => {
  const db = getDB(VM_CONTRACT_DB)
  await new Promise(resolve => {
    db.update({ txHash: contract.txHash }, { $set: contract }, {}, (err, _) => {
      resolve(true)
    })
  })
}

export const getVmContract = async (net: string = DEFAULT_NET): Promise<VmContractObj[]> => {
  const db = getDB(VM_CONTRACT_DB)
  const contracts = (await new Promise(resolve => {
    db.find({ net }, (err, res) => {
      resolve(res)
    })
  })) as VmContractObj[]

  return contracts
}

/**
 * contract
 */
export const insertContract = (contract: ContractObj, net: string = DEFAULT_NET) => {
  const db = getDB(CONTRACT_DB)
  db.update({ contractAddress: contract.contractAddress }, { $set: { ...contract, net } }, { upsert: true })
}

export const updateContractStatus = (contractAddress: string, status: string, net: string = DEFAULT_NET) => {
  const db = getDB(CONTRACT_DB)
  db.update({ contractAddress, net }, { $set: { status } }, { multi: true })
}

export const getContract = async (net: string = DEFAULT_NET): Promise<ContractObj[]> => {
  const db = getDB(CONTRACT_DB)
  const contracts = (await new Promise(resolve => {
    db.find({ net }, (err, res) => {
      resolve(res)
    })
  })) as ContractObj[]

  return contracts
}

export const insertFavoriteContract = (
  address: string,
  contractAddress: string,
  balance: string,
  net: string = DEFAULT_NET
) => {
  const db = getDB(FAVORITE_CONTRACT)
  db.update({ address, contractAddress, net }, { $set: { balance } }, { upsert: true })
}

export const updateFavoriteContract = (
  address: string,
  contractAddress: string,
  balance: string,
  net: string = DEFAULT_NET
) => {
  const db = getDB(FAVORITE_CONTRACT)

  db.update({ address, contractAddress, net }, { $set: { balance } })
}

export const getFavoriteContract = async (address: string, net: string = DEFAULT_NET): Promise<Map<string, string>> => {
  const db = getDB(FAVORITE_CONTRACT)
  const contracts = new Map()
  await new Promise(resolve => {
    db.find({ address, net }, (_, res) => {
      res.forEach(favorite => {
        contracts.set(favorite.contractAddress, favorite.balance)
      })
      resolve()
    })
  })

  return contracts
}

export const insertOwnerAddress = (
  accountAddress: string,
  contractAddress: string,
  ownerAddress: string,
  net: string
) => {
  const db = getDB(OWNER_DB)
  db.insert({ accountAddress, contractAddress, ownerAddress, net })
}

/**
 * receipt
 */
export const insertReceipt = (receipt: ReceiptModel, address: string, net: string = DEFAULT_NET) => {
  const db = getDB(RECEIPT_DB)
  db.update({ txHash: receipt.transactionHash }, { $set: { ...receipt, address, net } }, { upsert: true })
}

export const getReceipt = async (net: string = DEFAULT_NET): Promise<ReceiptModel[]> => {
  const db = getDB(RECEIPT_DB)
  const receipts = (await new Promise((resolve, reject) => {
    db.find({ net }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })) as ReceiptModel[]

  return receipts
}

// export const getOwnerAddress = async (
//   accountAddress: string,
//   contractAddress: string,
//   net: string
// ): Promise<OwnerAddressDb[]> => {
//   const db = getDB(OWNER_DB)
//   let ownerAddress: OwnerAddressDb[] = []
//   await new Promise(resolve => {
//     db.find({ accountAddress, contractAddress, net }, (_, res) => {
//       ownerAddress = res
//       resolve()
//     })
//   })
//   return ownerAddress
// }

/**
 * mine db
 */
export const insertMinerData = async (mnemonic: string) => {
  const db = getDB(MINE_DB)
  const minerData = {
    mnemonic,
    updateTime: new Date().valueOf()
  }
  await new Promise((resolve, reject) => {
    db.insert(minerData, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

export const removeMinerData = async () => {
  const db = getDB(MINE_DB)
  await new Promise((resolve, reject) => {
    db.remove({}, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

export const getMiner = (): Promise<{ mnemonic: string; updateTime: number }> => {
  const db = getDB(MINE_DB)

  return new Promise((resolve, reject) => {
    db.find({}).exec((err, res: any[]) => {
      if (err) {
        reject(err)
      }
      if (res.length > 0) {
        const result = {
          mnemonic: res[0]!.mnemonic as string,
          updateTime: res[0].updateTime as number
        }
        resolve(result)
      } else {
        resolve(undefined)
      }
    })
  })
}

/**
 * config db
 */
// interface ConfigData {
//   type: number
//   content: string
//   ut?: number
// }

// export const insertConfigData = async (config: ConfigData) => {
//   const db = getDB(CONFIG_DB)
//   const minerData = {
//     ...config,
//     ut: new Date().valueOf()
//   }
//   await new Promise((resolve, reject) => {
//     db.insert(minerData, (err, res) => {
//       if (err) {
//         reject(err)
//       }
//       resolve(true)
//     })
//   })
// }

// export const removeConfigData = async (type: number) => {
//   const db = getDB(CONFIG_DB)
//   await new Promise((resolve, reject) => {
//     db.remove({type}, (err, res) => {
//       if (err) {
//         reject(err)
//       }
//       resolve(true)
//     })
//   })
// }

// export const getConfigData = (type: number): Promise<ConfigData> => {
//   const db = getDB(CONFIG_DB)

//   return new Promise((resolve, reject) => {
//     db.findOne({type},(err, res: ConfigData) => {
//       if (err) {
//         reject(err)
//       }
//       if (res) {
//         resolve(res)
//       } else {
//         resolve(undefined)
//       }
//     })
//   })
// }

export const resetDB = () => {
  getDB(ACCOUNT_DB).remove({}, { multi: true })
  getDB(TRANSACTION_DB).remove({}, { multi: true })
  getDB(WALLET_DB).remove({}, { multi: true })
  getDB(CONTRACT_DB).remove({}, { multi: true })
  getDB(FAVORITE_CONTRACT).remove({}, { multi: true })
  getDB(OWNER_DB).remove({}, { multi: true })
  getDB(VM_CONTRACT_DB).remove({}, { multi: true })
  getDB(MINE_DB).remove({}, { multi: true })
  // getDB(CONFIG_DB).remove({}, { multi: true })
}
