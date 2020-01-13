import React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import { I18nCollectionWallet } from '@/i18n/i18n'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import Select from '@/images/select-icon.png'
import Selected from '@/images/selected-icon.png'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  labels: I18nCollectionWallet['setting']
  handleChangeDir: (changeData: boolean) => void
  onClose: () => void
}

@observer
class ChangeChainDataDirPop extends React.Component<Props> {
  @observable changeData: boolean = false

  handleSelect = (select: boolean) => () => {
    this.setChangeData(select)
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.handleChangeDir(this.changeData)
  }

  @action
  setChangeData = (select: boolean) => {
    this.changeData = select
  }

  render() {
    const { labels, classes, onClose } = this.props
    return (
      <Dialog open={true}>
        <form onSubmit={this.handleSubmit}>
          <DialogTitle className={classes.dialogTitle}>{labels.dataDirPop.title}</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p className={classes.info}>{labels.dataDirPop.info}</p>
            <div className={classes.option} onClick={this.handleSelect(false)}>
              <img src={this.changeData ? Select : Selected} alt="o" />
              <p className={classNames([classes.optionText, !this.changeData && classes.selected])}>
                {labels.dataDirPop.option1}
              </p>
            </div>
            <div className={classes.option} onClick={this.handleSelect(true)}>
              <img src={this.changeData ? Selected : Select} alt="o" />
              <p className={classNames([classes.optionText, this.changeData && classes.selected])}>
                {labels.dataDirPop.option2}
              </p>
            </div>
          </DialogContent>

          <DialogActions className={classes.dialogBtns}>
            <Button onClick={onClose} variant="contained" className={classes.dialogBtn}>
              {labels.dataDirPop.cancel}
            </Button>
            <Button variant="contained" className={classNames(classes.dialogBtn)} type="submit" color="primary">
              {labels.dataDirPop.confirm}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ChangeChainDataDirPop)
