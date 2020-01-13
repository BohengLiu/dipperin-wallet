import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import { zhCN } from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'
import { sendStartNode } from '@/ipc'

jest.mock('@/ipc')
const mockSendStartNode = sendStartNode

import styles from './accountStyle'
import { AccountInfo } from './index'

describe('AccountInfo', () => {
  const mockSetMiner = jest.fn()
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockAccount = root.account
  mockWallet.setMiner = mockSetMiner
  const classes = mockStyleClasses(styles)
  const history = getMockRouterProps({}).history
  const mockPush = jest.spyOn(history, 'push')
  const mockChangeLang = jest.fn()
  const mockProps = {
    labels: zhCN.account.accountInfo,
    balance: '1000',
    id: '1',
    address: '0xaaaaa',
    wallet: mockWallet,
    account: mockAccount,
    root,
    changeLanguage: mockChangeLang,
    language: 'zh-CN',
    changeAccount: jest.fn(),
    history,
    classes
  }
  let component: ShallowWrapper
  let instance: AccountInfo
  const eventMap: any = {}
  beforeEach(() => {
    window.addEventListener = jest.fn((event, cb) => {
      eventMap[event] = cb
    })
    component = shallow(<AccountInfo {...mockProps} />).dive()
    instance = component.instance() as AccountInfo
  })

  // render
  it('render', () => {
    // console.log(component.html())
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  // it('constructor isConnecting', () => {
  //   mockProps.root.isConnecting = false
  // })

  it('changeNodeRunning', () => {
    instance.changeNodeRunning(true)
    expect(instance.nodeRuning).toBe(true)
  })

  it('changeLoading', () => {
    instance.changeLoading(true)
    expect(instance.loading).toBe(true)
  })

  it('closeInfo', () => {
    instance.closeInfo()
    expect(instance.showInfo).toBe(false)
  })

  it('handleLock', () => {
    instance.handleLock()
    expect(mockPush.mock.calls[0][0]).toBe('/login')
  })

  it('handleChangeLang', () => {
    instance.handleChangeLang()
    expect(mockChangeLang.mock.calls[0][0]).toBe('en-US')
  })

  it('window event, to close info', () => {
    eventMap.click()
    expect(instance.showInfo).toBe(false)
  })

  it('handleToggleNode loading', () => {
    instance.changeLoading(true)
    const spyChangeLoading = jest.spyOn(instance, 'changeLoading')
    instance.handleToggleNode()
    expect(spyChangeLoading).not.toHaveBeenCalled()
  })

  it('handleToggleNode nodeRunning true', () => {
    jest.useFakeTimers()
    instance.changeLoading(false)
    instance.changeNodeRunning(true)
    const spyChangeLoading = jest.spyOn(instance, 'changeLoading')
    instance.handleToggleNode()
    expect(spyChangeLoading.mock.calls[0][0]).toBe(true)
    jest.runAllTimers()
  })

  it('handleToggleNode nodeRunning false', () => {
    // jest.useFakeTimers();
    instance.changeLoading(false)
    instance.changeNodeRunning(false)
    const spyChangeLoading = jest.spyOn(instance, 'changeLoading')
    instance.handleToggleNode()
    expect(spyChangeLoading.mock.calls[0][0]).toBe(true)
    expect(mockSendStartNode).toHaveBeenCalled()
    // jest.runAllTimers()
    // expect(spyChangeLoading.mock.calls[1][0]).toBe(false)
  })
})
