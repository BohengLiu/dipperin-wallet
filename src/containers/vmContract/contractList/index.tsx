import { action, computed, reaction, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import swal from 'sweetalert2'

// components
import { I18nCollectionContract } from '@/i18n/i18n'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'
import ContractIcon from '@/images/contract.png'

import { StyleContractItem } from './list'
import DialogConfirm from '@/components/dialogConfirm'
// import Operate from '@/containers/vmContract/operate'
import VmContractModel from '@/models/vmContract'

import styles from './styles'

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
  isShowChangeNamePop: boolean = false
  @observable
  contractToUpdate: VmContractModel | null = null

  @computed
  get currentContract() {
    return this.props.vmContract!.path.split(':')[1]
  }
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

  redirect = () => {
    if (this.props.vmContract!.contracts.length > 0 && this.props.vmContract!.path.split(':')[1] === '') {
      const contract = this.props.vmContract!.contracts[0].contractAddress
      this.jumpToCall(contract)
    }
  }

  @action
  jumpToCall = (contractAddress: string) => {
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, contractAddress)
  }

  @action
  jumpToCreate = () => {
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, '')
  }

  @action
  jumpToDetail = (contractAddress: string) => {
    const { match, history } = this.props
    history.push(`${match.url}/receipts/${contractAddress}`)
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, contractAddress)
  }

  @computed
  get contracts() {
    const { contracts, pendingContracts } = this.props.vmContract!
    return contracts.concat(pendingContracts).sort((a, b) => a.timestamp - b.timestamp)
  }
  @action
  hideChangeNamePop = () => {
    this.isShowChangeNamePop = false
  }
  @action
  handleUpdateNameConfirm = async (value: string) => {
    const val = value.trim().replace(/\s+/g, ' ') // 去掉前后空格 把联系空格替换为一个
    const { setName } = this.contractToUpdate!
    const { updateContract } = this.props.vmContract!
    setName(val)
    await updateContract(this.contractToUpdate!)
    this.hideChangeNamePop()
    swal.fire({
      showCloseButton: false,
      icon: 'success',
      timer: 1500,
      title: this.props.labels.changeSuccess
    })
  }
  @action
  showChangeNamePop = (contract: VmContractModel): void => {
    this.contractToUpdate = contract
    this.isShowChangeNamePop = true
  }
  @action
  deleteContract = async (contract: VmContractModel) => {
    const { deleteContract } = this.props.vmContract!
    const result = await swal.fire({
      icon: 'warning',
      title: this.props.labels.deleteContractTitle,
      text: '',
      showCancelButton: true,
      confirmButtonText: this.props.labels.confirm,
      cancelButtonText: this.props.labels.cancel,
      reverseButtons: true
    })
    if (result.value) {
      await deleteContract(contract)
      swal.fire({
        icon: 'success',
        text: this.props.labels.deleteSuccess,
        timer: 1500
      })
    }
  }

  render() {
    const { vmContract, classes, labels } = this.props
    const { contracts, pendingContracts } = vmContract!
    const haveContract = (contracts && contracts.length > 0) || (pendingContracts && pendingContracts.length > 0)
    const defaultName =
      this.contractToUpdate && this.contractToUpdate!.contractName ? this.contractToUpdate!.contractName : ''
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
            {this.contracts.map((contract, index) => {
              return (
                <StyleContractItem
                  jumpToCall={this.jumpToCall}
                  jumpToDetail={this.jumpToDetail}
                  labels={labels}
                  contract={contract}
                  key={index}
                  index={index}
                  ifCurrent={this.currentContract !== '' && this.currentContract === contract.contractAddress}
                  showChangeNamePop={this.showChangeNamePop}
                  deleteContract={this.deleteContract}
                />
              )
            })}
          </div>
        )}
        {/* 修改合约名字弹窗 */}
        {this.isShowChangeNamePop && (
          <DialogConfirm
            onClose={this.hideChangeNamePop}
            onConfirm={this.handleUpdateNameConfirm}
            title={this.props.labels.changeContractName}
            label={this.props.labels.contractName}
            btnText={this.props.labels.confirm}
            defaultVal={defaultName}
          />
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
