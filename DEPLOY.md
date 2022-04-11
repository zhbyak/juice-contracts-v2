# 部署文档
---

#### 1.网络报错解决

```
export NODE_OPTIONS=--openssl-legacy-provider
```

#### 2.node 版本需要降级到 16

#### 3.本地新建.env 文件

```
ETHERSCAN_API_KEY= 去 bscscan 上获取
INFURA_ID= eth 链特有,去 infura 上获取
```

#### 4.本地新建 mnemonic.txt 文件

这里面是测试号的助记词

#### 5.新增 bsc 链的配置

```
  // bsc
    case '97': // 测试网络编号97
      multisigAddress = '0x95C54D662c31672b2E9C572959AcF93cc883a0A5'; //这里是目标钱包（多签钱包）的地址 多签地址填自己的,他最后部署完会把合约owner移交给这个地址
      chainlinkV2UsdEthPriceFeed = '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526'; // 第二个是固定的预言机
      protocolProjectStartsAtOrAfter = 0; // 第三个应该是生效时间
      break;
```

#### 6.开始部署:
```
0.网络SSL报错:export NODE_OPTIONS=--openssl-legacy-provider
1.node 版本需要降级到 16
2.首先安装必须yarn install 但是部署必须npx
3.网络，私钥，api 就是bsc有代替的全套   
4.hardhat.config.js中的gasPrice是50000000000,可以降级为20000000000 节省tBNB
5.npx hardhat deploy --network bsctestnet   
6.最后验证npx hardhat --network bsctestnet etherscan-verify
```

bsctest记录:https://testnet.bscscan.com/address/0x95C54D662c31672b2E9C572959AcF93cc883a0A5
