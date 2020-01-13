import { createStyles } from '@material-ui/core/styles'
import More from '@/images/more.png'
import OptionBg from '@/images/optionbg.png'

const styles = createStyles({
  wrap: {
    display: 'inline-block'
  },
  more: {
    width: 24,
    height: 20,
    backgroundImage: `url(${More}) `,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 20,
    cursor: 'pointer'
  },
  btnBox: {
    width: 102,
    height: 68,
    transition: 'all 0.3s linear',
    backgroundImage: `url(${OptionBg})`,
    backgroundRepeat: 'no-repeat',
    paddingTop: 15
  },
  item: {
    fontSize: 14,
    color: '#fff',
    height: 24,
    lineHeight: `24px`,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#242646'
    }
  }
})

export default styles
