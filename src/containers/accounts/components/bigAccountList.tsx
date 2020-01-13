import React from 'react'
import { I18nCollectionAccount } from '@/i18n/i18n'
import { WithStyles, withStyles } from '@material-ui/core'
import { observer } from 'mobx-react'

import AccountModel from '@/models/account'
import BigAccount from './bigAccount'

import styles from '../accountsStyle'

interface Props extends WithStyles {
  accounts: AccountModel[]
  labels: I18nCollectionAccount['accounts']
  activeId: string
  handleChangeActiveAccount: (id: string) => void
  showDialogConfirm: (account: AccountModel) => void
  deleteAccount: (id: string) => void
}

@observer
export class BigAccountList extends React.Component<Props> {
  render() {
    const {
      classes,
      labels,
      handleChangeActiveAccount,
      activeId,
      accounts,
      showDialogConfirm,
      deleteAccount
    } = this.props
    console.log('listacounts', accounts)
    return (
      <div className={classes.bigList}>
        {accounts.map((account, index) => {
          return (
            <BigAccount
              key={index}
              labels={labels}
              account={account}
              activeId={activeId}
              handleChangeActiveAccount={handleChangeActiveAccount}
              showDialogConfirm={showDialogConfirm}
              deleteAccount={deleteAccount}
            />
          )
        })}
      </div>
    )
  }
}

export default withStyles(styles)(BigAccountList)
