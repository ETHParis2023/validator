import { ethers } from "ethers";
import { POLYGON_NODE } from "../constants";
import { WALLET } from "../secrets";

export interface Eip712MessageTypes {
  SafeTx: {
    type: string;
    name: string;
  }[];
}

export enum OperationType {
  Call, // 0
  DelegateCall, // 1
}

export interface GenerateTypedData {
  types: Eip712MessageTypes;
  domain: {
    chainId?: number;
    verifyingContract: string;
  };
  primaryType: string;
  message: {
    to: string;
    value: string;
    data: string;
    operation: OperationType;
    safeTxGas: string;
    baseGas: string;
    gasPrice: string;
    gasToken: string;
    refundReceiver: string;
    nonce: number;
  };
}

export function getEip712MessageTypes(): {
  SafeTx: Array<{ type: string; name: string }>;
} {
  return {
    SafeTx: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'value' },
      { type: 'bytes', name: 'data' },
      { type: 'uint8', name: 'operation' },
      { type: 'uint256', name: 'safeTxGas' },
      { type: 'uint256', name: 'baseGas' },
      { type: 'uint256', name: 'gasPrice' },
      { type: 'address', name: 'gasToken' },
      { type: 'address', name: 'refundReceiver' },
      { type: 'uint256', name: 'nonce' }
    ]
  }
}

export interface MetaTransactionData {
  to: string;
  value: string;
  data: string;
  operation?: OperationType;
}

export interface SafeTransactionData extends MetaTransactionData {
  operation: OperationType;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
}

export interface SafeTransactionEIP712Args {
  safeAddress: string;
  chainId: number;
  safeTransactionData: SafeTransactionData;
}

export function generateTypedData({
  safeAddress,
  chainId,
  safeTransactionData
}: SafeTransactionEIP712Args): GenerateTypedData {
  const typedData: GenerateTypedData = {
    types: getEip712MessageTypes(),
    domain: {
      verifyingContract: safeAddress
    },
    primaryType: 'SafeTx',
    message: {
      ...safeTransactionData,
      value: safeTransactionData.value,
      safeTxGas: safeTransactionData.safeTxGas,
      baseGas: safeTransactionData.baseGas,
      gasPrice: safeTransactionData.gasPrice,
      nonce: safeTransactionData.nonce
    }
  }
  typedData.domain.chainId = chainId
  return typedData
}

export const signEip712 = async (
  chainId: number,
  calldata: `0x${string}`,
  to: `0x${string}`,
  safe: `0x${string}`,
  nonce: number,
) => {
  const safeTransactionData = {
    to,
    value: '0',
    data: calldata,
    operation: OperationType.Call,
    safeTxGas: '0',
    baseGas: '0',
    gasPrice: '0',
    gasToken: '0x0000000000000000000000000000000000000000',
    refundReceiver: '0x0000000000000000000000000000000000000000',
    nonce,
  };
  // console.log(safeTransactionData);
  const data = generateTypedData({
    safeAddress: safe,
    chainId,
    safeTransactionData,
  });
  // console.log(data)

  const provider = new ethers.providers.WebSocketProvider(POLYGON_NODE);
  const wallet = new ethers.Wallet('0x' + WALLET.key, provider);

  const signature = await wallet._signTypedData(data.domain, data.types as any, data.message);
  return signature;
};


