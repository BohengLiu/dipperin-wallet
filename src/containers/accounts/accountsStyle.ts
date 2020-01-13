import { createStyles } from '@material-ui/core/styles'

import Bg from '../../images/bg.png'
import AccountId from '../../images/account-bg.png'

import { textOverflow, materialButton } from '../../styles/appStyle'

const S_WIDTH = 80
const S_MARGIN = 12

const styles = createStyles({
  changeAccount: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `url(${Bg})`,
    backgroundSize: 'cover',
    zIndex: 2
  },
  shadow: {
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.7)',
    overflow: 'hidden'
  },
  importBtnBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    display: 'block',
    width: '262px',
    height: '36px',
    // left: '50%',
    // marginLeft: '-131px',
    margin: '60px 50px',
    padding: 0,
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      lineHeight: '36px'
    }
  },
  close: {
    position: 'absolute',
    right: 46,
    top: 46,
    width: 40,
    height: 40,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    borderRadius: '100%',
    '& img': {
      width: 40,
      height: 40
    }
  },
  btnIcon: {
    marginTop: -4,
    verticalAlign: 'middle'
  },
  bigList: {
    height: 280,
    margin: '0 0 46px 132px'
  },
  bigItem: {
    position: 'relative',
    display: 'inline-block',
    width: 240,
    height: 280,
    marginRight: 48,
    padding: '22px 30px 0',
    borderRadius: '6px',
    background: '#fff',
    verticalAlign: 'top',
    textAlign: 'center',
    cursor: 'pointer'
  },
  moreWrap: {
    position: 'absolute',
    width: 20,
    right: 6,
    top: 10
  },
  bigAccountName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  bigId: {
    margin: '5px auto 10px',
    width: 91,
    height: 91,
    background: `url(${AccountId}) no-repeat`,
    backgroundSize: 'cover',
    fontSize: 41,
    lineHeight: '91px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    ...textOverflow,
    '&.small-font': {
      fontSize: 30
    }
  },
  bigBalance: {
    marginBottom: 5,
    fontSize: 24,
    lineHeight: '24px',
    fontWeight: 'bold',
    ...textOverflow
  },
  bigDip: {
    fontSize: 16,
    marginBottom: 10
  },
  bigAddress: {
    fontSize: 12,
    lineHeight: '20px',
    wordBreak: 'break-all'
  },
  edit: {
    verticalAlign: 'middle',
    display: 'inline-block',
    width: 18,
    height: 18,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    marginLeft: 10,
    '& img': {
      width: 14,
      height: 14,
      marginBottom: 2
    }
  },
  copy: {
    display: 'block',
    width: 18,
    height: 18,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    margin: '0 auto 0',
    '& img': {
      width: 18,
      height: 18
    }
  },
  current: {
    position: 'absolute',
    top: -8,
    left: -8,
    height: 108,
    width: 108
  },
  accountsList: {
    position: 'relative'
  },
  left: {
    position: 'absolute',
    top: 36,
    left: 106,
    width: 12,
    height: 22,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    cursor: 'pointer',
    '& img': {
      width: 12,
      height: 22
    }
  },
  right: {
    position: 'absolute',
    top: 36,
    right: 106,
    width: 12,
    height: 22,
    cursor: 'pointer',
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    '& img': {
      width: 12,
      height: 22
    }
  },
  listContainer: {
    position: 'relative',
    margin: '0 auto',
    height: 94,
    overflow: 'hidden'
  },
  list: {
    position: 'absolute',
    height: '100%',
    left: 0,
    top: 0,
    transition: 'left 1s'
  },
  item: {
    position: 'relative',
    display: 'inline-block',
    width: S_WIDTH,
    height: '100%',
    marginRight: S_MARGIN,
    padding: '7px 10px 0',
    borderRadius: '4px',
    background: '#fff',
    verticalAlign: 'top',
    cursor: 'pointer',
    textAlign: 'center',
    '&:last-child': {
      marginRight: 0
    }
  },
  smallAccountName: {
    fontSize: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  smallId: {
    margin: '5px auto 5px',
    width: 30,
    height: 30,
    background: `url(${AccountId}) no-repeat`,
    backgroundSize: 'cover',
    fontSize: 14,
    lineHeight: '30px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    ...textOverflow
  },
  smallBalance: {
    marginBottom: 2,
    fontSize: 8,
    fontWeight: 'bold',
    ...textOverflow
  },
  smallDip: {
    fontSize: 5,
    marginBottom: 3
  },
  smallAddress: {
    fontSize: 4,
    lineHeight: '7px',
    wordBreak: 'break-all'
  },
  selected: {
    border: '3px solid #3EC9FD'
  },
  smallCurrent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 35,
    width: 35
  },
  smallShadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.3)'
  }
})

export default styles
