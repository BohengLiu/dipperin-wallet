import settings from './settings'
import { NET_ENV, IS_REMOTE, NET_HOST_OBJ, LOCALHOST, DEFAULT_NET } from './constants'

export const getCurrentNet = (): string => {
  // FIXME: default is null, should set default value
  return (settings.get(NET_ENV) as string) || DEFAULT_NET
}

export const setCurrentNet = (net: string) => {
  settings.set(NET_ENV, net)
}

export const getIsRemoteNode = (): boolean => {
  return Boolean(settings.get(IS_REMOTE))
}

export const setIsRemoteNode = (isRemote: boolean) => {
  settings.set(IS_REMOTE, isRemote)
}

/**
 * get remote host by net name
 */
export const getRemoteHost = (remoteNet): string => {
  return NET_HOST_OBJ[remoteNet] || LOCALHOST
}
