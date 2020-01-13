import CurrentAccountCN from '@/images/selected-cn.png'
import CurrentAccountUS from '@/images/selected.png'

export const zhCN = {
  wallet: {
    accountTour: {
      switchAddress: '点击这里可以切换地址',
      addAccount: '点击这里添加账户',
      selectAccount: '点击选中账户',
      sendTransfer: '这里可以发送交易',
      qrcode: '这里可以查看收款二维码'
    },
    login: {
      title: '解锁钱包',
      password: '密码',
      unlock: '解锁',
      lockText: '密码错误次数过多，请耐性等待...',
      resetText: '如果您忘记了密码，可以通过助记词来重置和恢复钱包',
      resetWallet: '重置钱包',
      swal: {
        documentTitle: 'Dipperin 钱包',
        emptyPassword: '请填写密码！',
        incorrectPassword: '密码错误',
        success: '解锁成功!',
        confirm: '确认',
        cancel: '取消',
        resetConfirm: '确定',
        warnText: '重置钱包，钱包所有记录将被删除。',
        warn: '警告',
        backupMnemonic:
          '助记词是您钱包资产的重要凭证，任何人得到您的助记词都可以使用您的资产，请您采用多种方式保管好助记词，避免泄露。助记词顺序有唯一性，请务必不要打乱助记词的顺序。'
      }
    },
    import: {
      title: '导入钱包',
      mnemonic: '助记词',
      setPassword: '设置密码',
      repeatPassword: '确认密码',
      recovery: '恢复钱包',
      create: '创建新钱包',
      howToCreate: '怎样创建新钱包',
      langAb: 'CN',
      lang: '中文',
      swal: {
        success: '导入成功!',
        mnemonicLength: '请提供至少12位助记词',
        invalidMnemonic: '助记词不合法',
        emptyMnemonic: '助记词不能为空',
        passwordLength: '密码长度为8~24个字符',
        invalidPassword: '无效密码',
        diffPassword: '两次密码不一致',
        confirm: '确认',
        emptyPassword: '密码不能为空'
      },
      tour: {
        create: '如果您还没有钱包，点击这里去创建钱包！',
        import: '如果您已有钱包，在这里输入助记词并设置您的密码来恢复钱包！'
      },
      weak: '弱',
      medium: '中',
      strong: '强',
      note:
        '当您导入钱包时，仅显示您钱包账户前15个有资产的账户，从16个账户开始，需要您点击“添加账户”自行创建出来，里面的资产不会消失。',
      select: {
        selectNet: '选择网络节点',
        remoteVenus: '远程节点-金星',
        remoteTest: '远程节点-测试网',
        localVenus: '本地节点-金星',
        localTest: '本地节点-测试网',
        localLocal: '本地节点-本地',
        storage: '数据存储:'
      }
    },
    sidebar: {
      wallet: '钱包',
      contract: '智能合约',
      vmContract: '智能合约',
      mine: '挖矿',
      setting: '设置',
      title: 'Dipperin 钱包',
      walletVersion: '钱包版本',
      dipperinVersion: 'Dipperin版本',
      height: '块高',
      timestamp: '时间戳'
    },
    setting: {
      left: {
        title: '设置',
        info: '设置您的钱包账户信息',
        dataDir: '数据储存路径',
        moving: '数据迁移中'
      },
      net: {
        title: '选择本地节点',
        remoteTitle: '选择远程节点',
        test: '测试网',
        local: '本地',
        mercury: '水星',
        venus: '金星',
        remoteTest: '测试网',
        remoteMecury: '水星',
        remoteVenus: '金星',
        closeRemote: '断开远程节点',
        connectRemote: '连接远程节点',
        localHint: '连接本地节点需要同步区块，需要等待同步至最新高度才能发送交易',
        remoteHint: '远程连接需信任节点，无需同步区块'
      },
      about: {
        title: '关于钱包',
        label: {
          developer: '开发商',
          version: '钱包版本',
          copyright: '版权所属',
          function: '版本功能'
        },
        value: {
          developer: '开发商',
          version: '版本',
          copyright: '版权所属',
          function: '版本功能'
        }
      },
      btn: {
        help: '帮助',
        guide: '界面指引',
        update: '更新节点',
        reset: '重置钱包'
      },
      connectFail: '未连接到节点',
      loading: '更新中',
      walletManagement: '钱包管理',
      exportPrivateKey: '导出秘钥',
      privateKey: {
        title: '私钥显示',
        label: '这是你的私钥（点击复制）',
        notes: '注意：请保管好这个私钥。任何人拥有了你的私钥都可以窃取你帐户中的所有资产。',
        confirm: '确认'
      },
      swal: {
        updateSuccess: '更新成功!',
        cancel: '取消',
        confirm: '确定',
        warnText: '重置钱包，钱包所有记录将被删除。',
        warn: '警告',
        startUpdate: '开始更新?',
        documentTitle: 'Dipperin 钱包',
        copySuccess: '复制成功',
        incorrectPassword: '密码错误'
      },
      dataDirPop: {
        title: '确认存储路径',
        info: '您的主链数据存储路径将变更，有以下两种数据存储路径变更方式，请选择：',
        option1: '只变更数据存储路径，不迁移数据，需要重新同步区块高度；',
        option2: '变更数据存储路径的同时迁移数据，数据迁移的过程中，请勿关闭电脑、钱包软件，避免数据丢失影响钱包使用。',
        cancel: 'Cancel',
        confirm: 'Confirm'
      }
    }
  },
  create: {
    create: {
      return: '返回',
      title: '设置钱包登录密码',
      setPassword: '设置密码',
      repeatPassword: '确认密码',
      confirm: '确定',
      swal: {
        passwordLength: '密码长度为8~24个字符',
        invalidPassword: '无效密码',
        diffPassword: '两次密码不一致！',
        confirm: '确定',
        emptyPassword: '密码不能为空'
      },
      weak: '弱',
      medium: '中',
      strong: '强'
    },
    backup: {
      return: '返回',
      title: '备份助记词',
      hint:
        '助记词是您钱包资产的重要凭证，任何人得到您的助记词都可以使用您的资产，请您采用多种方式保管好助记词，避免泄露。助记词顺序有唯一性，请务必不要打乱助记词的顺序。',
      bottomHint: '请记下您的助记词。千万不要截屏！',
      confirm: '确定'
    },
    backupConfirm: {
      return: '返回',
      title: '确认助记词',
      hint: '请按顺序依次选择助记词，确保助记词与您保存的一致。',
      confirm: '确定',
      dialogText: '您的助记词将从本机删除！',
      cancel: '取消',
      dialogConfirm: '确认',
      swal: {
        wordsWrong: '选择单词错误！',
        success: '创建成功！',
        confirm: '确认'
      }
    },
    progressBar: {
      create: '创建钱包密码',
      backup: '备份助记词',
      confirm: '确认助记词'
    }
  },
  transaction: {
    send: {
      to: '接收地址',
      amount: '金额',
      note: '备注',
      fee: '交易费',
      moreThan: '不少于',
      transfer: '转账',
      walletPassword: '钱包密码',
      password: '密码',
      cancel: '取消',
      dialogSend: '发送',
      gasPrice: 'gas费用',
      estimateGas: '预估Gas',
      swal: {
        invalidAddress: '地址格式不正确',
        insufficientFunds: '账户余额不足',
        invalidAmount: '无效数量',
        invalidFee: '无效交易费',
        timeout: '远程节点响应时间过长',
        success: '发送成功!',
        fail: '发送失败!',
        incorrectPassword: '密码错误!',
        confirm: '确认',
        alreadyInTxPool: '此交易已经进入交易池，请等待！',
        invalidNonce: '请等待账号nonce值同步后发送交易!',
        tooLowfee: '请等待上笔交易上链后发送!',
        tooMuchExtraData: '备注内容过多，请优化备注内容!',
        networkError: '当前网络不可用，请检查网络'
      }
    },
    txList: {
      time: '时间',
      from: '发送地址',
      to: '接收地址',
      amount: '交易额',
      state: '状态',
      operation: '操作',
      detail: '详情',
      noRecords: '暂无记录',
      title: '交易记录',
      pending: '打包中',
      success: '成功',
      fail: '失败'
    },
    txDetail: {
      value: '交易额',
      height: '块高度',
      timeStamps: '时间',
      transactions: '交易数',
      hash: '块哈希',
      parentHash: '父块哈希',
      miner: '矿工',
      diffculty: '难度值',
      size: '大小',
      nonce: 'Nonce',
      reward: '出块奖励',
      extraData: '备注',
      from: '发送地址',
      to: '接收地址',
      preTitle: '交易记录',
      title: '详情'
    }
  },

  account: {
    accounts: {
      add: '添加账户',
      modifyName: '修改账户名',
      account: '账户',
      accountName: '账户名',
      copySuccess: '复制成功!',
      currentAccount: CurrentAccountCN,
      privateKeyImport: '私钥导入',
      label: '请输入您的秘钥',
      title: '秘钥导入',
      confirm: '确认',
      cancel: '取消',
      importSuccessTitle: '导入成功',
      importErrorTitle: '导入失败',
      importError: '请输入正确私钥!',
      addressReimportError: '导入账户已存在!',
      changeSuccess: '修改成功',
      deleteAccount: '删除账户',
      deleteAccountTitle: '确认删除账户',
      deleteAccountWarning: '当前账户不可删除',
      deleteAccountText: '删除后将无法找回，请确保当前账户内的资产已全部转移。',
      deleteSuccess: '账户已删除'
    },
    account: {
      transfer: '转账',
      send: '发送',
      receive: '接收'
    },
    accountInfo: {
      account: '账户',
      title: 'Dipperin 钱包',
      walletVersion: '钱包版本',
      dipperinVersion: 'Dipperin版本',
      height: '块高',
      timestamp: '时间戳',
      lock: '锁定钱包',
      langAb: 'CN',
      lang: '中文',
      start: '启动节点',
      stop: '关闭节点'
    }
  },

  contract: {
    contract: {
      selectFile: '请选择一个文件',
      errorAbiFile: 'ABI文件格式错误',
      errorWasmFile: '代码文件格式错误',
      add: '添加',
      call: '调用',
      favoriteContract: '收藏合约',
      contractType: '合约类型',
      changeContractName: '修改合约名',
      contractName: '合约名',
      changeSuccess: '修改成功',
      contract: '合约',
      copySuccess: '复制成功',
      contractCall: '合约调用',
      confirm: '确认',
      nocontract: '暂无合约',
      create: '创建',
      created: '创建',
      favorite: '收藏',
      status: '状态',
      address: '地址',
      name: '合约名',
      functionName: '调用方法名',
      code: '代码',
      abi: 'ABI',
      gas: 'Gas消耗上限',
      gasPrice: 'Gas单价',
      estimateGas: '预计Gas消耗',
      detail: '详情',
      initParams: '初始化参数',
      type: '合约类型',
      amount: '总量',
      value: '金额',
      balance: '余额',
      decimals: '精度',
      symbol: '标志',
      fee: '手续费',
      txHash: '交易哈希',
      method: '事件',
      data: '数据',
      moreThan: '不少于',
      createTitle: '创建新通证',
      createVmTitle: '创建新合约',
      return: '返回',
      pending: '打包中',
      success: '成功',
      fail: '失败',
      deleteContractTitle: '确认删除合约',
      deleteContract: '删除合约',
      ViewHistory: '查看记录',
      deleteSuccess: '删除成功',
      cancel: '取消',
      token: '余额',
      addDialog: {
        title: '添加合约',
        label: '合约地址',
        btnText: '添加',
        addSuccess: '添加成功',
        addFailed: '找不到该合约',
        swalConfirm: '确定'
      },
      callDialog: {
        title: '调用合约方法',
        name: '方法名',
        params: '参数',
        callSuccess: '调用成功',
        callFail: '调用失败',
        incorrectPassword: '密码错误'
      },
      createSwal: {
        createSuccess: '创建合约成功',
        createErr: '创建合约出错',
        incorrectPassword: '密码错误',
        decimalLength: '精度不能超过18',
        paramsLengthErr: '输入参数数量错误',
        contractAddressErr: '合约地址错误',
        noAbi: '未导入合约ABI文件',
        noWASM: '未导入合约WASM文件',
        noGas: '未输入Gas上限',
        noGasPrice: '未输入Gas单价',
        getAbi: '获取ABI失败',
        feeMax: '手续费不足'
        // networkError: '当前网络不可用，请检查网络！',
        // noEnoughBalance: '账户余额不足'
      },
      labs: {
        transfer: '合约转账',
        approve: '合约授权',
        transferFrom: '任意转账'
      },
      swal: {
        somethingWrong: '系统错误!',
        alreadyInTxPool: '此交易已经进入交易池，请等待！',
        invalidNonce: '请等待账号nonce值同步后发送交易!',
        tooLowfee: '请等待上笔交易上链后发送!',
        tooMuchExtraData: '备注内容过多，请优化备注内容!',
        networkError: '当前网络不可用，请检查网络',
        insufficientFunds: '账户余额不足',
        noEnoughBalance: '账户余额不足'
      }
    },

    transfer: {
      lab: '合约转账',
      title: '合约转账',
      name: 'Token名',
      balance: '余额',
      toAddress: '接收地址',
      amount: '发送金额',
      transfer: '发送',
      swal: {
        transferSuccess: 'Token发送成功!',
        transferFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '账户余额不足!',
        invalidAddress: '地址格式不正确!',
        confirm: '确定',
        extraDataTooLong: '备注内容过多，请优化备注内容',
        networkError: '当前网络不可用，请检查网络'
      }
    },
    approve: {
      lab: '合约授权',
      title: '合约授权',
      name: 'Token名',
      balance: '余额',
      toAddress: '接收地址',
      amount: '授权金额',
      approve: '授权',
      swal: {
        approveSuccess: 'Token发送成功!',
        approveFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '余额不足!',
        invalidAddress: '地址格式不正确!',
        confirm: '确认'
      }
    },
    transferFrom: {
      lab: '任意转账',
      title: '任意转账',
      name: 'Token名',
      allowance: '授权余额',
      toAddress: '接收地址',
      amount: '转账金额',
      transfer: '转账',
      add: '添加授权地址',
      none: '暂无授权地址',
      ownerAddress: '授权地址',
      swal: {
        transferSuccess: 'Token发送成功!',
        transferFail: 'Token发送失败!',
        tryAgain: '请重新提交!',
        incorrectPassword: '密码错误!',
        somethingWrong: '系统错误!',
        insufficientFunds: '余额不足!',
        invalidAddress: '地址格式不正确!',
        addressAleadyExist: '账户已经存在',
        addSuccess: '添加成功',
        confirm: '确定'
      },
      addDialog: {
        title: '添加授权地址',
        label: '授权地址',
        btnText: '添加'
      }
    },
    transferTx: {
      title: '发送历史',
      type: '类型',
      time: '时间',
      from: '发送地址',
      to: '接收地址',
      amount: '金额',
      status: '状态',
      noRecords: '暂无记录',
      pending: '打包中',
      success: '成功',
      fail: '失败'
    },
    menu: {
      transfer: '发送',
      history: '发送历史'
    }
  },
  dialog: {
    passwordDialog: {
      walletPassword: '钱包密码',
      password: '密码',
      cancel: '取消',
      confirm: '确认'
    }
  },
  mine: {
    main: {
      easyMine: '一键挖矿',
      loading: '启动中',
      stopMining: '停止挖矿',
      mineReward: '挖矿奖励',
      withdrawBalance: '提取余额',
      startFailure: '启动失败',
      remoteNodeError: '请开启本地节点后启动.',
      unstartNodeError: '请启动节点后开启挖矿',
      waitService: '请等待节点开启服务'
    },
    tips: {
      title: '注意事项',
      tipContent: '当启动钱包挖矿功能时，钱包网络节点会切换至本地节点，等待本地节点同步至最新区块高度后即开始挖矿。',
      done: '确认'
    },
    withdraw: {
      withdraw: '提现',
      receipt: '收款地址',
      withdrawAmount: '提款金额',
      availableAmount: '可提现金额：',
      cancel: '取消',
      confirm: '提款',
      success: '提现成功',
      inPoolError: '交易已经发出，请等待',
      invalidAddress: '地址格式不正确!',
      noEnoughBalance: '矿工账户余额不足！',
      newFeeTooLow: '请等待上一笔交易完成！',
      noBalance: '无可提现金额',
      alreadyInTxPool: '此交易已经进入交易池，请等待！',
      invalidNonce: '请等待账号nonce值同步后发送交易!',
      tooLowfee: '请等待上笔交易上链后发送!'
    }
  }
}

export type I18nCollection = typeof zhCN

export type I18nCollectionTransaction = typeof zhCN.transaction

export type I18nCollectionAccount = typeof zhCN.account

export type I18nCollectionContract = typeof zhCN.contract

export type I18nCollectionDialog = typeof zhCN.dialog

export type I18nCollectionWallet = typeof zhCN.wallet

export type I18nCollectionCreate = typeof zhCN.create

export type I18nCollectionMine = typeof zhCN.mine

export const enUS: I18nCollection = {
  wallet: {
    accountTour: {
      switchAddress: 'Click here to switch addresses',
      addAccount: 'Click here to add account',
      selectAccount: 'Click here to select account',
      sendTransfer: 'You can send transactions here',
      qrcode: 'Here you can view the two-dimensional code of receipt'
    },
    login: {
      title: 'Unlock Wallet',
      password: 'Password',
      unlock: 'Unlock',
      lockText: 'Too many password attempts. Please wait patiently...',
      resetText: 'In case you forget password, you may restore the wallet using the mnemonic code',
      resetWallet: 'Reset Wallet',
      swal: {
        documentTitle: 'Dipperin Wallet',
        emptyPassword: 'Password is required!',
        incorrectPassword: 'Incorrect password',
        success: 'Success!',
        confirm: 'Ok',
        cancel: 'Cancel',
        resetConfirm: 'Confirm',
        warnText: 'Reseting wallet will DELETE your entire wallet account, transaction records and profile.',
        warn: 'Warning',
        backupMnemonic:
          'Mnemonic phrase are the voucher to recover your wallet assets. Obtaining Mnemonic equals owning all assets. Please do backup and preserve it properly! Please be sure not to disturb the order of the mnemonic phrase.'
      }
    },
    import: {
      title: 'Import Wallet',
      mnemonic: 'Mnemonic Phrase',
      setPassword: 'Set Password',
      repeatPassword: 'Repeat Password',
      recovery: 'Recovery wallet',
      create: 'Create New Wallet',
      howToCreate: 'How to create new wallet',
      langAb: 'US',
      lang: 'English',
      swal: {
        success: 'Success!',
        mnemonicLength: 'You should provide 12 words of mnemonics.',
        invalidMnemonic: 'Invalid mnemonics',
        emptyMnemonic: 'Please enter your mnemonics.',
        passwordLength: 'Password must be 8~24 characters in length.',
        invalidPassword: 'Invalid password',
        diffPassword: `Passwords don't match.`,
        confirm: 'Ok',
        emptyPassword: 'The passwork should not be empty.'
      },
      tour: {
        create: `If you don't already have a wallet, click here to create one!`,
        import: 'If you already have a wallet, enter a mnemonic here and set your password to restore the wallet!'
      },
      weak: 'week',
      medium: 'medium',
      strong: 'strong',
      note:
        'When you import a wallet, the first 15 non-empty account will be imported. From the 16th account on, you may need to import  manually by "Add Account".',
      select: {
        selectNet: 'Select node net',
        remoteVenus: 'Remote-Venus',
        remoteTest: 'Remote-Mercury',
        localVenus: 'Local-Venus',
        localTest: 'Local-Test',
        localLocal: 'Local-Local',
        storage: 'Data Dictionary:'
      }
    },
    sidebar: {
      wallet: 'Wallet',
      contract: 'Contract',
      vmContract: 'Contract',
      mine: 'Mining',
      setting: 'Setting',
      title: 'Dipperin Wallet',
      walletVersion: 'Wallet Version',
      dipperinVersion: 'Dipperin Version',
      height: 'Height',
      timestamp: 'Timestamp'
    },
    setting: {
      left: {
        title: 'Setting',
        info: 'Set up your wallet infomation',
        dataDir: 'Chain Data Dictionary',
        moving: 'Data moving'
      },
      net: {
        title: 'Select Local Node',
        remoteTitle: 'Select Remote Node',
        test: 'test',
        local: 'local',
        mercury: 'mecury',
        venus: 'venus',
        remoteVenus: 'venus',
        remoteTest: 'test',
        remoteMecury: 'mecury',
        closeRemote: 'disconnect remote node',
        connectRemote: 'connect remote node',
        localHint:
          'Running a client connecting to a local node, need to download the blockchain to your local machine. To send a transaction, please weit until the node is fully synced',
        remoteHint:
          "Running a client connecting to a remote node, don't need to download the blockchain to your local machine, but need to trust the remote node."
      },
      about: {
        title: 'About Wallet',
        label: {
          developer: 'Developer',
          version: 'Version',
          copyright: 'Copyright',
          function: 'Features'
        },
        value: {
          developer: 'Developer',
          version: 'version',
          copyright: 'Copyright',
          function: 'Features'
        }
      },
      btn: {
        help: 'help',
        guide: 'guide',
        update: 'update node',
        reset: 'reset wallet'
      },
      connectFail: `can't connect to dipperin node`,
      loading: 'Loading',
      walletManagement: 'Wallet Management',
      exportPrivateKey: 'Private Key Export',
      privateKey: {
        title: 'Show Private Keys',
        label: "It's your private key(click to copy)",
        notes:
          'Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.',
        confirm: 'Done'
      },
      swal: {
        updateSuccess: 'update success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        warnText: 'Reseting wallet will DELETE your entire wallet account, transaction records and profile.',
        warn: 'Warning',
        startUpdate: 'Start update',
        documentTitle: 'Dipperin Wallet',
        copySuccess: 'Copy Success',
        incorrectPassword: 'Incorrect password'
      },
      dataDirPop: {
        // TODO
        title: '确认存储路径',
        info: '您的主链数据存储路径将变更，有以下两种数据存储路径变更方式，请选择：',
        option1: '只变更数据存储路径，不迁移数据，需要重新同步区块高度；',
        option2: '变更数据存储路径的同时迁移数据，数据迁移的过程中，请勿关闭电脑、钱包软件，避免数据丢失影响钱包使用。',
        cancel: 'Cancel',
        confirm: 'Confirm'
      }
    }
  },

  create: {
    create: {
      return: 'Return',
      title: 'Set your wallet login password',
      setPassword: 'Set Password',
      repeatPassword: 'Repeat Password',
      confirm: 'confirm',
      swal: {
        passwordLength: 'Please fill in a password greater than or equal to 8 digits in length!',
        invalidPassword: 'Invalid password',
        diffPassword: 'The first password is not equal to the second password!',
        confirm: 'OK',
        emptyPassword: 'The passwork should not be empty.'
      },
      weak: 'week',
      medium: 'medium',
      strong: 'strong'
    },
    backup: {
      return: 'Return',
      title: 'Backup mnemonic',
      hint:
        'Mnemonic phrase are the voucher to recover your wallet assets. Obtaining Mnemonic equals owning all assets. Please do backup and preserve it properly! Please be sure not to disturb the order of the mnemonic phrase.',
      bottomHint: 'Remember your mnemonic. DO NOT SCREENSHOT!',
      confirm: 'Confirm'
    },
    backupConfirm: {
      return: 'Return',
      title: 'Confirm mnemonic',
      hint: 'Please select Mnemonic Phrase in correct order.',
      confirm: 'Confirm',
      dialogText: 'Your mnemonic words will be removed from this device!',
      cancel: 'Cancel',
      dialogConfirm: 'Confirm',
      swal: {
        wordsWrong: 'Selected words is wrong!',
        success: 'Success!',
        confirm: 'Ok'
      }
    },
    progressBar: {
      create: 'Create wallet password',
      backup: 'Backup mnemonic',
      confirm: 'Confirm mnemonic'
    }
  },
  transaction: {
    send: {
      to: 'Receiver’s Address',
      amount: 'Amount',
      note: 'Note',
      fee: 'Poundage',
      moreThan: 'more than',
      transfer: 'Transfer',
      walletPassword: 'Wallet password',
      password: 'Password',
      cancel: 'Cancel',
      dialogSend: 'Send',
      gasPrice: 'Gas Price',
      estimateGas: 'Estimate Gas',
      swal: {
        invalidAddress: 'Recipient address is invalid',
        insufficientFunds: ' Insufficient balance',
        invalidAmount: 'Invalid amount',
        invalidFee: 'Invalid poundage',
        timeout: 'Remote node react too late',
        success: 'Send transaction successful!',
        fail: 'Send transaction fail!',
        incorrectPassword: 'Incorrect password!',
        confirm: 'Ok',
        alreadyInTxPool: 'This transaction has already come into transaction pool, please wait for a moment!',
        invalidNonce: 'Please wait for the account synchronize the nonce number!',
        tooLowfee: 'Please wait until the last transaction finishes!',
        tooMuchExtraData: 'The entered text is too long, please optimize your content.',
        networkError: 'The network connection is abnormal, please check your network！'
      }
    },
    txList: {
      time: 'Time',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      state: 'State',
      operation: 'Operation',
      detail: 'detail',
      noRecords: 'no records',
      title: 'Transaction records',
      pending: 'pending',
      success: 'success',
      fail: 'fail'
    },
    txDetail: {
      value: 'Value',
      height: 'Height',
      timeStamps: 'TimeStamps',
      transactions: 'Transactions',
      hash: 'Hash',
      parentHash: 'Parent Hash',
      miner: 'Miner',
      diffculty: 'Diffculty',
      size: 'Size',
      nonce: 'Nonce',
      reward: 'Block Reward',
      extraData: 'Extra Data',
      from: 'From',
      to: 'To',
      preTitle: 'Transaction records',
      title: 'Detail'
    }
  },

  account: {
    accounts: {
      add: 'Add account',
      account: 'Account',
      modifyName: 'Modify Name',
      accountName: 'Account Name',
      copySuccess: 'Replicating Success!',
      currentAccount: CurrentAccountUS,
      privateKeyImport: 'Private Key Import',
      label: 'Paste your private key string here',
      title: 'Enter Private Key',
      confirm: 'Confirm',
      cancel: 'Cancel',
      importSuccessTitle: 'Import Success',
      importErrorTitle: 'Import Failure',
      importError: 'Please enter correct private key!',
      addressReimportError: 'The account has already existed.',
      changeSuccess: 'Update Success',
      deleteAccount: 'Delete Account',
      deleteAccountTitle: 'Confirm delete account',
      deleteAccountWarning: `you can't delete current account`,
      deleteAccountText: 'Please ensure that all assets in the current account have been transferred.',
      deleteSuccess: 'Account deleted'
    },
    account: {
      transfer: 'Transfer',
      send: 'Send',
      receive: 'Receive'
    },
    accountInfo: {
      account: 'Account',
      title: 'Dipperin Wallet',
      walletVersion: 'Wallet Version',
      dipperinVersion: 'Dipperin Version',
      height: 'Height',
      timestamp: 'Timestamp',
      lock: 'Lock wallet',
      langAb: 'US',
      lang: 'English',
      start: 'Start node',
      stop: 'Stop node'
    }
  },

  contract: {
    contract: {
      selectFile: 'Please select a file',
      errorAbiFile: 'Incorrect ABI file format',
      errorWasmFile: 'Incorrect wasm file format',
      add: 'Add',
      call: 'Call',
      favoriteContract: 'favorite contract',
      contractType: 'Contract Type',
      changeContractName: 'Update Contract Name',
      contractName: 'Name',
      changeSuccess: 'Update Success',
      contract: 'Contract',
      copySuccess: 'Copy Success',
      contractCall: 'Contract Call',
      confirm: 'Confirm',
      nocontract: 'No contract',
      create: 'Create',
      created: 'Created',
      favorite: 'Favorite',
      status: 'Status',
      address: 'Address',
      name: 'Name',
      functionName: 'Function Name',
      type: 'Type',
      code: 'Code',
      abi: 'ABI',
      gas: 'Gas Limit',
      gasPrice: 'Gas Price',
      estimateGas: 'Estimate Gas',
      initParams: 'Init Params',
      detail: 'Detail',
      amount: 'Amount',
      value: 'value',
      balance: 'Balance',
      decimals: 'Decimals',
      symbol: 'Symbol',
      fee: 'Poundage',
      txHash: 'Tx Hahs',
      method: 'Event',
      data: 'Data',
      moreThan: 'more than',
      createTitle: 'Create New Token',
      createVmTitle: 'Create New Contract',
      return: 'Return',
      pending: 'pending',
      success: 'success',
      fail: 'fail',
      deleteContractTitle: 'Confirm Delete Contract',
      deleteSuccess: 'Delete Success',
      deleteContract: 'Delete Contract',
      ViewHistory: 'View History',
      cancel: 'Cancel',
      token: 'Token',
      addDialog: {
        title: 'Add Smart Contract',
        label: 'Smart Contract Address',
        btnText: 'Add',
        addSuccess: 'Add contract success',
        addFailed: `Can't find this contract`,
        swalConfirm: 'OK'
      },
      callDialog: {
        title: 'Call Contract Method',
        name: 'Method Name',
        params: 'Params',
        callSuccess: 'Call Success',
        callFail: 'Call Failed',
        incorrectPassword: 'Incorrect password'
      },
      createSwal: {
        createSuccess: 'Create contract success',
        createErr: 'Create contract error',
        noAbi: 'Please import the ABI file of your contract',
        noWASM: 'Please import the WASM file of your contract',
        noGas: 'Please input the gas limit',
        noGasPrice: 'Please input the gas price',
        incorrectPassword: 'Incorrect password',
        decimalLength: 'Decimal should not exceed 18',
        paramsLengthErr: 'Number of input parameter is wrong',
        contractAddressErr: 'The contract address is wrong',
        getAbi: 'Get ABI error',
        feeMax: 'Fee is less than the minimum fee'
        // networkError: 'Current network is unreachable, please check your network connection.',
        // noEnoughBalance: 'Insufficient balance'
      },
      labs: {
        transfer: 'Transfer',
        approve: 'Approve',
        transferFrom: 'Transfer From'
      },
      swal: {
        somethingWrong: 'Something wrong!',
        alreadyInTxPool: 'This transaction has already come into transaction pool, please wait for a moment!',
        invalidNonce: 'Please wait for the account synchronize the nonce number!',
        tooLowfee: 'Please wait until the last transaction finishes!',
        tooMuchExtraData: 'The entered text is too long, please optimize your content.',
        networkError: 'The network connection is abnormal, please check your network！',
        insufficientFunds: ' Insufficient balance',
        noEnoughBalance: 'Insufficient balance'
      }
    },
    transfer: {
      lab: 'Transfer',
      title: 'Transfer Token',
      name: 'Token Name',
      balance: 'Balance',
      toAddress: 'To Address',
      amount: 'Transfer Amount',
      transfer: 'Transfer',
      swal: {
        transferSuccess: 'Transfer token success!',
        transferFail: 'Transfer fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Recipient address is invalid!',
        confirm: 'OK',
        extraDataTooLong: 'The entered text is too long, please optimize your content',
        networkError: 'Current network is unreachable, please check your network connection'
      }
    },
    approve: {
      lab: 'Approve',
      title: 'Approve Token',
      name: 'Token Name',
      balance: 'Balance',
      toAddress: 'To Address',
      amount: 'Approve Amount',
      approve: 'Approve',
      swal: {
        approveSuccess: 'Approve token success!',
        approveFail: 'Approve fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Recipient address is invalid',
        confirm: 'OK'
      }
    },
    transferFrom: {
      lab: 'Transfer From',
      title: 'Transfer From',
      name: 'Token Name',
      allowance: 'Allowance',
      toAddress: 'To Address',
      amount: 'Transfer amount',
      transfer: 'Transfer',
      add: 'Add Owner Address',
      none: 'None owneradress',
      ownerAddress: 'Owner Address',
      swal: {
        transferSuccess: 'Transfer token success!',
        transferFail: 'Transfer fail!',
        tryAgain: 'Confirm and try again',
        incorrectPassword: 'Incorrect password!',
        somethingWrong: 'Something wrong!',
        insufficientFunds: 'Incufficient funds!',
        invalidAddress: 'Recipient address is invalid',
        addressAleadyExist: 'Address aleady exist',
        addSuccess: 'Add success',
        confirm: 'OK'
      },
      addDialog: {
        title: 'Add owner address',
        label: 'Owner address',
        btnText: 'Add'
      }
    },
    transferTx: {
      title: 'Transfer History',
      type: 'Type',
      time: 'Time',
      from: 'From',
      to: 'To',
      amount: 'Amount',
      status: 'Status',
      noRecords: 'NoRecords',
      pending: 'pending',
      success: 'success',
      fail: 'fail'
    },
    menu: {
      transfer: 'transfer',
      history: 'transfer history'
    }
  },
  dialog: {
    passwordDialog: {
      walletPassword: 'Wallet password',
      password: 'Password',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  },

  mine: {
    main: {
      easyMine: 'Start Mining',
      loading: 'Loading',
      stopMining: 'Stop Mining',
      mineReward: 'Mining Reward',
      withdrawBalance: 'Withdraw Balance',
      startFailure: 'Start Failure',
      remoteNodeError: 'please restart after switching to local node.',
      unstartNodeError: 'please restart after booting booting node',
      waitService: 'please wait a moment, the node is start service soon'
    },
    tips: {
      title: 'Attentions',
      tipContent:
        'When the wallet starts mining, it will automatically switch to the local node and wait for the local node to synchronize to the latest block height before mining.',
      done: 'Done'
    },
    withdraw: {
      withdraw: 'Withdraw Balance',
      receipt: 'Receipt Address',
      withdrawAmount: 'Withdraw Amount',
      availableAmount: 'Available Amount: ',
      cancel: 'Cancel',
      confirm: 'Withdraw',
      success: 'Withdraw Success',
      inPoolError: 'The transaction has already in pool, please wait a moment.',
      invalidAddress: 'Recipient address is invalid',
      noEnoughBalance: 'Insufficient balance',
      newFeeTooLow: 'Please wait util the last transaction finish.',
      noBalance: 'No withdrawable amount',
      alreadyInTxPool: 'This transaction has already come into transaction pool, please wait for a moment!',
      invalidNonce: 'Please wait for the account synchronize the nonce number!',
      tooLowfee: 'Please wait until the last transaction finishes!'
    }
  }
}

export default {
  'zh-CN': zhCN,
  'en-US': enUS
}
