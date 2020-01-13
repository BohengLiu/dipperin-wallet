import { createStyles } from '@material-ui/core/styles'

import { drawerWidth, transition, boxShadow, defaultFont, primaryBoxShadow } from '../../styles/appStyle'

const sidebarStyle = theme =>
  createStyles({
    drawerPaper: {
      border: 'none',
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      zIndex: 1,
      width: drawerWidth,
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        position: 'fixed',
        height: '100%',
        overflow: 'initial'
      },
      [theme.breakpoints.down('sm')]: {
        width: drawerWidth,
        ...boxShadow,
        position: 'fixed',
        display: 'block',
        top: '0',
        height: '100vh',
        right: '0',
        left: 'auto',
        zIndex: 1032,
        visibility: 'visible',
        overflowY: 'visible',
        borderTop: 'none',
        textAlign: 'left',
        paddingRight: '0px',
        paddingLeft: '0',
        transform: `translate3d(${drawerWidth}px, 0, 0)`,
        ...transition
      }
    },
    logo: {
      position: 'relative',
      padding: '24px 0 28px',
      cursor: 'pointer',
      '& .blockInfo': {
        position: 'absolute',
        opacity: 0,
        left: 40,
        top: 40,
        width: 0,
        height: 0,
        // opacity: 1,
        // width: 248,
        // height: 240,
        background: '#fff',
        transition: 'all 1s cubic-bezier(0.07, 0.7, 0.2, 1)',
        borderRadius: '10px',
        zIndex: 5,
        overflow: 'hidden',
        boxShadow: '0 0 5px 5px rgba(0,0,0,0.05)'
      },
      '& .activeInfo': {
        opacity: 1,
        width: 248,
        height: 240
      }
      // '&:hover': {
      //   '& .blockInfo': {
      //     opacity: 1,
      //     width: 248,
      //     height: 240
      //   }
      // }
    },
    infoDetail: {
      width: 248,
      padding: '0 16px',
      boxSizing: 'border-box',
      color: '#0a174c'
    },
    infoTitle: {
      padding: '20px 0',
      fontSize: 12,
      fontWeight: 400
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      height: 30,
      fontSize: 12
    },
    infoIcon: {
      width: 12,
      height: 12,
      marginRight: 8,
      border: `2px solid '#0a174c'`,
      borderRadius: '100%'
    },
    itemLabel: {
      marginRight: 10,
      fontWeight: 400
    },
    itemValue: {
      flex: 1,
      textAlign: 'right',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    noMaxWidth: {
      maxWidth: 'none'
    },
    logoLink: {
      // ...defaultFont,
      // textTransform: 'uppercase',
    },
    logoImage: {
      display: 'block',
      width: 36,
      height: 50,
      margin: '0 auto'
    },
    img: {
      width: '35px',
      top: '22px',
      position: 'absolute',
      verticalAlign: 'middle',
      border: '0'
    },
    background: {
      position: 'absolute',
      zIndex: 1,
      height: '100%',
      width: '100%',
      display: 'block',
      top: '0',
      left: '0',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      '&:after': {
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '100%',
        content: '""',
        display: 'block',
        background: '#000',
        opacity: 0.8
      }
    },
    list: {
      position: 'relative',
      height: '100%',
      listStyle: 'none'
    },
    item: {
      position: 'relative',
      display: 'block',
      textDecoration: 'none',
      width: drawerWidth,
      userSelect: 'none',
      '&:hover,&:focus,&:visited,&': {
        color: '#FFFFFF'
      }
    },
    setting: {
      position: 'absolute',
      bottom: 24,
      left: 0
    },
    itemLink: {
      width: 'auto',
      // transition: 'all 300ms linear',
      // margin: '10px 15px 0',
      borderRadius: 0,
      position: 'relative',
      display: 'block',
      padding: '10px 15px',
      backgroundColor: 'transparent',
      userSelect: 'none',
      '&:focus': {
        backgroundColor: '#0a174c'
      },
      ...defaultFont
    },
    iconWrap: {
      position: 'relative',
      margin: '0 auto',
      width: 40,
      height: 40
    },
    icon: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      userSelect: 'none'
    },
    itemText: {
      ...defaultFont,
      margin: '0',
      lineHeight: '30px',
      fontSize: 12,
      fontWeight: 'bold',
      color: '#0a174c',
      textAlign: 'center'
    },
    whiteFont: {
      color: '#FFF'
    },
    purple: {
      backgroundColor: '#0a174c',
      ...primaryBoxShadow,
      '&:hover': {
        backgroundColor: '#0a174c',
        ...primaryBoxShadow
      }
    },
    active: {
      backgroundColor: '#0a174c',
      '&:hover': {
        backgroundColor: '#0a174c'
      }
    },
    sidebarWrapper: {
      position: 'relative',
      height: 'calc(100vh - 102px)',
      overflow: 'auto',
      width: drawerWidth,
      zIndex: 4,
      overflowScrolling: 'touch'
    },
    activePro: {
      [theme.breakpoints.up('md')]: {
        position: 'absolute',
        width: '100%',
        bottom: '13px'
      }
    },
    shadow: {
      position: 'fixed',
      left: 0,
      top: 0,
      width: drawerWidth,
      height: '100vh',
      background: 'rgba(0,0,0,.7)',
      zIndex: 2000
    }
  })

export default sidebarStyle
