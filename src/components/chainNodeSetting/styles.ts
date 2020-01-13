import { createStyles } from '@material-ui/core/styles'
import ChangeDir from '@/images/changeDir.png'

const styles = createStyles({
  settingWrap: {
    position: 'absolute',
    top: 23,
    left: 164,
    display: 'flex'
  },
  netWrap: {
    marginRight: 8
  },
  select: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    width: 166,
    height: 24,
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,.6)',
    background: 'rgba(255,255,255,.1)',
    '&>p': {
      fontWeight: 'bold',
      fontSize: 12,
      color: 'rgba(255,255,255,.6)'
    }
  },
  icon: {
    marginTop: -2,
    color: 'rgba(255,255,255,.6)'
  },
  menu: {
    background: 'transparent'
  },
  item: {
    padding: '0 10px',
    fontSize: 12,
    height: 24,
    color: 'rgba(255,255,255,.6)'
  },
  dirSelect: {
    display: 'flex',
    justifyContent: 'spaceBetween',
    alignItems: 'center',
    padding: '0 10px',
    width: 258,
    borderRadius: 24,
    border: '1px solid rgba(255,255,255,.6)',
    background: 'rgba(255,255,255,.1)'
  },
  dirLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,.6)'
  },
  chainDir: {
    flex: 1,
    padding: '0 5px',
    fontSize: 12,
    color: 'rgba(255,255,255,.6)',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  selectorIcon: {
    height: '16px',
    width: '16px',
    background: `url(${ChangeDir})`
  }
})

export default styles
