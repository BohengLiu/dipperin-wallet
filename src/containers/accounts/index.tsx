import classNames from 'classnames'
import { observable, reaction, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
// import _ from 'lodash'
import throttle from 'lodash/throttle'
import swal from 'sweetalert2'

import AccountStore from '@/stores/account'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import AccountModel from '@/models/account'
import { I18nCollectionAccount } from '@/i18n/i18n'
import SmallAccountList from './components/smallAccountList'
import BigAccountList from './components/bigAccountList'
import PrivateConfirm from '@/components/privateKeyImport'
import { TxResponseCode, TxResponseInfo } from '@/utils/errors'
import DialogConfirm from '@/components/dialogConfirm'

import Close from '@/images/close.png'
import Left from '@/images/left.png'
import Right from '@/images/right.png'

import styles from './accountsStyle'

export interface Props extends AccountWrapProps, WithStyles<typeof styles> {
  account?: AccountStore
  labels: I18nCollectionAccount['accounts']
}

const S_WIDTH = 80
const S_MARGIN = 12
const S_AMOUNT = 9
const ITEM_WIDTH = S_MARGIN + S_WIDTH
const CONTAINER_WIDTH = S_AMOUNT * S_WIDTH + (S_AMOUNT - 1) * S_MARGIN // 816

@inject('account')
@observer
export class Accounts extends React.Component<Props> {
  @observable
  selectedIndex: number = 0
  // show big accounts
  @observable
  bigAccounts: AccountModel[] = []
  @observable
  smallListLeft: number = 0
  @observable
  smallListPage: number = 1
  @observable
  showPrivateKeyModal = false
  @observable
  isShowDialogConfirm: boolean = false
  @observable accountToUpdate: AccountModel | null = null

  constructor(props: Props) {
    super(props)
    this.init()
  }

  @action
  init = () => {
    const index = this.props.account!.accounts.findIndex(item => item.id === this.props.account!.activeAccount.id)
    this.changeAccount(index)
    reaction(
      () => this.props.account!.accounts.findIndex(item => item.id === this.props.account!.activeAccount.id),
      idx => {
        this.changeAccount(idx)
      }
    )
  }

  @action
  showDialogConfirm = (account: AccountModel): void => {
    this.accountToUpdate = account
    this.isShowDialogConfirm = true
  }
  @action
  hideDialogConfirm = (): void => {
    this.isShowDialogConfirm = false
  }

  @action
  handleUpdateNameConfirm = async (value: string) => {
    const val = value.trim().replace(/\s+/g, ' ') // 去掉前后空格 把联系空格替换为一个
    const { updateAccount } = this.props.account!
    this.accountToUpdate!.updateAccountName(val)
    await updateAccount(this.accountToUpdate!)
    this.hideDialogConfirm()
    this.showAccounts(this.selectedIndex)
    swal.fire({
      showCloseButton: false,
      icon: 'success',
      timer: 1500,
      title: this.props.labels.changeSuccess
    })
  }

  @action
  deleteAccount = async (id: string) => {
    const { removeAccountAsync } = this.props.account!
    const result = await swal.fire({
      title: this.props.labels.deleteAccountTitle,
      text: this.props.labels.deleteAccountText,
      showCancelButton: true,
      confirmButtonText: this.props.labels.confirm,
      cancelButtonText: this.props.labels.cancel,
      reverseButtons: true
    })

    if (result.value) {
      await removeAccountAsync(id)
      const showIdx =
        this.selectedIndex >= this.props.account!.accounts.length ? this.selectedIndex - 1 : this.selectedIndex
      this.changeAccount(showIdx)
      swal.fire({
        icon: 'success',
        text: this.props.labels.deleteSuccess,
        timer: 1500
      })
    }
  }

  @action
  setPrivateKeyModal = (flag: boolean) => {
    this.showPrivateKeyModal = flag
  }

  handleShowPrivateKey = () => {
    this.setPrivateKeyModal(true)
  }

  handleClosePrivateKey = () => {
    this.setPrivateKeyModal(false)
  }

  /**
   * show big accounts & small accounts
   */
  @action
  showAccounts = (index: number) => {
    const { account } = this.props
    const { accounts } = account!
    this.selectAccount(index)
    this.bigAccounts = this.getBigAccounts(index, accounts)
  }

  /**
   * get current big accounts
   */
  @action
  getBigAccounts = (index: number, accounts: AccountModel[]) => {
    const accountLength = accounts.length
    return accounts.filter((_, idx) => {
      // active id is the last/first one
      if ((index === accountLength - 1 || index === 0) && Math.abs(idx - index) < 3) {
        return true
      }
      if (Math.abs(idx - index) < 2) {
        return true
      }

      return false
    })
  }

  addAccount = async () => {
    try {
      this.props.account!.addAccount()
    } catch (err) {
      this.props.history.push('/login')
      // throw err
    }
    // await this.props.account!.showDbAccounts()
  }

  handleAddAccount = throttle(this.addAccount, 1500)

  importPrivateKey = async (privateKey: string) => {
    try {
      await this.props.account!.importPrivateKey(privateKey)
      this.handleClosePrivateKey()
    } catch (err) {
      if (err.message === TxResponseInfo[TxResponseCode.addressReimportError]) {
        throw new Error(this.props.labels.addressReimportError)
      } else {
        throw new Error(this.props.labels.importError)
      }

      // this.props.history.push('/login')
    }
    // await this.props.account!.showDbAccounts()
  }

  handleChangeActiveAccount = (id: string) => {
    this.props.account!.changeActiveAccount(id)
    this.props.handleClose()
  }

  @action
  changeAccount = (index: number) => {
    this.selectedIndex = index
    this.showAccounts(index)
  }

  computeMiddleAccount = (accountLength: number, samllListLeft: number): number | undefined => {
    const perWidth = S_WIDTH + S_MARGIN
    if (accountLength <= S_AMOUNT) {
      return
    }
    return Math.floor(Math.abs(samllListLeft) / perWidth) + 5
  }

  /**
   * show big account by small account position
   */
  @action
  updateSelectedAccount = () => {
    const { accounts } = this.props.account!
    const middleAccount = this.computeMiddleAccount(accounts.length, this.smallListLeft)
    if (middleAccount) {
      this.selectedIndex = middleAccount
      this.showAccounts(this.selectedIndex)
    }
  }

  /**
   * handle left
   */
  @action
  handleLeft = () => {
    const preSmallListleft = this.smallListLeft
    this.smallListLeft = this.computeHandleLeft(this.smallListLeft)
    if (preSmallListleft !== this.smallListLeft) {
      this.updateSelectedAccount()
    }
  }

  computeHandleLeft = (beforeLeft: number): number => {
    if (Math.abs(beforeLeft) > CONTAINER_WIDTH) {
      return beforeLeft + (CONTAINER_WIDTH + S_MARGIN)
    }
    return 0
  }

  @action
  handleRight = () => {
    const { accounts } = this.props.account!
    if (accounts.length < S_AMOUNT) {
      return
    }

    const preSmallListleft = this.smallListLeft
    const smallListWidth = this.getSmallListWidth(accounts.length)
    const computeLeft = this.computeHandleRight(smallListWidth, this.smallListLeft)
    this.smallListLeft = computeLeft
    if (preSmallListleft !== this.smallListLeft) {
      this.updateSelectedAccount()
    }
  }

  computeHandleRight = (smallListWidth: number, beforeLeft: number): number => {
    if (smallListWidth - Math.abs(beforeLeft) >= 2 * CONTAINER_WIDTH) {
      return beforeLeft - (CONTAINER_WIDTH + S_MARGIN)
    } else {
      return CONTAINER_WIDTH - smallListWidth
    }
  }

  getSmallListWidth = (accountLength: number) => {
    return accountLength * S_WIDTH + (accountLength - 1) * S_MARGIN
  }

  /**
   * show small accounts by id
   */
  @action
  selectAccount = (index: number) => {
    const { accounts } = this.props.account!
    const computedLeft = this.computeLeftBySelectId(accounts.length, index)
    this.smallListLeft = computedLeft
  }

  computeLeftBySelectId = (accountLength: number, index: number): number => {
    const smallListWidth = this.getSmallListWidth(accountLength)
    // const index = this.props.account!.accounts.findIndex(item=>Number(item.id)===id)

    const halfAmount = Math.floor(S_AMOUNT / 2)
    const totalAmount = accountLength
    if (totalAmount < S_AMOUNT) {
      return 0
    } else {
      if (index - 1 <= halfAmount) {
        return 0
      } else if (totalAmount - index <= halfAmount) {
        return CONTAINER_WIDTH - smallListWidth
      } else {
        return -(index - 1 - halfAmount) * ITEM_WIDTH
      }
    }
  }

  render() {
    const { labels, classes } = this.props
    const { account, handleClose } = this.props
    const {
      accounts,
      activeAccount: { id }
    } = account!
    const smallListWidth = this.getSmallListWidth(accounts.length)
    const defaultName = this.accountToUpdate
      ? this.accountToUpdate.name
        ? this.accountToUpdate.name
        : `${labels.account}${this.accountToUpdate!.id}`
      : ''

    return (
      <div className={classes.changeAccount}>
        <div className={classes.shadow}>
          <div className={classes.importBtnBox}>
            <Button variant="contained" className={classNames(classes.add, 'tour-add')} onClick={this.handleAddAccount}>
              <AddIcon className={classes.btnIcon} />
              {labels.add}
            </Button>
            <Button
              variant="contained"
              className={classNames(classes.add, 'tour-add')}
              onClick={this.handleShowPrivateKey}
            >
              {labels.privateKeyImport}
            </Button>
          </div>

          <Button className={classes.close} onClick={handleClose}>
            <img src={Close} alt="close" draggable={false} />
          </Button>
          <BigAccountList
            labels={labels}
            activeId={id}
            handleChangeActiveAccount={this.handleChangeActiveAccount}
            accounts={this.bigAccounts}
            showDialogConfirm={this.showDialogConfirm}
            deleteAccount={this.deleteAccount}
          />

          <div className={classes.accountsList}>
            <Button className={classes.left} onClick={this.handleLeft}>
              <img src={Left} alt={'left'} draggable={false} />
            </Button>
            <Button className={classes.right} onClick={this.handleRight}>
              <img src={Right} alt={'right'} draggable={false} />
            </Button>

            <div className={classes.listContainer} style={{ width: `${CONTAINER_WIDTH}px` }}>
              <ul
                className={classes.list}
                style={{
                  width: `${smallListWidth}px`,
                  left: `${this.smallListLeft}px`
                }}
              >
                <SmallAccountList
                  accounts={accounts}
                  labels={labels}
                  selectedIndex={this.selectedIndex}
                  activeId={id}
                  changeAccount={this.changeAccount}
                />
              </ul>
            </div>
          </div>
        </div>
        {this.showPrivateKeyModal && (
          <PrivateConfirm
            onClose={this.handleClosePrivateKey}
            onConfirm={this.importPrivateKey}
            title={labels.title}
            label={labels.label}
            tips={this.props.labels}
          />
        )}
        {/* 修改账户名字弹窗 */}
        {this.isShowDialogConfirm && (
          <DialogConfirm
            onClose={this.hideDialogConfirm}
            onConfirm={this.handleUpdateNameConfirm}
            title={this.props.labels.accountName}
            label={this.props.labels.accountName}
            btnText={this.props.labels.confirm}
            defaultVal={defaultName}
          />
        )}
      </div>
    )
  }
}

const StyleAccounts = withStyles(styles)(Accounts)

interface AccountWrapProps extends Pick<RouteComponentProps, 'history'> {
  handleClose: () => void
}

const AccountWrap = (props: AccountWrapProps & WithTranslation) => {
  const { t, history, handleClose } = props
  return <StyleAccounts handleClose={handleClose} history={history} labels={t('account:accounts')} />
}

export default withTranslation()(AccountWrap)
