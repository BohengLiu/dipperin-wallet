import { observable, action, reaction, runInAction, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
// import Pagination from 'rc-pagination'
import React, { Fragment } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import {
  // NavLink,
  RouteComponentProps
  // Route,
  // Switch
} from 'react-router-dom'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// components
import { I18nCollectionContract } from '@/i18n/i18n'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

import ContractIcon from '@/images/contract.png'

import { StyleContractItem } from './list'
// import Operate from '@/containers/vmContract/operate'

import styles from './styles'

// const PER_PAGE = 10

interface WrapProps extends RouteComponentProps {
  vmContract?: VmContractStore
  wallet?: WalletStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('vmContract', 'wallet')
@observer
export class VmContractList extends React.Component<Props> {
  @observable
  currentContract: string = ''

  constructor(props) {
    super(props)
    this.redirect()
    reaction(
      () => this.props.wallet!.activeAccountId,
      () => {
        if (window.location.pathname.split('/')[2] === 'vm_contract') {
          this.redirect()
        }
      }
    )
  }

  // componentDidUpdate = (preProps, preState) => {
  //   if (this.props.match.url === this.props.location.pathname) {
  //     this.redirect()
  //   }
  // }

  redirect = () => {
    const { match } = this.props

    const { contracts } = this.props.vmContract!
    const haveContract = contracts && contracts.length > 0
    if (haveContract) {
      const firstContract = contracts[0].contractAddress
      this.props.history.push(`${match.url}/call/${firstContract}`)
      runInAction(() => {
        this.currentContract = firstContract
      })
    } else {
      this.props.history.push(`${match.url}/create`)
    }
  }

  @action
  jumpToCall = (contractAddress: string) => {
    const { match, history } = this.props
    this.currentContract = contractAddress
    history.push(`${match.url}/call/${contractAddress}`)
  }

  @action
  jumpToCreate = () => {
    const { match, history } = this.props
    history.push(`${match.url}/create`)
    this.currentContract = ''
  }

  @action
  jumpToDetail = (contractAddress: string) => {
    const { match, history } = this.props
    history.push(`${match.url}/receipts/${contractAddress}`)
    this.currentContract = ''
  }

  @computed
  get contracts() {
    const { contracts, pendingContracts } = this.props.vmContract!
    return contracts.concat(pendingContracts).sort((a, b) => a.timestamp - b.timestamp)
  }

  render() {
    const { vmContract, classes, labels } = this.props
    const { contracts, pendingContracts } = vmContract!
    const haveContract = (contracts && contracts.length > 0) || (pendingContracts && pendingContracts.length > 0)

    return (
      <Fragment>
        <div className={classes.title}>
          <span>{labels.contract}</span>
          {haveContract && <div className={classes.addCircle} onClick={this.jumpToCreate} />}
        </div>
        {!haveContract && (
          <div className={classes.noContract}>
            <img src={ContractIcon} alt="" />
            <span>{labels.nocontract}</span>
          </div>
        )}
        {haveContract && (
          <div className={classes.contractsList}>
            {/* {pendingContracts.map((contract, index) => {
              return (
                <StyleContractItem
                  labels={labels}
                  contract={contract}
                  key={index}
                  ifCurrent={false}
                />
              )
            })} */}
            {this.contracts.map((contract, index) => {
              return (
                <StyleContractItem
                  jumpToCall={this.jumpToCall}
                  jumpToDetail={this.jumpToDetail}
                  labels={labels}
                  contract={contract}
                  key={index}
                  ifCurrent={this.currentContract !== '' && this.currentContract === contract.contractAddress}
                />
              )
            })}
          </div>
        )}
      </Fragment>
    )
  }
}

export const StyleCreatedContract = withStyles(styles)(VmContractList)

const CreatedContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreatedContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreatedContractWrap)
