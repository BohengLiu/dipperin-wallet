import { shell, Event } from 'electron'
import settings from 'electron-settings'
import log from 'electron-log'
import os from 'os'
import path from 'path'
import fs from 'fs'
import fsExtra from 'fs-extra'
import util from 'util'
import rimraf from 'rimraf'

import dipperinPath from '../utils/dipperinPath'
import { getNodeEnv, CHAIN_DATA_DIR } from './runDipperin'
import { MOVE_DATA_STATUS } from '../ipc'

const fsExists = util.promisify(fs.stat)
const noop = () => null

export const openTmp = () => {
  const net: string = settings.get('netEnv') as string
  const appDir = settings.get(CHAIN_DATA_DIR) as string | undefined || path.join(os.homedir(), `tmp`, `dipperin_apps`)
  const chainDataDir = path.join(appDir, `${getNodeEnv(net)}`, `wallet`)
  const chainLogPath = path.join(`${chainDataDir}`, `dipperin.log`)

  shell.showItemInFolder(chainLogPath)
}

export const openDipperin = () => {
  shell.showItemInFolder(dipperinPath())
}

export const deleteCSWallet = (net: string) => {
  const chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  const csWalletPath = path.join(`${chainDataDir}`, `CSWallet`)
  fsExists(csWalletPath)
    .then(() => {
      fsExtra.remove(csWalletPath)
    })
    .catch(noop)
}

export const getChainDataDir = () => {
  const net: string = settings.get('netEnv') as string
  const chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  return chainDataDir
}

/**
 * the function serves for the requirement that user need to change
 * @param oldPath
 * @param newPath
 */
export const moveFiles = (newPath: string, event: Event) => {
  const oldChainDataDir = settings.get(CHAIN_DATA_DIR) as string || path.join(os.homedir(), `tmp`, `dipperin_apps`)
  const oldPath = path.join(oldChainDataDir)
 
  if (fs.existsSync(newPath)) {
    // remove exist dir
    rimraf(newPath, () => {
      log.info('remove exist dir')
      moveToEmptyDir(oldPath, newPath, event)
    })
  } else {
    moveToEmptyDir(oldPath, newPath, event)
  }
}

/**
 * move dir to en empty dir
 * @param oldPath 
 * @param newPath 
 */
const moveToEmptyDir = (oldPath: string, newPath: string, event: Event) => {
  log.info('start mv chain data')
  // try {
  //   fs.renameSync(oldPath, newPath)
  //   log.info('move success 1111')
  //   event.sender.send(MOVE_DATA_STATUS, true) 
  // } catch (_) {
  //   log.error('errr1111111:', _)
  //   try {
  //     fs.renameSync(oldPath, newPath)
  //     log.info('move success 22222')
  //     event.sender.send(MOVE_DATA_STATUS, true)
  //   } catch (__) {
  //     log.error('errr222222:', __)
  //     event.sender.send(MOVE_DATA_STATUS, false)
  //   }
  // }
  fsExtra.move(oldPath, newPath, (err) => {
    if(err) {
      log.info('move failure')
      log.error(err)
      event.sender.send(MOVE_DATA_STATUS, false)
      return
    }
    log.info('move success')
    event.sender.send(MOVE_DATA_STATUS, true)
  })

  // try {
  //   fsExtra.copySync(oldPath, newPath)
  //   log.info('move success')
  //   event.sender.send(MOVE_DATA_STATUS, true)
  // } catch(err) {
  //   log.info('move failure')
  //   log.error(err)
  //   event.sender.send(MOVE_DATA_STATUS, false)
  // }
  
}


// fs.rename(oldPath, newPath, (err) => {
//   if (err) {
//     log.info('move failure')
//     log.error(err)
//     event.sender.send(MOVE_DATA_STATUS, false) 
//     return
//   }
//   log.info('move success')
//   event.sender.send(MOVE_DATA_STATUS, true) 
// }) 


