import { ethers } from "ethers";

const TOKEN_ABI = [
  "event Transfer(address indexed src, address indexed dst, uint val)",
];

export const listen = async (
  chain: string,
  rpc: string,
  _contract: `0x${string}`,
  receivers: `0x${string}`[],
  successor: (receiver: `0x${string}`, to: `0x${string}`, amount: string) => Promise<void>,
) => {
  console.log('LISTEN', chain);
  const provider = new ethers.providers.WebSocketProvider(rpc);
  const contract = new ethers.Contract(_contract, TOKEN_ABI, provider);

  provider.on('error', (e) => {
    console.log('PROVIDER ERROR', chain, e);
  });
  // provider.on('disconnect', (e) => {
  //   console.log('PROVIDER DISCONNECT', chain, e);
  // });

  const hashes = new Set<string>();

  contract.on("Transfer", (src, dst, val, { transactionHash }) => {
    if (hashes.has(transactionHash)) {
      return;
    }
    hashes.add(transactionHash);
    // if (chain === 'Polygon' && !receivers.includes(dst)) {
    //   return;
    // }
    // console.log('TRANSFER DETECTED', chain, 'from:', src, 'to:', dst, 'amount:', val.toString());
    if (!receivers.includes(dst)) {
      return;
    }
    successor(dst, src, val.toString()).then(() => {
      // console.log(chain, src, dst, val.toString(), "done");
    }).catch((e) => {
      console.log(chain, src, dst, val.toString(), e);
    });
  });
};
