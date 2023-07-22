import { ethers } from "ethers";
import { GNOSIS_NODE, GNOSIS_SAFE, GNOSIS_USDC, NETWORK, NETWORKS, NETWORK_TO_NODE, NETWORK_TO_SAFE, POLYGON_NODE, POLYGON_SAFE, POLYGON_USDC, RECEIVERS_FLAT, RECEIVER_TO_NETWORK, TOKEN } from "./constants";
import { listen } from "./listeners/Listener";
import { send, sendUsdcUsingBcnmyPolygon } from "./senders/Sender";
import { signEip712 } from "./signers/Signer";
import { generateTransferCalldata } from "./tx-generator";

const tokenSender = async () => {

};

const main = async () => {
  // await doBiconomy();
  // await sendUsdcUsingBcnmyPolygon(
  //   POLYGON_NODE,
  //   '0xeA5963C83b6E38d766EcF506f39A82E723Adc709',
  //   POLYGON_SAFE,
  //   '1',
  // );

  const listenPromises: Array<Promise<unknown>> = [];
  for (const network of [process.env.NETWORK] as NETWORK[]) {
    const WSS_RPC = NETWORK_TO_NODE[network];
    // const provider = new ethers.providers.WebSocketProvider(WSS_RPC);
    const [token, decimals] = TOKEN[network];
    listenPromises.push(
      listen(
        network,
        WSS_RPC,
        token,
        RECEIVERS_FLAT,
        async (receiver: `0x${string}`, to: `0x${string}`, amount: string) => {
          const destinationNetwork: NETWORK = RECEIVER_TO_NETWORK[receiver] as NETWORK;
          // console.log(network, 'TO', destinationNetwork, receiver, to, amount);
          if (destinationNetwork === 'Polygon') {
            await sendUsdcUsingBcnmyPolygon(
              network,
              receiver,
              amount,
            );
          } else {
            console.log(
              destinationNetwork,
              NETWORK_TO_NODE[destinationNetwork],
              TOKEN[destinationNetwork][0],
              to,
              NETWORK_TO_SAFE[destinationNetwork],
              amount,
            )
            await send(
              network,
              destinationNetwork,
              to,
              amount,
            );
          }
        },
      )
    );
  }

  await Promise.all([
    ...listenPromises,
  ]);
  await new Promise((resolve) => setTimeout(resolve, 100000000));
};

main();
