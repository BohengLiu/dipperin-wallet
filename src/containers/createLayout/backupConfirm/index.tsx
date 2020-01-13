import classnames from 'classnames'
import { findIndex, isEqual, shuffle } from 'lodash'
import { IObservableArray, observable, action, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import { I18nCollectionCreate } from '@/i18n/i18n'
import WalletStore from '../../../stores/wallet'
import ProcessBar from '../progressBar'
import styles from './backupConfirmStyle'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
}

interface IBackupProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionCreate['backupConfirm']
}

interface IclickWord {
  word: string
  selected: boolean
}

@inject('wallet')
@observer
export class BackupConfirm extends React.Component<IBackupProps> {
  @observable
  open: boolean = false
  @observable
  selectedWords: IObservableArray<string> = observable([])
  @observable
  clickWords: IObservableArray<IclickWord> = observable([])
  @observable
  correctWords: IObservableArray<string> = observable([])

  @action
  componentDidMount() {
    if (!this.props.wallet.mnemonic) {
      this.props.history.push('/')
      return
    }

    this.correctWords = this.props.wallet.mnemonic.split(' ') as IObservableArray<string>

    // Shuffle the words
    this.clickWords = shuffle(this.correctWords).map(word => {
      return {
        selected: false,
        word
      }
    }) as IObservableArray<IclickWord>
  }

  @action
  clickWord = (word: string, index: number) => {
    this.clickWords[index].selected = true
    this.selectedWords.push(word)
  }

  @action
  removeWord = (word: string) => {
    this.clickWords[findIndex(this.clickWords, ['word', word])].selected = false
    this.selectedWords.remove(word)
  }

  handleDone = async () => {
    if (!isEqual(this.selectedWords, this.correctWords)) {
      swal.fire({
        title: this.props.labels.swal.wordsWrong,
        icon: 'error'
      })
      return
    }
    runInAction(() => {
      this.open = true
    })
  }

  // dialog operate
  @action
  handleClose = () => {
    this.open = false
  }

  handleConfirm = async () => {
    const { wallet, history, labels } = this.props
    wallet.destroyMnemonic()
    wallet.save()
    await swal.fire({
      text: labels.swal.success,
      icon: 'success',
      confirmButtonText: labels.swal.confirm
    })
    history.push('/main/wallet')
  }

  @action
  handleCancel = () => {
    this.open = false
  }

  goBack = () => {
    this.props.history.push('/create/backup')
  }

  render() {
    const { selectedWords, clickWords } = this
    const {
      labels,
      classes,
      location: { pathname }
    } = this.props

    const toCreate = () => {
      this.props.history.push('/create')
    }
    return (
      <div className={classes.backupConfirm}>
        <div className={classes.top}>
          <div className={classes.back} onClick={this.goBack}>
            {labels.return}
          </div>
          <ProcessBar pathname={pathname} turnFunc={[true, toCreate, true, this.goBack]} />
          <p className={classes.title}>{labels.title}</p>
          <p className={classes.hint}>{labels.hint}</p>
        </div>
        <div className={classes.selectedWords}>
          {selectedWords.map((word, index) => (
            <SelectedWord key={index} word={word} onClick={this.removeWord} />
          ))}
        </div>
        <div className={classes.bottom}>
          <div className={classes.remainingWords}>
            {clickWords.map((clickWord, index) => (
              <ClickWord
                key={index}
                index={index}
                word={clickWord.word}
                onClick={this.clickWord}
                isSelected={clickWord.selected}
                className={classes.clickWord}
              />
            ))}
          </div>
          <Button
            disabled={this.selectedWords.length !== 12}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleDone}
          >
            {labels.confirm}
          </Button>
        </div>
        <Dialog
          open={this.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className={classes.dialogContent}>
            <DialogContentText className={classes.dialogText} id="alert-dialog-description">
              {labels.dialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button className={classes.dialogBtn} onClick={this.handleCancel} color="primary">
              {labels.cancel}
            </Button>
            <Button className={classes.dialogBtn} onClick={this.handleConfirm} color="primary" autoFocus={true}>
              {labels.dialogConfirm}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export class SelectedWord extends React.Component<{
  onClick: (word: string) => void
  word: string
}> {
  handleClick = () => {
    this.props.onClick(this.props.word)
  }
  render() {
    const { word } = this.props
    return (
      <span className={classnames(styles.clickWord, 'selected')} onClick={this.handleClick}>
        {word}
      </span>
    )
  }
}

export class ClickWord extends React.Component<{
  onClick: (word: string, index: number) => void
  isSelected?: boolean
  word: string
  index: number
  className: string
}> {
  handleClick = () => {
    this.props.onClick(this.props.word, this.props.index)
  }
  render() {
    const { word, isSelected, className } = this.props
    return (
      <span
        className={classnames(className, isSelected ? 'selected' : '')}
        onClick={isSelected ? () => null : this.handleClick}
      >
        {word}
      </span>
    )
  }
}

export const StyleBackupConfirm = withStyles(styles)(BackupConfirm)

const BackupConfrimWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleBackupConfirm {...other} labels={t('create:backupConfirm')} />
}

export default withTranslation()(BackupConfrimWrap)

// export default withNamespaces('backupConfirm')(StyleBackupConfirm)
