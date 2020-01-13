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
import { BigAccountList } from './bigAccountList'

describe('BigAccountList', () => {
  const routerProps = getMockRouterProps<{}>({})
  // const mockRoot = mockRootBuilder()
  const mockAccounts = [
    new AccountModel('sqEVSm4jZaNAegxA', "m/44'/709394'/0'/0/1", '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', ''),
    new AccountModel('sqEVSm4jZaNAegxA', "m/44'/709394'/0'/0/1", '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', '')
  ]
  const labels = i18n['zh-CN'].account.accounts
  const classes = mockStyleClasses(styles)
  const handleChangeActiveAccount = jest.fn()

  const mockProps = {
    labels,
    classes,
    handleChangeActiveAccount,
    activeId: '0x0000000001',
    accounts: mockAccounts,
    showDialogConfirm: jest.fn(),
    deleteAccount: jest.fn(),
    ...routerProps
  }

  // let component: ReactWrapper
  let component: ShallowWrapper
  // let instance: BigAccountList

  beforeEach(() => {
    component = shallow(<BigAccountList {...mockProps} />)
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.find('div').length).toBeGreaterThan(0)
  })
})
