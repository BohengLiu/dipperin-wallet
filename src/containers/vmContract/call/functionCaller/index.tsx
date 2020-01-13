import React from 'react'
import { observable, action, runInAction } from 'mobx'
// import classNames from 'classnames'
import { VmcontractAbi } from '@/models/vmContract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Button } from '@material-ui/core'

import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

// import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'

interface Props extends WithStyles {
  func: VmcontractAbi
  labels: I18nCollectionContract['contract']
  onCall: (funcName: string, params: string, constant?: boolean) => any
}

interface InputValue {
  [inputName: string]: string
}
// interface CallRes {
//   success: boolean
//   info?: string
// }

@observer
export class FunctionCaller extends React.Component<Props> {
  @observable
  inputValue: InputValue = {}
  @observable
  params: string = ''
  @observable
  ifshowDetailInput: boolean = false
  @observable
  result: string

  @action
  paramsChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.params = e.target.value
  }

  @action
  toggleShowDetailInput = () => {
    this.ifshowDetailInput = !this.ifshowDetailInput
  }

  InputValueChange = (name: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const value = e.target.value
    runInAction(() => {
      this.inputValue[name] = value
    })
  }

  paramsCall = async () => {
    const funcName = this.props.func.name
    const constant = this.props.func.constant === 'true'
    const res = await this.props.onCall(funcName, this.params, constant)
    if (res && res.success && res.info) {
      runInAction(() => {
        this.result = String(res.info)
      })
    }
  }

  @action
  detailCall = async () => {
    const funcName = this.props.func.name
    const constant = this.props.func.constant === 'true'
    const params = Object.values(this.inputValue).join(',')
    this.params = params
    this.ifshowDetailInput = false

    const res = await this.props.onCall(funcName, params, constant)
    if (res && res.success && res.info) {
      runInAction(() => {
        this.result = String(res.info)
      })
    }
  }

  render() {
    const { labels, func, classes } = this.props
    if (func.type !== 'function') {
      return null
    }
    const placeholder = this.props.func.inputs.map(item => `${item.type} ${item.name}`).join(',')
    const color = `#${func.constant === 'true' ? '207FDE' : 'F48E0B'}`
    return (
      <div className={classes.callerBox} style={{ borderLeft: `4px solid ${color}` }}>
        <div className={classes.topbar}>
          <button disabled={this.ifshowDetailInput} className={classes.topBtn} onClick={this.paramsCall}>
            {func.name}
          </button>
          <input
            className={classes.topInput}
            disabled={this.ifshowDetailInput}
            value={this.params}
            placeholder={placeholder}
            onChange={this.paramsChange}
          />
          <span className={classes.arrow} onClick={this.toggleShowDetailInput}>
            {this.ifshowDetailInput ? '▲' : '▼'}
          </span>
        </div>
        {this.ifshowDetailInput && (
          <div className={classes.inputList}>
            {func.inputs.map(input => (
              <div key={input.name} className={classes.inputItem}>
                <span className={classes.inputName}>{input.name}:</span>
                <input
                  className={classes.inputText}
                  placeholder={input.type}
                  value={this.inputValue[input.name]}
                  onChange={this.InputValueChange(input.name)}
                />
              </div>
            ))}

            <Button
              disabled={false}
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.detailCall}
            >
              {labels.confirm}
            </Button>
          </div>
        )}
        {this.result && (
          <div className={classes.inputList}>
            <div className={classes.resultItem}>
              <span style={{ fontWeight: 'bold' }}>Result:</span>
              <span style={{ fontWeight: 'bold' }}>{this.result}</span>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(FunctionCaller)
