# juice-contracts-v2

## Develop

### Unit Tests

To run the unit tests suite (in Javascript), you'll need to deploy the contracts to a local blockchain first:

```bash
yarn chain --network hardhat
```

then run the following:

```bash
yarn test
```

It might happens that Hardhat cannot resolve custom error (test failing on "Expecter nameOfTheError() but reverted
without a reason string"), just restart yarn chain.

### System Tests

End-to-end tests have been written in Solidity, using Foundry.

To get set up:

1. Install [Foundry](https://github.com/gakonst/foundry).

2. Install external lib(s)

```bash
git submodule update --init
```

3. Run tests:

```bash
forge test
```

4. Update Foundry periodically:

```bash
foundryup
```

Resources:

- [The Forge-Book](https://onbjerg.github.io/foundry-book/forge)

### Coverage

To check current unit tests coverage:

```bash
node --require esm ./node_modules/.bin/hardhat coverage --network hardhat
```

A few notes:

- Hardhat doesn't support [esm](https://nodejs.org/api/esm.html) yet, hence running manually with node.
- We are currently using a forked version of [solidity-coverage](https://www.npmjs.com/package/solidity-coverage) that includes optimizer settings. Ideally we will move to the maintained version after this is fixed on their end.

## Deploy

Juicebox uses the [Hardhat Deploy](https://github.com/wighawag/hardhat-deploy) plugin to deploy contracts to a given network. But before using it, you must create a `./mnemonic.txt` file containing the mnemonic phrase of the wallet used to deploy. You can generate a new mnemonic using [this tool](https://github.com/itinance/mnemonics). Generate a mnemonic at your own risk.

Then, to execute the `./deploy/deploy.js` script, run the following:

```bash
npx hardhat deploy --network $network
```

Contract artifacts will be outputted to `./deployments/$network/**` and should be checked in to the repo.

## Verification

To verify the contracts on [Etherscan](https://etherscan.io), make sure you have an `ETHERSCAN_API_KEY` set in your `./.env` file. Then run the following:

```bash
npx hardhat --network $network etherscan-verify
```

This will verify all of the deployed contracts in `./deployments`.
