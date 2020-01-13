import { mount, ReactWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
// import mockAccountsData from '@/tests/testData/acco.unts'
import AccountModel from '@/models/account'
import getMockRouterProps from '@/tests/mocks/router'
// import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import styles from '../accountsStyle'
import { BigAccount } from './bigAccount'

describe('bigAccount', () => {
  const routerProps = getMockRouterProps<{}>({})
  // const mockRoot = mockRootBuilder()
  const mockAccount = new AccountModel(
    'sqEVSm4jZaNAegxA',
    "m/44'/709394'/0'/0/1",
    '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
    ''
  )
  const labels = i18n['zh-CN'].account.accounts
  const classes = mockStyleClasses(styles)
  const handleChangeActiveAccount = jest.fn()

  const mockProps = {
    labels,
    classes,
    handleChangeActiveAccount,
    activeId: '0x0000000001',
    account: mockAccount,
    showDialogConfirm: jest.fn(),
    deleteAccount: jest.fn(),
    ...routerProps
  }

  let component: ReactWrapper
  let instance: BigAccount

  beforeEach(() => {
    component = mount(<BigAccount {...mockProps} />)
    instance = component.instance() as BigAccount
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('handleChangeActiveAccount', () => {
    instance.handleChangeActiveAccount()
    expect(mockProps.handleChangeActiveAccount.mock.calls[0][0]).toBe('sqEVSm4jZaNAegxA')
  })

  it('copyAddress', () => {
    document.execCommand = jest.fn(() => true)
    const btn = component.find('button.copy')
    btn.simulate('click')
    expect(mockSwalFire).toHaveBeenCalled()
  })
})
