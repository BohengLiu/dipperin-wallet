import { shallow } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import getMockRouterProps from '@/tests/mocks/router'
import mockRootBuilder from '@/tests/mocks/store'
import mockSwalFire from '@/tests/mocks/swal'
import settings from '@/utils/settings'
import styles from './loginStyle'

import { Login } from './index'
import { mockStyleClasses } from '@/tests/utils'

describe('login', () => {
  const mockRouterProps = getMockRouterProps({})
  const mockPush = jest.spyOn(mockRouterProps.history, 'push')
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const labels = i18n['zh-CN'].wallet.login
  const component = shallow(
    <Login root={root} wallet={mockWallet} labels={labels} {...mockRouterProps} classes={mockStyleClasses(styles)} />
  )
  const login = component.dive().instance() as Login
  // const clickEvent = {
  //   preventDefault: () => null
  // }
  const mockSet = jest.spyOn(settings, 'set')
  it('render', () => {
    expect(component.dive().exists()).toBe(true)
  })

  it('passwordInput', () => {
    const e = {
      target: {
        value: 'value'
      }
    }
    login.passwordInput(e)
    expect(login.password).toBe('value')
  })

  it('confirm unverified', () => {
    mockSwalFire.mockClear()
    login.password = ''
    login.confirm()
    expect(mockPush).not.toBeCalled()
    expect(mockSwalFire.mock.calls[0][0]).toEqual({
      icon: 'error',
      title: labels.swal.emptyPassword
    })
  })

  it('confirm unlock', async () => {
    mockSwalFire.mockClear()
    login.password = 'password'
    await login.confirm()
    expect(mockPush).not.toBeCalled()
    expect(mockSwalFire.mock.calls[0][0]).toEqual({ icon: 'error', title: labels.swal.incorrectPassword })
  })

  it('confirm success', async () => {
    mockSwalFire.mockClear()
    mockPush.mockClear()
    login.password = '12345678'
    await login.confirm()
    expect(mockSwalFire.mock.calls[0][0]).toEqual({
      text: labels.swal.success,
      icon: 'success',
      timer: 1000
    })
    expect(mockPush).toBeCalledWith('/main/wallet')
  })

  it('handleReset', async () => {
    mockSwalFire.mockClear()
    mockPush.mockClear()
    await login.handleReset()
    expect(mockSwalFire.mock.calls[0][0]).toEqual({
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: labels.swal.cancel,
      confirmButtonText: labels.swal.confirm,
      icon: 'warning',
      text: labels.swal.warnText,
      title: labels.swal.warn,
      reverseButtons: true
    })
    expect(mockSet.mock.calls[0][0]).toBe('showAccountGuide')
    expect(mockPush.mock.calls[0][0]).toBe('/')
  })
})
