import mockRoot from '@/tests/mocks/store'
import mockDipperin from '@/tests/mocks/dipperin'
import VmContractStore from './vmContract'
import { mockAbi, mockCode } from '@/tests/testData/vmContract'

describe('VmContract store', () => {
  let vmContract: VmContractStore
  const root = mockRoot(true)

  it('contructor', () => {
    vmContract = new VmContractStore(root)
  })

  it('load', async () => {
    await vmContract.load()
    expect(vmContract.contract.size).toBe(1)
    expect(vmContract.pendingContract.size).toBe(1)
  })

  it('contracts', async () => {
    await vmContract.load()
    expect(vmContract.contracts.length).toBe(1)
  })

  it('pendingContracts', async () => {
    await vmContract.load()
    expect(vmContract.pendingContracts.length).toBe(1)
  })

  it('startUpdate', () => {
    root.timer.on = jest.fn()
    vmContract.startUpdate()
    expect(root.timer.on).toHaveBeenCalled()
  })

  it('confirmTransaction', async () => {
    root.wallet.getPrivateKeyByPath = () => '0x1b2309e66874ea6bd35b7c7c6613b9c43a003076e273ce0dc8e36961a6d2877a'
    root.account.activeAccount.updateBalance('100000000000000000000')
    const newDip = mockDipperin()
    newDip.dr.sendSignedTransaction = async () => '0x22ba8fd210afee8e957b32fb55fe4cd4eb0f59bc2a0f4787627fccd0122f4b04'
    vmContract.updateDipperin(newDip)
    const res = await vmContract.confirmTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.00000000000000001',
      '',
      '21000',
      '1'
    )
    expect(res).toEqual({
      success: true,
      info: '0x22ba8fd210afee8e957b32fb55fe4cd4eb0f59bc2a0f4787627fccd0122f4b04'
    })
  })

  it('estimateGas localNode', async () => {
    const newDip = mockDipperin()
    newDip.dr.estimateGas = jest.fn(async () => '0x5208')
    root.dipperin.dr.estimateGas = jest.fn(async () => '0x5208')
    vmContract.updateDipperin(newDip)
    const res = await vmContract.estimateGas(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.00000000000000001',
      ''
    )
    expect(res).toEqual({ success: true, info: '21000' })
  })

  it('estimateGas remoteNode', async () => {
    root.toggleIsRemoteNode()
    root.dipperin.dr.estimateGas = jest.fn(async () => '0x5208')
    const res = await vmContract.estimateGas(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.00000000000000001',
      ''
    )
    expect(res).toEqual({ success: true, info: '21000' })
  })

  it('createContractEstimateGAs', async () => {
    const mockEstimateGas = jest.spyOn(vmContract, 'estimateGas')
    const res = await vmContract.createContractEstimateGas(mockCode, mockAbi, '0', ['l', 'l', '10000'])
    expect(mockEstimateGas).toHaveBeenCalled()
    expect(res).toEqual({ info: '21000', success: true })
  })

  it('confirmCreateContract', async () => {
    root.transaction.confirmTransaction = jest.fn(async () => {
      return { success: true, info: '0x00000000' }
    })
    const res = await vmContract.confirmCreateContract(mockCode, mockAbi, '40000000', '1', '0', ['l', 'l', '1000'])
    expect(res).toEqual({ success: true })
  })

  it('addContract', async () => {
    const res = await vmContract.addContract(mockAbi, '0x001488Fb46F1a09274745d6022EF1A176bcD4C5a02Aa')
    expect(res).toEqual({ success: true })
  })

  it('getLogs', async () => {
    root.dipperin.dr.vmContract.getLogs = jest.fn(async () => [])
    const res = await vmContract.getLogs(
      '',
      1,
      100,
      ['0x001487e42fbc7234714213a4dd3947cd1378cd28fa8c'],
      [['0xf099cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9']]
    )
    expect(res).toEqual({ success: true, info: [] })
  })

  it('confirmCallContractMethod', async () => {
    root.transaction.confirmTransaction = jest.fn(async () => {
      return { success: true, info: '0xf099cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9' }
    })
    const res = await vmContract.confirmCallContractMethod(
      '0x001487e42fbc7234714213a4dd3947cd1378cd28fa8c',
      mockAbi,
      'transfer',
      '0',
      '1000000',
      '1',
      ['0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', '100']
    )
    expect(res).toEqual({ success: true, info: '0xf099cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9' })
  })

  it('confirmConstantCallContractMethod', async () => {
    root.dipperin.dr.callConstFunc = jest.fn(async () => '100')
    const res = await vmContract.confirmConstantCallContractMethod(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      mockAbi,
      'getBalance',
      '100000',
      '1'
    )
    expect(res).toEqual({ success: true, info: '100' })
  })

  it('reload', () => {
    vmContract.reload()
    expect(vmContract.contract.size).toBe(0)
  })
})
