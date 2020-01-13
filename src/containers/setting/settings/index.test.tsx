import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
//
import { Setting } from './index'
import styles from './settingStyle'

jest.mock('@/ipc', () => {
  return {
    cancelDipperinDownload: jest.fn(),
    moveChainData: jest.fn(),
    moveChainDataListener: jest.fn()
  }
})
describe('setting', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockAccount = root.account
  const labels = i18n['zh-CN'].wallet.setting
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({})
  const mockProps = {
    labels,
    classes,
    root,
    wallet: mockWallet,
    account: mockAccount,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: Setting

  beforeEach(() => {
    component = shallow(<Setting {...mockProps} />).dive()
    instance = component.instance() as Setting
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('changeAccount', () => {
    instance.changeAccount()
    expect(instance.showAccounts).toBe(true)
  })

  it('handleClose', () => {
    instance.handleClose()
    expect(instance.showAccounts).toBe(false)
  })
  // fail
  // it('handleReset', async () => {
  //   const mockHistoryPush = jest.fn()
  //   mockSwalFire.mockResolvedValue(Promise.resolve(true))
  //   mockRouterProps.history.push = mockHistoryPush
  //   await instance.handleReset()
  //   expect(mockSwalFire).toHaveBeenCalled()
  //   expect(mockHistoryPush).toHaveBeenCalled()
  // })

  it('handleUpdate', async () => {
    await instance.handleUpdate()
    expect(mockSwalFire).toHaveBeenCalled()
  })

  it('lockWallet', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.lockWallet()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('handleChangeNet same', () => {
    const mockReloadData = jest.fn()
    root.reloadData = mockReloadData
    instance.handleChangeNet('venus')()
    expect(mockReloadData).not.toHaveBeenCalled()
  })

  it('handleChangeNet change', () => {
    const spyReloadData = jest.spyOn(root, 'reloadData')
    instance.handleChangeNet('test')()
    expect(instance.netEnv).toBe('test')
    expect(spyReloadData).toHaveBeenCalled()
  })

  it('handleToggleRemoteNode remote', () => {
    if (root.isRemoteNode) {
      root.toggleIsRemoteNode()
    }
    const mockSelectRemote = jest.spyOn(instance, 'selectRemote')
    const mockSelectLocal = jest.spyOn(instance, 'selectLocal')
    instance.handleToggleRemoteNode()
    expect(mockSelectRemote).toHaveBeenCalled()
    expect(mockSelectLocal).not.toHaveBeenCalled()
  })

  it('handleToggleRemoteNode local', () => {
    if (!root.isRemoteNode) {
      root.toggleIsRemoteNode()
    }
    const mockSelectRemote = jest.spyOn(instance, 'selectRemote')
    const mockSelectLocal = jest.spyOn(instance, 'selectLocal')
    instance.handleToggleRemoteNode()
    expect(mockSelectRemote).not.toHaveBeenCalled()
    expect(mockSelectLocal).toHaveBeenCalled()
  })

  it('selectRemote', () => {
    const mockHandleChangeNet = jest.spyOn(instance, 'handleChangeNet')
    instance.selectRemote('test')
    expect(mockHandleChangeNet).toHaveBeenCalled()
  })

  it('selectLocal', () => {
    instance.selectLocal()
    expect(instance.netEnv).toBe('test')
  })

  // it('setMiner', async () => {
  //   const mockSetMiner = jest.fn(() => true)
  //   mockSwalFire.mockResolvedValue(Promise.resolve(true))
  //   mockWallet.setMiner = mockSetMiner
  //   await instance.setMiner()
  //   expect(mockSetMiner).toHaveBeenCalled()
  // })

  // it('setHost', async () => {
  //   const mockReconnectNode = jest.fn(() => true)
  //   mockSwalFire.mockResolvedValue(Promise.resolve(true))
  //   mockWallet.reconnectNode = mockReconnectNode
  //   await instance.setHost()
  //   expect(mockReconnectNode).toHaveBeenCalled()
  // })

  it('handleHelp', () => {
    const mockHistoryPush = jest.fn()
    mockRouterProps.history.push = mockHistoryPush
    instance.handleToHelp()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('showLoading', () => {
    instance.showLoading()
    expect(instance.loading).toBe(true)
  })

  it('closeloading', () => {
    instance.closeLoading()
    expect(instance.loading).toBe(false)
  })

  it('changeProgress', () => {
    instance.changeProgress(2)
    expect(instance.progress).toBe(2)
  })
})
