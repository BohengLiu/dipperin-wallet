import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { ClickAwayListener, Popper, Fade } from '@material-ui/core'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import styles from './styles'
interface BtnConfig {
  label: string
  handleFunc: () => void
}

interface Props extends WithStyles<typeof styles> {
  btnArray: BtnConfig[]
}
@observer
class DropButtons extends React.Component<Props> {
  @observable
  isShowDrop: boolean = false
  @observable
  anchorEl: any = null
  @action hideDrop = () => {
    this.isShowDrop = false
    this.anchorEl = null
  }
  @action showDrop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.anchorEl = e.currentTarget
    this.isShowDrop = true
  }

  handleClickAway = (e: React.MouseEvent) => {
    e.preventDefault()
    this.hideDrop()
  }
  wrapHandle = (func: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.hideDrop()
    func()
  }

  render() {
    const { classes, btnArray } = this.props
    return (
      <div className={classes.wrap}>
        <div className={classes.more} onClick={this.showDrop} />
        <Popper
          id={'dialog'}
          open={this.isShowDrop}
          anchorEl={this.anchorEl}
          transition={true}
          placement={'bottom'}
          style={{ zIndex: 2 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <div className={classes.btnBox}>
                  {btnArray.map(item => {
                    return (
                      <div onClick={this.wrapHandle(item.handleFunc)} key={item.label} className={classes.item}>
                        {item.label}
                      </div>
                    )
                  })}
                </div>
              </ClickAwayListener>
            </Fade>
          )}
        </Popper>
      </div>
    )
  }
}

export default withStyles(styles)(DropButtons)
