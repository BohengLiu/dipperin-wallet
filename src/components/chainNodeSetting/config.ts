import { VENUS, TEST, LOCAL } from '@/utils/constants'

export const netConfig = [
  {
    isRemote: true,
    net: VENUS,
    i18Key: 'remoteVenus'
  },
  {
    isRemote: true,
    net: TEST,
    i18Key: 'remoteTest'
  },
  {
    isRemote: false,
    net: VENUS,
    i18Key: 'localVenus'
  },
  {
    isRemote: false,
    net: TEST,
    i18Key: 'localTest'
  },
  {
    isRemote: false,
    net: LOCAL,
    i18Key: 'localLocal'
  }
]
