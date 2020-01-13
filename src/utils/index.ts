import format from 'date-fns/format'
import { Utils } from '@dipperin/dipperin.js'
import crypto from 'crypto'

export const stringMapToPlainObject = (map: Map<string, any>): object => {
  const plainObject = {}
  for (const key of map.keys()) {
    plainObject[key] = map.get(key)
  }
  return plainObject
}

export const plainObjectToStringMap = (obj: object): Map<string, any> => {
  const map = new Map<string, any>()
  for (const key in obj) {
    if (obj[key]) {
      map.set(key, obj[key])
    }
  }

  return map
}

export const thousandBitSeparator = (num: string | number): string => {
  if (!num && num !== '0' && num !== 0) {
    return ''
  }
  const arr = (num + '').split('.')
  arr[0] = arr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  return arr.join('.')
}

export const isValidPassword = (password: string): boolean => {
  if (/[\s]/.test(password) || !/[a-zA-Z0-9_]|(?=[\\x21-\\x7e]+)/.test(password) || /[\u4e00-\u9fa5]/.test(password)) {
    return false
  }
  return true
}

export const isValidAmount = (amount: string): boolean => {
  if (!/^\d+(\.\d+)?$/.test(amount)) {
    return false
  }
  return true
}

export const validateEnteringAmount = (amount: string) => {
  if (amount === '') {
    return true
  }

  return /^[0-9]*(\.[0-9]{0,18})?$/.test(amount)
}

export const formatUTCTime = (time: string) => {
  if (!time) {
    return ''
  }
  const date = new Date(Number(time.substr(0, 13)))
  return format(date, 'YYYY-MM-DD HH:mm:ss A+UTC')
}

// const VMCONTRACT_ADDRESS_PREFIX = '0014'
/**
 * Checks if the given string is an contract address
 * @param address the given HEX address
 */
export const isVmContractAddress = (address: string): boolean => {
  return /^(0x)?(0014)[0-9a-fA-F]{40}$/i.test(address)

  // if (address.replace('0x', '').length !== 44) {
  //   return false
  // }
  // const prefix = address.replace('0x', '').slice(0, 4)
  // switch (prefix) {
  //   case VMCONTRACT_ADDRESS_PREFIX:
  //     return true
  //   default:
  //     return false
  // }
}

export const validateAddress = (address: string) => {
  if (!Utils.isAddress(address)) {
    throw new Error('invalid address')
  }
}

export const isAlpha = version => version.includes('alpha')

export const isURL = url => {
  const regEx = new RegExp(
    /^((ht|f)tps?)(ws?):\/\/(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
  )
  return regEx.test(url)
  // return /^((ht|f)tps?)(ws?):\/\/(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(url)
}

export const getContractAmount = (extraData): string => {
  try {
    const extraObj = JSON.parse(extraData)
    const params = JSON.parse(extraObj.params)
    const index = extraObj.action === 'TransferFrom' ? 2 : 1
    return String(Number(params[index]))
  } catch (err) {
    return '0'
  }
}

export const getContractType = (extraData): string => {
  try {
    const extraObj = JSON.parse(extraData)
    return extraObj.action
  } catch (err) {
    return ''
  }
}

export const showContractFrom = (tx): string => {
  try {
    const extraObj = JSON.parse(tx.extraData)
    const params = JSON.parse(extraObj.params)
    if (extraObj.action === 'TransferFrom') {
      return params[0]
    }
    return tx.from
  } catch (_) {
    return tx.from
  }
}

export const showContractTo = (tx): string => {
  try {
    const extraObj = JSON.parse(tx.extraData)
    const params = JSON.parse(extraObj.params)
    const index = extraObj.action === 'TransferFrom' ? 1 : 0

    return params[index]
  } catch (_) {
    return tx.to
  }
}

export const getNowTimestamp = (): number => {
  return new Date().valueOf()
}

export const formatAmount = (amount: string) => {
  // when '' return '0'
  if (amount === '') {
    return '0'
  }
  let formattedAmount = amount
  if (/^0+[1-9]+/.test(formattedAmount)) {
    formattedAmount = formattedAmount.replace(/^0+/, '')
  }
  // add 0 before . if . is first
  if (formattedAmount.slice(0, 1) === '.') {
    formattedAmount = '0' + formattedAmount
  }
  // get rid of ., if . is in end
  if (/^\d+\.$/.test(formattedAmount)) {
    formattedAmount = formattedAmount.slice(0, formattedAmount.length - 1)
  }
  // get rid of the number too small .
  const temp = formattedAmount.match(/^\d+\.(\d*)$/)
  if (temp && temp[1].length > 18) {
    formattedAmount = (formattedAmount.match(/^(\d+\.\d{0,18})\d*$/) as any) as string
  }

  return formattedAmount
}

export const sleep = (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function encrypt(key: string, iv: string, data: string) {
  const decipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  // decipher.setAutoPadding(true);
  return decipher.update(data, 'binary', 'hex') + decipher.final('hex')
}

export function decrypt(key: string, iv: string, crypted: string) {
  const cryptedBuf = Buffer.from(crypted, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  return decipher.update(cryptedBuf, 'binary', 'utf8') + decipher.final('utf8')
}

export function getShowName(name: string) {
  if (/[\u0391-\uFFE5]/g.test(name) && name.length > 8) {
    return name.slice(0, 8) + '...'
  }
  if (!/[\u0391-\uFFE5]/g.test(name) && name.length > 16) {
    return name.slice(0, 16) + '...'
  }
  return name
}
