import { IBundler, Bundler } from '@biconomy/bundler';
import { ChainId, UserOperation } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster, PaymasterMode } from '@biconomy/paymaster'
import { BICONOMY_ENDPOINT, GNOSIS_NODE, WALLET } from './secrets';
import { generateSafeExecTransactionCalldata, generateTransferCalldata } from './tx-generator';
import { GNOSIS_AA_MODULE, POLYGON_AA_MODULE, POLYGON_NODE } from './constants';
import { ethers } from 'ethers';

const paymaster = new BiconomyPaymaster({
  paymasterUrl: 'https://paymaster.biconomy.io/api/v1/137/NrBC7OE8D.b487ef10-a191-4c10-a34e-a233a7d4ddf9',
});

const entryPointAbi = [
  'function getNonce(address sender, uint192) external view returns (uint256)',
];

const ENTRYPOINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

export const doBiconomyUsdcTransfer = async (
  chain: 'Polygon',
  callData: `0x${string}`,
) => {
  const bundler: IBundler = new Bundler({
    bundlerUrl: BICONOMY_ENDPOINT,
    chainId: chain === 'Polygon' ? ChainId.POLYGON_MAINNET : 100 as ChainId,
    entryPointAddress: ENTRYPOINT,
  });
  const NODE = chain === 'Polygon' ? POLYGON_NODE : GNOSIS_NODE;
  const AA_MODULE = chain === 'Polygon' ? POLYGON_AA_MODULE : GNOSIS_AA_MODULE;
  const provider = new ethers.providers.WebSocketProvider(NODE);
  const wallet = new ethers.Wallet('0x' + WALLET.key, provider);
  const entryPoint = new ethers.Contract(ENTRYPOINT, entryPointAbi, wallet);
  const nonce = await entryPoint.getNonce(AA_MODULE, 0);

  let operation: UserOperation = {
    sender: AA_MODULE,
    nonce,
    initCode: '0x',
    callGasLimit: '0',
    callData,
    signature: '0x',
    paymasterAndData: '0x',
    verificationGasLimit: '0',
    preVerificationGas: '0',
    maxFeePerGas: '0',
    maxPriorityFeePerGas: '0',
  };


  try {
    const paymasterAndData = await paymaster.getPaymasterAndData(operation, { mode: PaymasterMode.SPONSORED, calculateGasLimits: true });
    // console.log({ paymasterAndData });
    // const resultGas = await bundler.estimateUserOpGas(operation);
    // console.log({ resultGas });
    
    operation = { ...operation, ...paymasterAndData };
    // console.log({ operation })
    const result = await bundler.sendUserOp(operation);
    // console.log({ result });
    const receipt = await result.wait();
    const { success, actualGasUsed, receipt: { transactionHash } } = receipt;
    console.log({ success, actualGasUsed, transactionHash });
  } catch (e) {
    console.log(e);
  }
};
