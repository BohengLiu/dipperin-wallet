import { createStyles } from '@material-ui/core/styles'
import { materialButton, primaryColor } from '@/styles/appStyle'

const styles = createStyles({
  callerBox: {
    width: '100%',
    border: '1px solid #E5E5E5',
    margin: '10px 0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  topbar: {
    width: '100%',
    height: '30px',
    display: 'flex',
    alignItems: 'center'
  },
  inputList: {
    width: '100%',
    borderTop: '1px solid #ddd',
    overflow: 'hiddwen'
  },
  resultBox: {
    width: '100%'
  },
  inputItem: {
    width: '100%',
    margin: '5px 0',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  resultItem: {
    width: '100%',
    margin: '5px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& span': {
      fontSize: '12px',
      color: '#72747D',
      fontWeight: 'bold',
      padding: '5px',
      textAlign: 'center',
      minWidth: '90px',
      maxWidth: '200px',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }
  },
  inputName: {
    marginRight: '8px',
    fontSize: '12px'
  },
  inputText: {
    marginRight: '9px',
    padding: '0 5px',
    height: 24,
    width: '200px',
    borderRadius: '4px',
    border: '1px solid #D8D8D8'
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
  button: {
    // display: 'block',
    float: 'right',
    border: 'none',
    margin: '5px 8px',
    padding: 0,
    color: '#fff',
    width: '68px',
    height: '24px',
    textTransform: 'none',
    fontSize: '12px',
    lineHeight: '24px',
    fontWeight: 'bold',
    ...materialButton,
    backgroundColor: primaryColor,
    '&:hover': {
      backgroundColor: primaryColor
    }
    // '& span': {
    //   fontWeight: 'bold'
    // }
  },
  form: {
    display: 'block',
    position: 'relative',
    margin: '0 auto',
    width: '100%'
  },
  topBtn: {
    border: '0',
    margin: '0',
    width: '88px',
    height: '30px',
    textTransform: 'none',
    fontSize: '12px',
    color: '#72747D',
    fontWeight: 'bold',
    lineHeight: '30px',
    background: 'rgba(243,247,249,1)',
    // borderRadius: '4px 0px 0px 4px',
    verticalAlign: 'middle',
    textAlign: 'center',
    outline: 'none',
    cursor: 'pointer',
    padding: '0 4px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  topInput: {
    border: 'none',
    height: '30px',
    borderWidth: '0 1px',
    padding: '0 9px',
    flexGrow: 1
  },
  arrow: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    height: '30px',
    padding: '8px 3px',
    fontSize: '12px'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  config: {
    color: '#333',
    marginBottom: 10,
    '& b': {
      fontWeight: 'bold'
    }
  },
  close: {
    position: 'absolute',
    right: -26,
    top: 6
  }
})

export default styles
