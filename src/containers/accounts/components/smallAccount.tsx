import React from 'react'
import classNames from 'classnames'
import AccountModel from '@/models/account'
import { withStyles, WithStyles } from '@material-ui/core'
import { observer } from 'mobx-react'
import { getShowName } from '@/utils'

import { I18nCollectionAccount } from '@/i18n/i18n'
import styles from '../accountsStyle'

interface SmalllAccountPropss extends WithStyles<typeof styles> {
  account: AccountModel
  selectedIndex: number
  index: number
  activeId: string
  changeSelectedAccount: () => void
  labels: I18nCollectionAccount['accounts']
}

@observer
export class SmallAccount extends React.Component<SmalllAccountPropss> {
  formatNumber = (num: number, w: number) => {
    const m = 10 ** w
    const b = Math.floor(num * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  render() {
    const { classes, account, activeId, selectedIndex, labels, changeSelectedAccount, index } = this.props
    const defaultName = account.name ? account.name : `${labels.account} ${account.id}`
    const showName = getShowName(defaultName)
    return (
      <li
        className={classNames(classes.item, index === selectedIndex ? classes.selected : '')}
        onClick={changeSelectedAccount}
      >
        <p className={classes.smallAccountName}>{showName}</p>
        <div className={classes.smallId}>{account.id}</div>
        <p className={classes.smallBalance}> {this.formatNumber(Number(account.balance), 6)}</p>
        <p className={classes.smallDip}>DIP</p>
        <p className={classes.smallAddress}>{account.address}</p>
        {account.id === activeId && <img className={classes.smallCurrent} src={labels.currentAccount} alt="current" />}
        {index !== selectedIndex && <div className={classes.smallShadow} />}
      </li>
    )
  }
}

export default withStyles(styles)(SmallAccount)
