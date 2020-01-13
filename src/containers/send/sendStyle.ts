import { createStyles } from '@material-ui/styles'
import { primaryColor, grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  item: {
    marginBottom: 5
  },
  min: {
    height: 14,
    fontSize: 12,
    color: primaryColor
  },
  confirmButton: {
    display: 'block',
    width: '262px',
    height: '36px',
    left: '50%',
    marginLeft: '-131px',
    margin: '25px auto 0',
    textTransform: 'none',
    fontSize: '16px',
    ...materialButton,
    backgroundColor: primaryColor,
    '&:hover': {
      backgroundColor: primaryColor
    },
    '& span': {
      fontWeight: 'bold'
    }
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    width: 310
  },
  dialogBtns: {
    justifyContent: 'space-evenly'
  },
  dialogBtn: {
    width: 120,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    boxShadow: 'none',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  },
  poundageBox: {
    position: 'relative'
  },
  poundageChange: {
    height: '18px',
    width: '12px',
    top: '21px',
    right: '0px',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  poundageAdd: {
    borderWidth: '0 5px 6px 5px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '6px solid #838899',
    '&:hover': {
      borderBottom: '8px solid #0A1747',
      cursor: 'pointer'
    },
    '&:active': {
      position: 'relative',
      top: '-2px',
      borderWidth: '0 6px 8 6px',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '8px solid #0A1747'
    }
  },
  poundageSub: {
    borderWidth: '6px 5px 0 5px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '6px solid #838899',
    '&:hover': {
      borderTop: '8px solid #0A1747',
      cursor: 'pointer'
    },
    '&:active': {
      position: 'relative',
      bottom: '-2px',
      borderWidth: '8px 6px 0 6px',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '8px solid #0A1747'
    }
  }
})

export default styles
