import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  onConfirm: (password?: string) => void
  title: string
  label: string
  btnText: string
  type?: string
  defaultVal?: string
}

@observer
export class DialogConfirm extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.value = props.defaultVal || ''
  }
  @observable
  value: string = ''

  @action
  handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.value = e.target.value
  }

  handleConfirm = e => {
    e.preventDefault()
    this.props.onConfirm(this.value)
  }

  render() {
    const { classes, onClose, title, label, btnText, type } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <TextField
              value={this.value}
              onChange={this.handleChangePassword}
              autoFocus={true}
              margin="dense"
              label={label}
              type={type || 'text'}
              fullWidth={true}
            />
          </DialogContent>
          <Button disabled={!this.value} variant="contained" color="primary" className={classes.button} type="submit">
            {btnText}
          </Button>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DialogConfirm)
