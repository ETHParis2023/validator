import { GNOSIS_NODE, GNOSIS_USDC, POLYGON_NODE, POLYGON_USDC } from "./constants";
import { listen } from "./listeners/Listener";

const main = async () => {
  await Promise.all([
    listen('Polygon', POLYGON_NODE, POLYGON_USDC),
    listen('Gnosis', GNOSIS_NODE, GNOSIS_USDC),
  ]);
};

main();
