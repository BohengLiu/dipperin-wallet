import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'

import i18n from '@/i18n/i18n'
import mockRootBuilder from '@/tests/mocks/store'
import getMockRouterProps from '@/tests/mocks/router'
import { mockStyleClasses } from '@/tests/utils'
import mockSwalFire from '@/tests/mocks/swal'
import { mockJsonAbi } from '@/tests/testData/vmContract'
//
import { CreateContract } from './index'
import styles from './styles'

function mockEvent(value: string): React.ChangeEvent<{ value: string }> {
  return { target: { value } } as any
}

function MockCode(): React.ChangeEvent<HTMLInputElement> {
  const obj = { name: 'token.wasm' }
  // const blob = new Blob([ JSON.stringify(obj) ], {type : 'application/json'});
  return { target: { files: obj } } as any
}

function MockAbi(): React.ChangeEvent<HTMLInputElement> {
  const obj = { name: 'token.json' }
  return { target: { files: obj } } as any
}

function MockFormEvent(): React.FormEvent {
  const res = {
    preventDefault: jest.fn()
  }
  return res as any
}

describe('CreateContract', () => {
  const root = mockRootBuilder(true)
  const mockWallet = root.wallet
  const mockAccount = root.account
  const mockVmContract = root.vmContract
  const labels = i18n['zh-CN'].contract.contract
  const classes = mockStyleClasses(styles)

  const mockRouterProps = getMockRouterProps({ address: '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa' })
  const mockProps = {
    labels,
    classes,
    wallet: mockWallet,
    account: mockAccount,
    vmContract: mockVmContract,
    ...mockRouterProps
  }

  let component: ShallowWrapper
  let instance: CreateContract

  beforeEach(() => {
    component = shallow(<CreateContract {...mockProps} />).dive()
    instance = component.instance() as CreateContract
    mockSwalFire.mockClear()
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('setStringField', () => {
    instance.setStringField('test', 'testValue')
    expect(instance.getStringField('test')).toBe('testValue')
  })

  it('setFlags', () => {
    instance.setFlags('test', true)
    expect(instance.getFlag('test')).toBe(true)
  })

  it('getStringField not exist', () => {
    expect(instance.getStringField('???')).toBe('')
  })

  it('getFlag not exist', () => {
    expect(instance.getFlag('???')).toBe(false)
  })

  it('handleChangeCode', async () => {
    const mockfile = MockCode()
    await instance.handleChangeCode(mockfile)
    expect(instance.getStringField('code')).toBe('')
  })

  it('handleJumpToCreated', () => {
    instance.handleJumpToCreated()
    expect(instance.flags.get('isCreated')).toBe(true)
  })

  it('handleJumpToFavorite', () => {
    instance.handleJumpToFavorite()
    expect(instance.flags.get('isCreated')).toBe(false)
  })

  it('handleChangeAbi', async () => {
    const mockCode = MockAbi()
    await instance.handleChangeAbi(mockCode)
    expect(instance.getStringField('abi')).toBe('')
  })

  // it('amountChange', () => {
  //   const event = mockEvent('1')
  //   instance.amountChange(event)
  //   expect(instance.amount).toBe('1')
  // })

  it('handleChangeGas', () => {
    const event = mockEvent('1')
    instance.handleChangeGas(event)
    expect(instance.getStringField('gas')).toBe('1')
  })

  it('handleChangeGasPrice', () => {
    const event = mockEvent('1')
    instance.handleChangeGasPrice(event)
    expect(instance.getStringField('gasPrice')).toBe('1')
  })

  it('handleChangeContractAddress', () => {
    const event = mockEvent('0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28')
    instance.handleChangeContractAddress(event)
    expect(instance.getStringField('contractAddress')).toBe('0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28')
  })

  it('handleChangeParams', () => {
    const event = mockEvent('l,l,100')
    instance.handleChangeParams(event)
    expect(instance.getStringField('params')).toBe('l,l,100')
  })

  it('handleToggleDetailParam', () => {
    instance.handleToggleDetailParam()
    expect(instance.getFlag('showDetailParams')).toBe(true)
  })

  it('getContractGas', async () => {
    root.vmContract.createContractEstimateGas = jest.fn(async () => {
      return { success: true, info: '100' }
    })
    await instance.getContractGas()
    expect(instance.getStringField('estimateGas')).toBe('100')
  })

  it('handleChangeParam', () => {
    const event = mockEvent('1')
    instance.handleChangeParam('a', event)
    expect(instance.getStringField('a')).toBe('1')
  })

  it('handleConfirm', async () => {
    const event = MockFormEvent()
    const spyHandleShowDialog = jest.spyOn(instance, 'handleShowDialog')
    await instance.handleConfirm(event)
    expect(spyHandleShowDialog).toHaveBeenCalled()
  })

  it('dialogConfirm', async () => {
    instance.handleShowDialog()
    root.wallet.checkPassword = jest.fn(() => true)
    root.vmContract.confirmCreateContract = jest.fn(async () => {
      return { success: true }
    })
    await instance.dialogConfirm('12345678')
    expect(instance.getFlag('showDialog')).toBe(false)
  })

  it('handleAddContract', async () => {
    root.vmContract.addContract = jest.fn(async () => {
      return { success: true }
    })
    instance.handleAddContract()
    expect(mockSwalFire).toHaveBeenCalled()
  })

  it('handleCloseDialog', () => {
    instance.handleCloseDialog()
    expect(instance.getFlag('showDialog')).toBe(false)
  })

  it('handleShowDialog', () => {
    instance.handleShowDialog()
    expect(instance.getFlag('showDialog')).toBe(true)
  })

  it('handleOnShowDetailParams', () => {
    instance.handleOnShowDetailParams()
    expect(instance.getFlag('showDetailParams')).toBe(false)
  })

  // it('switchToList', () => {
  //   mockRouterProps.history.push = jest.fn()
  //   instance.switchToList()
  //   expect(mockRouterProps.history.push).toHaveBeenCalled()
  // })

  it('handleConfirmGenParams', () => {
    const initFunc = {
      inputs: [
        {
          name: 'a'
        },
        {
          name: 'b'
        }
      ]
    } as any
    instance.setStringField('a', 'a')
    instance.setStringField('b', 'b')
    instance.handleConfirmGenParams(initFunc)
    expect(instance.getStringField('params')).toBe('a,b')
  })

  // it('addfile', () => {
  //   expect(instance.addfile()).toBe(undefined)
  // })

  // it('addWasmFile', () => {
  //   expect(instance.addWasmFile()).toBe(undefined)
  // })

  it('getAbi', async () => {
    instance.setStringField('contractAddress', '0x0014c37fa36b032418db26942842be594e016909f950')
    root.vmContract.getABI = jest.fn(async () => {
      return { abiArr: mockJsonAbi }
    })
    await instance.getAbi()
    expect(instance.getStringField('contractAddress')).toBe('0x0014c37fa36b032418db26942842be594e016909f950')
    expect(instance.getStringField('abi')).toBe(
      '0x5b7b226e616d65223a22696e6974222c22696e70757473223a5b7b226e616d65223a22746f6b656e4e616d65222c2274797065223a22737472696e67227d2c7b226e616d65223a2273796d626f6c222c2274797065223a22737472696e67227d2c7b226e616d65223a22737570706c79222c2274797065223a2275696e743634227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a227472616e73666572222c22696e70757473223a5b7b226e616d65223a22746f222c2274797065223a22737472696e67227d2c7b226e616d65223a2276616c7565222c2274797065223a2275696e743634227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a227472616e7366657246726f6d222c22696e70757473223a5b7b226e616d65223a2266726f6d222c2274797065223a22737472696e67227d2c7b226e616d65223a22746f222c2274797065223a22737472696e67227d2c7b226e616d65223a2276616c7565222c2274797065223a2275696e743634227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a22617070726f7665222c22696e70757473223a5b7b226e616d65223a227370656e646572222c2274797065223a22737472696e67227d2c7b226e616d65223a2276616c7565222c2274797065223a2275696e743634227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a226275726e222c22696e70757473223a5b7b226e616d65223a225f76616c7565222c2274797065223a2275696e743634227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a2267657442616c616e6365222c22696e70757473223a5b7b226e616d65223a226f776e222c2274797065223a22737472696e67227d5d2c226f757470757473223a5b7b226e616d65223a22222c2274797065223a2275696e743634227d5d2c22636f6e7374616e74223a2274727565222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a22676574417070726f766542616c616e6365222c22696e70757473223a5b7b226e616d65223a2266726f6d222c2274797065223a22737472696e67227d2c7b226e616d65223a22617070726f766564222c2274797065223a22737472696e67227d5d2c226f757470757473223a5b7b226e616d65223a22222c2274797065223a2275696e743634227d5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a2267657442616c616e636541646472222c22696e70757473223a5b7b226e616d65223a226f776e222c2274797065223a22737472696e67227d5d2c226f757470757473223a5b7b226e616d65223a22222c2274797065223a22737472696e67227d5d2c22636f6e7374616e74223a2274727565222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a2273746f70222c22696e70757473223a5b5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a227374617274222c22696e70757473223a5b5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a227365744e616d65222c22696e70757473223a5b7b226e616d65223a225f6e616d65222c2274797065223a22737472696e67227d5d2c226f757470757473223a5b5d2c22636f6e7374616e74223a2266616c7365222c2274797065223a2266756e6374696f6e227d2c7b226e616d65223a225472616e666572222c22696e70757473223a5b7b2274797065223a22737472696e67227d2c7b2274797065223a22737472696e67227d2c7b2274797065223a2275696e743634227d5d2c2274797065223a226576656e74227d2c7b226e616d65223a22417070726f76616c222c22696e70757473223a5b7b2274797065223a22737472696e67227d2c7b2274797065223a22737472696e67227d2c7b2274797065223a2275696e743634227d5d2c2274797065223a226576656e74227d5d'
    )
  })
})
