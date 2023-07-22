import { GNOSIS_NODE, GNOSIS_SAFE, GNOSIS_USDC, POLYGON_NODE, POLYGON_SAFE, POLYGON_USDC } from "./constants";
import { listen } from "./listeners/Listener";
import { send } from "./senders/Sender";

const main = async () => {
  // await send('Gnosis', GNOSIS_NODE, GNOSIS_USDC, '0x693f7243e7577A3845364F23d856349f15571856', GNOSIS_SAFE, '31');
  await Promise.all([
    listen(
      'Polygon',
      POLYGON_NODE,
      POLYGON_USDC,
      POLYGON_SAFE,
      async (to: `0x${string}`, amount: string) => {
        await send('Gnosis', GNOSIS_NODE, GNOSIS_USDC, to, GNOSIS_SAFE, amount);
      },
    ),
    listen(
      'Gnosis',
      GNOSIS_NODE,
      GNOSIS_USDC,
      GNOSIS_SAFE,
      async (to: `0x${string}`, amount: string) => {
        await send('Polygon', POLYGON_NODE, POLYGON_USDC, to, POLYGON_SAFE, amount);
      },
    ),
  ]);
};

main();
