import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton, primaryColor } from '@/styles/appStyle'

const styles = createStyles({
  dialogTitle: {
    padding: '28px 0 15px',
    fontSize: 16,
    color: '#0E050A',
    textAlign: 'center'
  },
  dialogContent: {
    width: 310,
    padding: '0 24px'
  },
  info: {
    fontSize: 12,
    color: '#838899',
    marginBottom: 20,
    lineHeight: '1.5em'
  },
  option: {
    display: 'flex',
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'start',
    '& img': {
      marginTop: 3,
      width: 16
    }
  },
  optionText: {
    flex: 1,
    fontSize: 12,
    paddingLeft: 7,
    color: '#A7ABB6'
  },
  selected: {
    color: primaryColor
  },
  dialogBtns: {
    justifyContent: 'space-evenly',
    margin: '20px 0'
  },
  dialogBtn: {
    width: 120,
    color: grayColor,
    fontSize: 16,
    textTransform: 'none',
    ...materialButton,
    '& span': {
      fontWeight: 'bold',
      color: '#fff'
    }
  }
})

export default styles
