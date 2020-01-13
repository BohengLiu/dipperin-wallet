import * as utils from './index'
import BigNumber from 'bignumber.js'
describe('utils', () => {
  it('thousandBitSeparator', () => {
    expect(utils.thousandBitSeparator(12455)).toBe('12,455')
    expect(utils.thousandBitSeparator(12455.124)).toBe('12,455.124')
    expect(utils.thousandBitSeparator('12455.123')).toBe('12,455.123')
    expect(utils.thousandBitSeparator('asdf')).toBe('asdf')
    expect(utils.thousandBitSeparator('0')).toBe('0')
  })

  it('test', () => {
    const test = (...args: any[]) => {
      return args
    }
    expect(test({ a: '1' })).toEqual([{ a: '1' }])
    expect(Array.isArray(test({ a: '1' }))).toBe(true)
  })

  it('BigNumber', () => {
    const a = new BigNumber('12.1')
    expect(a.toString()).toBe('12.1')
    expect(a.c[0]).toBe(12)
    expect(a.minus(1).toString()).toBe('11.1')
    expect(a.toString()).toBe('12.1')
    expect(a.toNumber()).toBe(12.1)
    expect(BigNumber.isBigNumber(a)).toBe(true)
    const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex')
    expect(buf2.toString('hex')).toBe('7468697320697320612074c3a97374')
    // expect(Buffer.from(buf2)).toBe('7468697320697320612074c3a97374')
  })

  it('isValidPassword', () => {
    expect(utils.isValidPassword(' ')).toBe(false)
    expect(utils.isValidPassword('sadf356^@^%$@')).toBe(true)
    expect(utils.isValidPassword('asdfsdf@%$ ')).toBe(false)
    expect(utils.isValidPassword('中sdf')).toBe(false)
    expect(utils.isValidPassword('_@#%@%@2983652')).toBe(true)
    expect(utils.isValidPassword('交易费12345678')).toBe(false)
  })

  it('inValidAmount', () => {
    expect(utils.isValidAmount('1')).toBe(true)
    expect(utils.isValidAmount('.1.')).toBe(false)
    expect(utils.isValidAmount('1.1.')).toBe(false)
    expect(utils.isValidAmount('1353.125')).toBe(true)
    expect(utils.isValidAmount('.12421')).toBe(false)
  })

  it('getContractAmount', () => {
    expect(
      utils.getContractAmount(
        '{"action":"Transfer","contract_address":"0x001031De6191e61d2834B832a8fc4b49E7275AC7bE91","params":"[\\"0x0000792650ec53917d02F64AbA1094B3Eb6B93568aBc\\",\\"0x3e8\\"]"}'
      )
    ).toBe('1000')
  })

  it('formatAmount', () => {
    expect(utils.formatAmount('.3')).toBe('0.3')
    expect(utils.formatAmount('')).toBe('0')
  })
})
