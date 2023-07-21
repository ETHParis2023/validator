import { ethers } from "ethers";

const TOKEN_ABI = [
  "event Transfer(address indexed src, address indexed dst, uint val)",
];

export const listen = async (
  chain: string,
  rpc: string,
  constract: `0x${string}`,
  safe: `0x${string}`,
) => {
  const provider = new ethers.providers.WebSocketProvider(rpc);
  const contract = new ethers.Contract(constract, TOKEN_ABI, provider);

  contract.on("Transfer", (src, dst, val) => {
    if (dst !== safe) return;
    console.log(chain, src, dst, val.toString());
  });
};
