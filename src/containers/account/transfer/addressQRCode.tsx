import { reaction } from 'mobx'
import QRCode from 'qrcode'
import React from 'react'

import Copy from '@/images/copy.png'
import AccountStore from '@/stores/account'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import swal from 'sweetalert2'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  address: string
  account: AccountStore
  isChinese: boolean
}

export class AddressQRCode extends React.Component<Props> {
  componentDidMount() {
    this.showQrcode(this.props.account!.activeAccount.address)
    reaction(
      () => this.props.account!.activeAccount,
      () => {
        this.showQrcode(this.props.account!.activeAccount.address)
      }
    )
  }

  showQrcode = address => {
    const canvas = document.getElementById('qrcode')
    if (!canvas) {
      return
    }
    QRCode.toCanvas(canvas, address, {
      color: {
        light: '#f2f5f6'
      },
      width: '190'
    })
  }

  copyAddress = () => {
    const address = this.props.address
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        icon: 'success',
        timer: 1500,
        title: this.props.isChinese ? '复制成功！' : 'Replicating Success!'
      })
    }
    document.body.removeChild(input)
  }

  render() {
    const { classes, address } = this.props
    return (
      <div data-tour="qrcode">
        <div className={classes.qrcode}>
          <canvas id="qrcode" />
        </div>
        <p className={classes.address}>{address}</p>
        <Button className={classes.copy} onClick={this.copyAddress}>
          <img src={Copy} alt="" title="copy" />
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(AddressQRCode)
