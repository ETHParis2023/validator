import { BigNumber, ethers } from "ethers";
import { signEip712 } from "./signers/Signer";
import { POLYGON_SAFE, POLYGON_USDC } from "./constants";

export const generateTransferCalldata = (
  to: `0x${string}`,
  amount: string,
): `0x${string}` => {
  const data: `0x${string}` = `0xa9059cbb000000000000000000000000${to.slice(2)}${BigNumber.from(amount).toHexString().slice(2).padStart(64, '0')}`;
  return data;
};

const execTxAbi = [
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)',
];
const moduleAbi = [
  'function execTransaction(address safe, uint256 value, bytes data)',
];
export const generateSafeExecTransactionCalldata = async (
  to: `0x${string}`,
  amount: string,
  nonce: number,
): Promise<`0x${string}`> => {
  const transferData = generateTransferCalldata(to, amount);
  // console.log({ transferData })
  const _signature = await signEip712(
    137,
    transferData,
    POLYGON_USDC,
    POLYGON_SAFE,
    nonce,
  );
  // console.log({ _signature })
  const _interface = new ethers.utils.Interface(execTxAbi);
  const calldata = _interface.encodeFunctionData('execTransaction', [
    POLYGON_USDC,
    0,
    transferData,
    0,
    0,
    0,
    0,
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    _signature,
  ]) as `0x${string}`;
  // console.log({ calldata })
  // we need second execTransaction for module
  const _interface2 = new ethers.utils.Interface(moduleAbi);
  const calldata2 = _interface2.encodeFunctionData('execTransaction', [
    POLYGON_SAFE,
    0,
    calldata,
  ]) as `0x${string}`;
  // console.log({ calldata2 })
  return calldata2;
};
