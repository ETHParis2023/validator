import { ethers } from "ethers";
import { WALLET } from "../secrets";

const SAFE_ABI = [
  "function execTransaction(address to, uint256 value, bytes calldata data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) external payable returns (bool success)",
];


export const send = async (
  chain: string,
  rpc: string,
  token: `0x${string}`,
  to: `0x${string}`,
  safe: `0x${string}`,
  amount: string,
) => {
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