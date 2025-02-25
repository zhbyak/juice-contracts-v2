import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployMockContract } from '@ethereum-waffle/mock-contract';

import jbDirectory from '../../artifacts/contracts/interfaces/IJBDirectory.sol/IJBDirectory.json';
import JBEthPaymentTerminal from '../../artifacts/contracts/JBETHPaymentTerminal.sol/JBETHPaymentTerminal.json';
import jbPaymentTerminalStore from '../../artifacts/contracts/JBPaymentTerminalStore.sol/JBPaymentTerminalStore.json';
import jbOperatoreStore from '../../artifacts/contracts/interfaces/IJBOperatorStore.sol/IJBOperatorStore.json';
import jbProjects from '../../artifacts/contracts/interfaces/IJBProjects.sol/IJBProjects.json';
import jbSplitsStore from '../../artifacts/contracts/interfaces/IJBSplitsStore.sol/IJBSplitsStore.json';
import jbPrices from '../../artifacts/contracts/interfaces/IJBPrices.sol/IJBPrices.json';

describe('JBPayoutRedemptionPaymentTerminal::setFeelessTerminal(...)', function () {
  async function setup() {
    let [deployer, terminalOwner, caller] = await ethers.getSigners();

    let [
      mockJbDirectory,
      mockJbEthPaymentTerminal,
      mockJBPaymentTerminalStore,
      mockJbOperatorStore,
      mockJbProjects,
      mockJbSplitsStore,
      mockJbPrices,
    ] = await Promise.all([
      deployMockContract(deployer, jbDirectory.abi),
      deployMockContract(deployer, JBEthPaymentTerminal.abi),
      deployMockContract(deployer, jbPaymentTerminalStore.abi),
      deployMockContract(deployer, jbOperatoreStore.abi),
      deployMockContract(deployer, jbProjects.abi),
      deployMockContract(deployer, jbSplitsStore.abi),
      deployMockContract(deployer, jbPrices.abi),
    ]);

    const jbCurrenciesFactory = await ethers.getContractFactory('JBCurrencies');
    const jbCurrencies = await jbCurrenciesFactory.deploy();
    const CURRENCY_ETH = await jbCurrencies.ETH();

    let jbTerminalFactory = await ethers.getContractFactory('JBETHPaymentTerminal', deployer);

    let jbEthPaymentTerminal = await jbTerminalFactory
      .connect(deployer)
      .deploy(
        CURRENCY_ETH,
        mockJbOperatorStore.address,
        mockJbProjects.address,
        mockJbDirectory.address,
        mockJbSplitsStore.address,
        mockJbPrices.address,
        mockJBPaymentTerminalStore.address,
        terminalOwner.address,
      );

    return {
      terminalOwner,
      caller,
      jbEthPaymentTerminal,
      mockJbEthPaymentTerminal,
    };
  }

  it('Should add a terminal as feeless and emit event', async function () {
    const { terminalOwner, jbEthPaymentTerminal, mockJbEthPaymentTerminal } = await setup();

    expect(
      await jbEthPaymentTerminal
        .connect(terminalOwner)
        .setFeelessTerminal(mockJbEthPaymentTerminal.address, true),
    )
      .to.emit(jbEthPaymentTerminal, 'SetFeelessTerminal')
      .withArgs(mockJbEthPaymentTerminal.address, true, terminalOwner.address);

    expect(await jbEthPaymentTerminal.isFeelessTerminal(mockJbEthPaymentTerminal.address)).to.be
      .true;
  });

  it('Should remove a terminal as feeless and emit event', async function () {
    const { terminalOwner, jbEthPaymentTerminal, mockJbEthPaymentTerminal } = await setup();

    await jbEthPaymentTerminal
      .connect(terminalOwner)
      .setFeelessTerminal(mockJbEthPaymentTerminal.address, true);

    expect(
      await jbEthPaymentTerminal
        .connect(terminalOwner)
        .setFeelessTerminal(mockJbEthPaymentTerminal.address, false),
    )
      .to.emit(jbEthPaymentTerminal, 'SetFeelessTerminal')
      .withArgs(mockJbEthPaymentTerminal.address, false, terminalOwner.address);

    expect(await jbEthPaymentTerminal.isFeelessTerminal(mockJbEthPaymentTerminal.address)).to.be
      .false;
  });

  it('Cannot set a feeless terminal if caller is not the owner', async function () {
    const { caller, jbEthPaymentTerminal, mockJbEthPaymentTerminal } = await setup();
    await expect(
      jbEthPaymentTerminal
        .connect(caller)
        .setFeelessTerminal(mockJbEthPaymentTerminal.address, true),
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
