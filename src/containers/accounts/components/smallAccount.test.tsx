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
import { SmallAccount } from './smallAccount'

describe('smallAccount', () => {
  const routerProps = getMockRouterProps<{}>({})
  const mockAccount = new AccountModel(
    'sqEVSm4jZaNAegxA',
    "m/44'/709394'/0'/0/1",
    '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
    ''
  )
  const labels = i18n['zh-CN'].account.accounts
  const classes = mockStyleClasses(styles)
  const changeAccount = jest.fn()

  const mockProps = {
    labels,
    classes,
    changeAccount,
    index: 3,
    selectedIndex: 3,
    activeId: '0x0000000001',
    account: mockAccount,
    changeSelectedAccount: jest.fn(),
    ...routerProps
  }

  let component: ReactWrapper
  // let instance: SmallAccount

  beforeEach(() => {
    component = mount(<SmallAccount {...mockProps} />)
    // instance = component.instance() as SmallAccount
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
