import { ethers } from "ethers";
import { WALLET } from "../secrets";
import { signEip712 } from "../signers/Signer";
import { generateSafeExecTransactionCalldata, generateTransferCalldata } from "../tx-generator";
import { doBiconomyUsdcTransfer } from "../biconomy";
import { NETWORK, NETWORK_TO_NODE, NETWORK_TO_SAFE, POLYGON_AA_MODULE, POLYGON_NODE, POLYGON_SAFE, TOKEN } from "../constants";

const SAFE_ABI = [
  "function execTransaction(address to, uint256 value, bytes calldata data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) external payable returns (bool success)",
  "function nonce() external view returns (uint256)",
];


export const sendUsdcUsingBcnmyPolygon = async (
  fromChain: NETWORK,
  to: `0x${string}`,
  amount: string,
) => {
  const provider = new ethers.providers.WebSocketProvider(POLYGON_NODE);
  const wallet = new ethers.Wallet(WALLET.key, provider);
  const contract = new ethers.Contract(POLYGON_SAFE, SAFE_ABI, wallet);

  const [, fromDecimals] = TOKEN[fromChain];
  const changeInDecimals = 6 - fromDecimals;
  console.log({ changeInDecimals })
  console.log({ amount })
  if (changeInDecimals > 0) {
    amount = (BigInt(amount) * BigInt(10 ** changeInDecimals)).toString();
  }
  if (changeInDecimals < 0) {
    amount = (BigInt(amount) / BigInt(10 ** -changeInDecimals)).toString();
  }
  console.log({ amount })

  const nonce = +await contract.nonce();
  // console.log({ nonce })

  const calldata = await generateSafeExecTransactionCalldata(to, amount, nonce);
  // console.log({ calldata });

  // const tx = await wallet.sendTransaction({
  //   to: POLYGON_AA_MODULE,
  //   data: calldata,
  //   gasLimit: 2000000,
  //   gasPrice: (await provider.getGasPrice()).mul(5).div(4),
  // });

  // console.log(tx.hash);

  // const receipt = await tx.wait();

  // console.log(receipt);
  

  await doBiconomyUsdcTransfer('Polygon', calldata);
  


};

export const send = async (
  fromChain: NETWORK,
  chain: NETWORK,
  to: `0x${string}`,
  amount: string,
) => {
  const rpc = NETWORK_TO_NODE[chain];
  const [token, decimals] = TOKEN[chain];
  const [, fromDecimals] = TOKEN[fromChain];
  const changeInDecimals = decimals - fromDecimals;
  console.log({ changeInDecimals })
  console.log({ amount })
  if (changeInDecimals > 0) {
    amount = (BigInt(amount) * BigInt(10 ** changeInDecimals)).toString();
  }
  if (changeInDecimals < 0) {
    amount = (BigInt(amount) / BigInt(10 ** -changeInDecimals)).toString();
  }
  console.log({ amount })
  
  const safe = NETWORK_TO_SAFE[chain];
  const provider = new ethers.providers.WebSocketProvider(rpc);
  const wallet = new ethers.Wallet(WALLET.key, provider);
  const contract = new ethers.Contract(safe, SAFE_ABI, wallet);
  const TRANSFER_SELECTOR = "0xa9059cbb";
  const calldata = `${TRANSFER_SELECTOR}${to.split("0x")[1].padStart(64, '0')}${parseInt(amount).toString(16).padStart(64, '0')}`;
  // console.log(chain, calldata);
  const args = [
    token,
    0,
    calldata,
    0,
    0,
    0,
    0,
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x000000000000000000000000ea5963c83b6e38d766ecf506f39a82e723adc709000000000000000000000000000000000000000000000000000000000000000001",
  ];
  const gasEstimation = await contract.estimateGas.execTransaction(...args);
  const gasPrice = await provider.getGasPrice();
  const tx = await contract.execTransaction(
    ...args,
    {
      gasLimit: gasEstimation.mul(3).div(2),
      gasPrice: gasPrice.mul(5).div(4),
    }
  );
  console.log(chain, tx.hash);
  await tx.wait();
  console.log(chain, tx.hash, "done");
}

// 0xb50691c19d7bbe281c1d99cd538b75983cda4575e2a8a9151647da426be58a942f0ed6a38294527ee7842c07411435c40c68fa5e7f536404214b13d5551711481c