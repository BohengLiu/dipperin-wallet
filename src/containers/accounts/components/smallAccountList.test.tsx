import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
// import mockAccountsData from '@/tests/testData/acco.unts'
import AccountModel from '@/models/account'
import getMockRouterProps from '@/tests/mocks/router'
// import mockRootBuilder from '@/tests/mocks/store'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'

import styles from '../accountsStyle'
import { SmallAccountList } from './smallAccountList'

describe('SmallAccountList', () => {
  const routerProps = getMockRouterProps<{}>({})
  // const mockRoot = mockRootBuilder()
  const mockAccounts = [
    new AccountModel('sqEVSm4jZaNAegxA', "m/44'/709394'/0'/0/1", '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', ''),
    new AccountModel('sqEVSm4jZaNAegxA', "m/44'/709394'/0'/0/1", '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', '')
  ]
  const labels = i18n['zh-CN'].account.accounts
  const classes = mockStyleClasses(styles)
  const changeAccount = jest.fn()

  const mockProps = {
    labels,
    classes,
    changeAccount,
    index: 10,
    selectedIndex: 10,
    activeId: '0x0000000001',
    accounts: mockAccounts,
    ...routerProps
  }

  // let component: ReactWrapper
  let component: ShallowWrapper
  // let instance: BigAccountList

  beforeEach(() => {
    component = shallow(<SmallAccountList {...mockProps} />)
    // instance = component.instance() as BigAccountList
    mockSwalFire.mockClear()
  })

  it('render', () => {
    // console.log(component.html())
    expect(component.exists()).toBe(true)
  })
})
