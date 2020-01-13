import { createStyles } from '@material-ui/core/styles'
import { materialButton, primaryColor } from '@/styles/appStyle'

import Bg from '../../images/login-bg.png'

import LockBg from '../../images/lock-bg.png'

const styles = createStyles({
  login: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `url(${Bg})`,
    backgroundSize: 'cover',
    zIndex: 2000
  },
  form: {
    position: 'absolute',
    width: 310,
    // height: 186,
    top: '50%',
    left: '50%',
    padding: '32px 0 20px',
    marginLeft: '-155px',
    marginTop: '-93px',
    borderRadius: '6px',
    background: '#fff'
  },
  item: {
    width: 262,
    marginLeft: 24,
    marginBottom: 20
  },
  title: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E050A',
    textAlign: 'center'
  },
  passwordInput: {
    border: '1px solid #bfbfbf',
    height: '60px',
    width: '478px',
    fontSize: '18px',
    paddingLeft: '22px',
    borderRadius: '6px'
  },
  button: {
    // position: 'absolute',
    display: 'block',
    width: '262px',
    height: '36px',
    margin: '0 auto',
    textTransform: 'none',
    fontSize: '16px',
    backgroundColor: primaryColor,
    '&:hover': {
      backgroundColor: primaryColor
    },
    ...materialButton,
    '& span': {
      fontWeight: 'bold'
    }
  },
  timeLock: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    fontWeight: 'bold',
    background: '#fff'
  },
  lockBg: {
    width: '100%',
    height: '100%',
    paddingTop: 413,
    background: `url(${LockBg}) no-repeat`,
    backgroundSize: 'cover',
    '& p:nth-child(1)': {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      paddingBottom: 24,
      fontWeight: 400
    },
    '& p:nth-child(2)': {
      fontSize: 30,
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  },
  resetText: {
    margin: '10px 0',
    padding: '0 24px',
    color: '#ff0000',
    fontSize: 12,
    textAlign: 'center'
  }
})

export default styles
