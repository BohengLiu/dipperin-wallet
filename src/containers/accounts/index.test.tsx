import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockAccountsData from '@/tests/testData/accounts'
import AccountModel from '@/models/account'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'

import styles from './accountsStyle'
import { Accounts } from './index'

describe('Containers: Accounts', () => {
  const routerProps = getMockRouterProps<{}>({})
  const mockRoot = mockRootBuilder()
  const mockAccount = mockRoot.account
  const labels = i18n['zh-CN'].account.accounts
  const classes = mockStyleClasses(styles)
  const mockHandleClose = jest.fn()

  const mockProps = {
    account: mockAccount,
    history: routerProps.history,
    labels,
    classes,
    handleClose: mockHandleClose
  }

  let component: ShallowWrapper
  let instance: Accounts

  beforeEach(() => {
    component = shallow(<Accounts {...mockProps} />).dive()
    instance = component.instance() as Accounts
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('addAccount, success', () => {
    const mockAddAccount = jest.spyOn(instance, 'addAccount')
    const mockHistoryPush = jest.fn()
    mockAccount.addAccount = jest.fn()
    routerProps.history.push = mockHistoryPush
    instance.forceUpdate()
    instance.addAccount()
    expect(mockAddAccount).toHaveBeenCalled()
    expect(mockHistoryPush).not.toHaveBeenCalled()
  })

  it('addAccount, fail', () => {
    const mockAddAccount = jest.spyOn(instance, 'addAccount')
    const mockHistoryPush = jest.fn()
    mockAccount.addAccount = jest.fn(() => {
      throw new Error()
    })
    routerProps.history.push = mockHistoryPush
    instance.forceUpdate()
    instance.addAccount()
    expect(mockAddAccount).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('getBigAccounts', () => {
    const accounts = mockAccountsData.map(AccountModel.fromObj)
    expect(instance.getBigAccounts(0, accounts)).toEqual([accounts[0], accounts[1], accounts[2]])
    expect(instance.getBigAccounts(1, accounts)).toEqual([accounts[0], accounts[1], accounts[2]])
    expect(instance.getBigAccounts(2, accounts)).toEqual([accounts[1], accounts[2], accounts[3]])
    expect(instance.getBigAccounts(4, accounts)).toEqual([accounts[3], accounts[4], accounts[5]])
    expect(instance.getBigAccounts(5, accounts)).toEqual([accounts[3], accounts[4], accounts[5]])
  })

  it('showAccounts', () => {
    const mockSelectAccount = jest.fn()
    const mockGetBigAccounts = jest.fn().mockImplementation(() => [])
    instance.selectAccount = mockSelectAccount
    instance.getBigAccounts = mockGetBigAccounts
    instance.forceUpdate()

    instance.showAccounts(1)

    expect(mockSelectAccount.mock.calls[0][0]).toEqual(1)
    expect(mockGetBigAccounts.mock.calls[0][0]).toEqual(1)
    expect(instance.bigAccounts).toEqual([])
  })

  it('handleChangeActiveAccount', () => {
    const mockChangeActiveAccount = jest.fn()
    mockAccount.changeActiveAccount = mockChangeActiveAccount

    instance.handleChangeActiveAccount('1')

    expect(mockChangeActiveAccount.mock.calls[0][0]).toEqual('1')
    expect(mockHandleClose).toHaveBeenCalled()
  })

  it('changeAccount', () => {
    const mockShowAccounts = jest.fn()

    instance.showAccounts = mockShowAccounts

    instance.forceUpdate()

    instance.changeAccount(1)

    expect(mockShowAccounts.mock.calls[0][0]).toEqual(1)
    expect(instance.selectedIndex).toEqual(1)
  })

  it('computeMiddleAccount', () => {
    expect(instance.computeMiddleAccount(1, 80)).toEqual(undefined)
    expect(instance.computeMiddleAccount(10, 1645)).toEqual(22)
    expect(instance.computeMiddleAccount(22, 2474)).toEqual(31)
  })

  it('updateSelectedAccount, The number of accounts does not exceed one page', () => {
    const mockComputeMiddleAccount = jest.fn(() => undefined)
    instance.computeMiddleAccount = mockComputeMiddleAccount

    instance.forceUpdate()

    instance.updateSelectedAccount()

    expect(instance.selectedIndex).toEqual(0)
  })

  it('updateSelectedAccount, The number of accounts exceedS one page', () => {
    const mockComputeMiddleAccount = jest.fn(() => 22)
    instance.computeMiddleAccount = mockComputeMiddleAccount

    instance.forceUpdate()

    instance.updateSelectedAccount()

    expect(instance.selectedIndex).toEqual(22)
  })

  it('getSamllListWidth', () => {
    expect(instance.getSmallListWidth(1)).toEqual(80)
    expect(instance.getSmallListWidth(2)).toEqual(172)
    expect(instance.getSmallListWidth(3)).toEqual(264)
    expect(instance.getSmallListWidth(4)).toEqual(356)
    expect(instance.getSmallListWidth(5)).toEqual(448)
  })

  it('computeLeftBySelectId, The number of accounts is less than one page', () => {
    instance.getSmallListWidth = jest.fn(() => 200)
    instance.forceUpdate()

    expect(instance.computeLeftBySelectId(5, 1)).toEqual(0)
  })

  it('computeLeftBySelectId, The number of accounts is greater than one page, but the current account is the top five account.', () => {
    instance.getSmallListWidth = jest.fn(() => 200)
    instance.forceUpdate()

    expect(instance.computeLeftBySelectId(12, 1)).toEqual(0)
  })

  it('computeLeftBySelectId, The number of accounts is greater than one page, but the current account is the last five accounts.', () => {
    instance.getSmallListWidth = jest.fn(() => 200)
    instance.forceUpdate()

    expect(instance.computeLeftBySelectId(12, 10)).toEqual(616)
  })

  it('computeLeftBySelectId, The number of accounts is greater than one page, and the current account is in the middle.', () => {
    instance.getSmallListWidth = jest.fn(() => 200)
    instance.forceUpdate()

    expect(instance.computeLeftBySelectId(12, 7)).toEqual(-184)
  })

  it('computeHandleLeft', () => {
    expect(instance.computeHandleLeft(0)).toEqual(0)
    expect(instance.computeHandleLeft(817)).toEqual(1645)
    expect(instance.computeHandleLeft(1646)).toEqual(2474)
  })

  it('handleLeft, Without movement', () => {
    const smallListLeft = instance.smallListLeft
    const mockComputeHandleLeft = jest.fn(() => smallListLeft)
    const mockUpdateSelectedAccount = jest.fn()

    instance.computeHandleLeft = mockComputeHandleLeft
    instance.updateSelectedAccount = mockUpdateSelectedAccount

    instance.forceUpdate()

    instance.handleLeft()

    expect(mockUpdateSelectedAccount).not.toHaveBeenCalled()
  })

  it('handleLeft, Moved', () => {
    const smallListLeft = instance.smallListLeft
    const mockComputeHandleLeft = jest.fn(() => smallListLeft + 2)
    const mockUpdateSelectedAccount = jest.fn()

    instance.computeHandleLeft = mockComputeHandleLeft
    instance.updateSelectedAccount = mockUpdateSelectedAccount

    instance.forceUpdate()

    instance.handleLeft()

    expect(mockUpdateSelectedAccount).toHaveBeenCalled()
  })

  it('computeHandeRight, After moving to the right, the account can fill the container', () => {
    expect(instance.computeHandleRight(1660, 0)).toEqual(-828)
  })

  it('computeHandeRight, After moving right, the account cannot fill the container', () => {
    expect(instance.computeHandleRight(830, 0)).toEqual(-14)
  })

  it('handleRight, The number of accounts is less than one page', () => {
    const mockComputeHandleRight = jest.spyOn(instance, 'computeHandleRight')
    const mockUpdateSelectedAccount = jest.fn()

    instance.updateSelectedAccount = mockUpdateSelectedAccount

    instance.forceUpdate()

    instance.handleRight()

    expect(mockComputeHandleRight).not.toHaveBeenCalled()
    expect(mockUpdateSelectedAccount).not.toHaveBeenCalled()
  })

  it('handleRight, The number of accounts is greater than one page, moved', () => {
    const mockComputeHandleRight = jest.spyOn(instance, 'computeHandleRight')
    const mockUpdateSelectedAccount = jest.fn()

    instance.updateSelectedAccount = mockUpdateSelectedAccount

    mockAccount.accounts.length = 12

    instance.forceUpdate()

    instance.handleRight()

    expect(mockComputeHandleRight).toHaveBeenCalled()
    expect(mockUpdateSelectedAccount).toHaveBeenCalled()
  })

  it('handleRight, The number of accounts is greater than one page, moved', () => {
    const preSmallListleft = instance.smallListLeft
    const mockComputeHandleRight = jest.fn(() => preSmallListleft)
    const mockUpdateSelectedAccount = jest.fn()

    instance.computeHandleRight = mockComputeHandleRight
    instance.updateSelectedAccount = mockUpdateSelectedAccount

    mockAccount.accounts.length = 12

    instance.forceUpdate()

    instance.handleRight()

    expect(mockComputeHandleRight).toHaveBeenCalled()
    expect(mockUpdateSelectedAccount).not.toHaveBeenCalled()
  })
})
