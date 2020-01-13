import BIP39 from 'bip39'
import i18next from 'i18next'
import classNames from 'classnames'
import { observable, reaction, action, runInAction, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import Tour from 'reactour'
import swal from 'sweetalert2'

import AccountStore from '@/stores/account'
import LoadingStore from '@/stores/loading'
import WalletStore from '@/stores/wallet'
import { isValidPassword } from '@/utils'
import settings from '@/utils/settings'
import { Button, FormControl } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// import Add from '../../images/add-icon.png'
import Curtain from '@/images/curtain.png'
import CorrectIcon from '@/images/correct.png'
import ErrorIcon from '@/images/error.png'
// import En from '@/images/en.png'
// import Cn from '@/images/cn.png'
import styles from './importStyle'
import { I18nCollectionWallet } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
  loading: LoadingStore
  account: AccountStore
}

interface IImportProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionWallet['import']
  language: string
  changeLanguage: (lng: string, callback?: i18next.Callback | undefined) => void
}

@inject('wallet', 'loading', 'account')
@observer
export class Import extends React.Component<IImportProps> {
  @observable
  password = ''
  @observable
  repeatPassword = ''
  @observable
  mnemonic = ''
  @observable
  showTour: boolean = false
  @observable
  validatePassword: string = '' // password tip
  @observable
  isPasswordRight: boolean = false // is password right ?
  @observable
  isShowValidatePassword: boolean = false // is show password tip ?
  @observable
  isShowDiffTip: boolean = false
  @observable
  isRepeatPwdRight: boolean = false

  @action
  componentDidMount() {
    if (this.props.wallet.isHaveWallet) {
      if (this.props.wallet.isUnlock) {
        this.props.history.push('/main/wallet')
      } else {
        this.props.history.push('/login')
      }
    }
    reaction(
      () => this.props.wallet.isHaveWallet,
      async () => {
        const { labels } = this.props
        if (this.props.wallet.isHaveWallet) {
          if (this.props.wallet.isUnlock) {
            await swal.fire({
              icon: 'success',
              title: labels.swal.success,
              confirmButtonText: labels.swal.confirm,
              timer: 1000
            })
            this.props.history.push('/main/wallet')
          } else {
            this.props.history.push('/login')
          }
        }
      }
    )

    this.showGuide()

    reaction(
      () => this.props.loading.downloading,
      () => {
        this.showGuide()
      }
    )
  }

  @action
  passwordInput = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]{0,24}$/.test(e.target.value)) {
      this.password = e.target.value
    }
  }

  @computed
  get passwordStrength() {
    let result = 0
    if (/[a-z]/.test(this.password)) {
      result += 1
    }
    if (/[A-Z]/.test(this.password)) {
      result += 1
    }
    if (/[0-9]/.test(this.password)) {
      result += 1
    }
    if (/[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/.test(this.password)) {
      result += 1
    }
    return result
  }

  @action
  repeatPasswordInput = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]{0,24}$/.test(e.target.value)) {
      this.repeatPassword = e.target.value
    }
  }

  @action
  mnemonicInput = e => {
    this.mnemonic = e.target.value
  }

  @action
  handleBlurMnemonic = () => {
    this.mnemonic = this.mnemonic.replace(/^\s*|\s*$/g, '')
  }

  @action
  showGuide = async () => {
    if (!this.props.loading.downloading) {
      if (!settings.get('showImportGuide')) {
        this.showTour = true
      }
    } else {
      this.showTour = false
    }
  }

  @computed
  get validateMnemonic(): boolean {
    return BIP39.validateMnemonic(this.mnemonic)
  }

  @action
  vertifyPassword = () => {
    this.isShowValidatePassword = true
    if (this.password === '') {
      this.isPasswordRight = false
      // this.validatePassword = this.props.labels.swal.emptyPassword
      this.validatePassword = 'emptyPassword'
      return
    }
    if (!this.password || this.password.length < 8) {
      this.isPasswordRight = false
      // this.validatePassword = this.props.labels.swal.passwordLength
      this.validatePassword = 'passwordLength'
      return
    }
    if (!isValidPassword(this.password)) {
      this.isPasswordRight = false
      // this.validatePassword = this.props.labels.swal.invalidPassword
      this.validatePassword = 'invalidPassword'
      return
    }
    this.validatePassword = ''
    this.isPasswordRight = true
  }

  @action
  validateRptPassword = () => {
    this.isShowDiffTip = true
    this.isRepeatPwdRight = this.password === this.repeatPassword
  }

  verifyInputs = (
    mnemonic: string,
    password: string,
    repeatPassword: string,
    labels: I18nCollectionWallet['import']
  ): string | void => {
    if (mnemonic === '') {
      return labels.swal.emptyMnemonic
    }
    if (mnemonic.trim().split(' ').length < 12) {
      return labels.swal.mnemonicLength
    }
    if (!BIP39.validateMnemonic(mnemonic)) {
      return labels.swal.invalidMnemonic
    }
    if (password === '') {
      return labels.swal.emptyPassword
    }
    if (!password || password.length < 8) {
      return labels.swal.passwordLength
    }
    if (!isValidPassword(password)) {
      return labels.swal.invalidPassword
    }
    if (password !== repeatPassword) {
      return labels.swal.diffPassword
    }
  }

  handleConfirm = async e => {
    e.preventDefault()
    const { labels } = this.props
    const errInfo = this.verifyInputs(this.mnemonic, this.password, this.repeatPassword, labels)
    if (errInfo) {
      swal.fire({
        icon: 'error',
        title: errInfo,
        confirmButtonText: labels.swal.confirm
      })
      return
    }
    const { wallet } = this.props
    const err = await wallet.create(this.password, this.mnemonic)

    // this.props.account.changeActiveAccount("1")
    if (err) {
      swal.fire({
        icon: 'error',
        title: err.message
      })
      return
    }
    runInAction(() => {
      this.mnemonic = ''
    })

    wallet.save()
    for (let i = 0; i < 14; i++) {
      await this.props.account.addAccount()
    }
    this.props.account.changeActiveAccount('1')
    for (const act of this.props.account.accounts) {
      if (act.balance && Number(act.balance) > 0) {
        this.props.account.changeActiveAccount(String(act.id))
        break
      }
    }
    for (let i = 15; i > 1; i--) {
      if (
        this.props.account.accountMap.get(String(i)) &&
        this.props.account.accountMap.get(String(i))!.balance === '0'
      ) {
        await this.props.account.removeAccountAsync(String(i))
      } else {
        break
      }
    }
    // this.props.account.showDbAccounts()
  }

  ToCreate = () => {
    this.props.history.push('/create')
  }

  @action
  closeTour = () => {
    this.showTour = false
    settings.set('showImportGuide', true)
  }
  // change language
  handleChangeLang = () => {
    const lang = this.props.language
    this.props.changeLanguage(lang === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  render() {
    const { labels, classes } = this.props
    // const disable = !this.mnemonic || !this.password || !this.repeatPassword || this.password !== this.repeatPassword
    const isChinese = this.props.language === 'zh-CN'
    const steps = [
      {
        selector: `[data-tour='second']`,
        content: labels.tour.create,
        style: tourStyles
      },
      {
        selector: `[data-tour='first']`,
        content: labels.tour.import,
        style: tourStyles
      }
    ]
    return (
      <div className={classes.import}>
        <img src={Curtain} />
        <div className={classes.globalWrap}>
          <Button
            className={classNames({
              [classes.langBtn]: true,
              [classes.langCn]: isChinese,
              [classes.langEn]: !isChinese
            })}
            onClick={this.handleChangeLang}
          >
            ''
          </Button>
        </div>
        <form className={classes.form} onSubmit={this.handleConfirm}>
          <p className={classes.title}>{labels.title}</p>
          <div data-tour={'first'}>
            <FormControl fullWidth={true} className={classes.item}>
              <label className={classes.inputLabel}>
                <span>{labels.mnemonic}</span>
                {this.mnemonic && (
                  <Tip type={this.validateMnemonic} msg={!this.validateMnemonic ? labels.swal.invalidMnemonic : ''} />
                )}
              </label>
              <textarea
                className={classNames([classes.textInput, classes.mnemonicInput])}
                value={this.mnemonic}
                onChange={this.mnemonicInput}
                onBlur={this.handleBlurMnemonic}
              />
            </FormControl>
            <FormControl fullWidth={true} className={classes.item}>
              <label className={classes.inputLabel}>
                <span>{labels.setPassword}</span>
                {this.isShowValidatePassword && (
                  <Tip type={this.isPasswordRight} msg={labels.swal[this.validatePassword]} />
                )}
              </label>
              <input
                className={classNames([classes.textInput, classes.pswInput])}
                type="password"
                value={this.password}
                onChange={this.passwordInput}
                onBlur={this.vertifyPassword}
              />
            </FormControl>
            {this.password && (
              <div className={classes.pswStr}>
                <div className={classes.rankbar}>
                  <div className={classes.weakPswActive} />
                  <div
                    className={
                      this.passwordStrength > 1 && this.password.length >= 8
                        ? classes.mediumPswActive
                        : classes.mediumPsw
                    }
                  />
                  <div
                    className={
                      this.passwordStrength > 3 && this.password.length >= 8
                        ? classes.strongPswActive
                        : classes.strongPsw
                    }
                  />
                </div>
                <div className={classes.rankbar}>
                  <span className={classes.weakText}>{labels.weak}</span>
                  <span
                    className={
                      this.passwordStrength > 1 && this.password.length >= 8
                        ? classes.mediumText
                        : classes.strengthTextDefault
                    }
                  >
                    {labels.medium}
                  </span>
                  <span
                    className={
                      this.passwordStrength > 3 && this.password.length >= 8
                        ? classes.strongText
                        : classes.strengthTextDefault
                    }
                  >
                    {labels.strong}
                  </span>
                </div>
              </div>
            )}

            <FormControl fullWidth={true} className={classes.item}>
              <label className={classes.inputLabel}>
                <span>{labels.repeatPassword}</span>
                {this.isShowDiffTip && (
                  <Tip type={this.isRepeatPwdRight} msg={!this.isRepeatPwdRight ? labels.swal.diffPassword : ''} />
                )}
              </label>
              <input
                className={classNames([classes.textInput, classes.pswInput])}
                type="password"
                value={this.repeatPassword}
                onChange={this.repeatPasswordInput}
                onBlur={this.validateRptPassword}
              />
            </FormControl>
            <Button variant="contained" color="primary" className={classes.button} type="submit">
              {labels.recovery}
            </Button>
            <div className={classes.note}>{labels.note}</div>
          </div>
          <div className={classes.create}>
            <Button
              className={classes.addBtn}
              variant="contained"
              color="primary"
              onClick={this.ToCreate}
              data-tour={'second'}
            >
              <p className={classNames({ ['cn']: isChinese })}>
                <span className={classes.addIcon}>+</span>
                {labels.create}
              </p>
            </Button>
          </div>
        </form>
        <Tour
          steps={steps}
          isOpen={this.showTour}
          onRequestClose={this.closeTour}
          closeWithMask={false}
          disableInteraction={true}
          lastStepNextButton={'ok'}
        />
      </div>
    )
  }
}

export const StyleImport = withStyles(styles)(Import)
const ImportWrap = (props: WrapProps & WithTranslation) => {
  const { t, i18n, ...other } = props
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return <StyleImport {...other} labels={t('wallet:import')} language={i18n.language} changeLanguage={changeLanguage} />
}

export default withTranslation()(ImportWrap)

// export default withStyles(styles)(withNamespaces('import')(Import))

const tourStyles = {
  borderRadius: '4px'
}

interface TipProps {
  type: boolean
  msg?: string
}

const Tip = (props: TipProps) => {
  // console.log(`url(${props.type === 'correct' ? CorrectIcon : ErrorIcon})`)
  return (
    <Fragment>
      <span
        style={{
          width: 14,
          height: 14,
          display: 'inline-block',
          backgroundImage: `url(${props.type ? CorrectIcon : ErrorIcon})`,
          marginLeft: '18px'
          // transform: 'translateY(2px)'
        }}
      />
      {props.msg && <span style={{ color: '#981733', marginLeft: '5px' }}>{props.msg}</span>}
    </Fragment>
  )
}
