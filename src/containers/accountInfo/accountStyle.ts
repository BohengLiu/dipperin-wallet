import { createStyles } from '@material-ui/core/styles'
import AccountId from '../../images/account-bg.png'

const styles = createStyles({
  accountInfo: {
    position: 'relative',
    display: 'flex',
    margin: ' 18px 0 19px 18px',
    height: 81
  },
  left: {
    position: 'relative',
    width: 81,
    height: 81,
    background: `url(${AccountId}) no-repeat`,
    backgroundSize: 'cover',
    fontSize: 36,
    lineHeight: '81px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    '&.small-font': {
      fontSize: 30
    }
  },
  changeBtn: {
    minHeight: 0,
    minWidth: 0,
    padding: 0
  },
  changeImg: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 5,
    left: 6,
    borderRadius: '100%',
    cursor: 'pointer'
    // '& img': {
    //   width: 22,
    //   height: 22
    // }
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: 81,
    padding: '0px 0 0 9px',

    '& p:nth-child(1)': {
      fontSize: 12,
      color: '#fff',
      fontWeight: 'bold'
    },
    '& p:nth-child(2)': {
      margin: '0 0 0',
      fontSize: 24,
      color: '#fff',
      fontWeight: 400,
      '& span': {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    '& p:nth-child(3)': {
      // margin: '2px 0',
      fontSize: 16,
      color: 'rgba(255,255,255,0.4)',
      fontWeight: 400,
      '& img': {
        height: 12,
        width: 9
      },
      '& span': {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    '& p:nth-last-child(1)': {
      fontSize: 12,
      color: '#fff',
      fontWeight: 'bold'
    }
  },

  btnWrap: {
    position: 'absolute',
    top: 6,
    right: 24
  },
  btnItem: {
    display: 'inline-block',
    textAlign: 'center',
    verticalAlign: 'top',
    '& > p': {
      marginTop: 10,
      color: '#fff',
      fontSize: 10,
      lineHeight: '12px',
      whiteSpace: 'nowrap',
      fontWeight: 'bold'
    }
  },
  btn: {
    width: 34,
    height: 34,
    minHeight: 0,
    minWidth: 0
  },
  nodeSwitch: {
    marginRight: 18,
    '& img': {
      width: 16,
      height: 16
    }
  },
  loading: {
    animation: 'loading 2s infinite cubic-bezier(0.56, 0.92, 0.53, 0.21)',
    transformOrigin: '50% 50%'
  },
  running: {
    background: '#0A174C',
    '&:hover': {
      background: '#0A174C'
    }
  },
  lock: {
    marginRight: 18,
    '& img': {
      width: 12,
      height: 16
    }
  },
  global: {
    '& span': {
      fontSize: 14,
      color: '#0A174C',
      fontWeight: 'bold'
    }
  },
  '@keyframes loading': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
})

export default styles
