import { createStyles } from '@material-ui/core/styles'
import { grayColor, materialButton } from '@/styles/appStyle'

const styles = createStyles({
  main: {
    position: 'relative',
    display: 'flex',
    width: 892,
    height: 450,
    margin: '0 auto',
    color: grayColor,
    fontSize: 12,
    borderRadius: '6px',
    background: '#fff',
    overflow: 'hidden'
  },
  btn: {
    ...materialButton
  }
})

export default styles
