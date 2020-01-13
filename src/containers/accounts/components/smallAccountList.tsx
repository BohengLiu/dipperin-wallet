import React from 'react'
import { I18nCollectionAccount } from '@/i18n/i18n'
import { observer } from 'mobx-react'

import AccountModel from '@/models/account'
import SmallAccount from './smallAccount'

interface Props {
  accounts: AccountModel[]
  labels: I18nCollectionAccount['accounts']
  selectedIndex: number
  activeId: string
  changeAccount: (index: number) => void
}

@observer
export class SmallAccountList extends React.Component<Props> {
  changeSelectedAccount = (index: number) => () => {
    const { changeAccount } = this.props
    changeAccount(index)
  }
  render() {
    const { labels, selectedIndex, activeId, accounts } = this.props
    return (
      <React.Fragment>
        {accounts.map((account, index) => {
          return (
            <SmallAccount
              key={index}
              index={index}
              labels={labels}
              account={account}
              selectedIndex={selectedIndex}
              activeId={activeId}
              changeSelectedAccount={this.changeSelectedAccount(index)}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export default SmallAccountList
