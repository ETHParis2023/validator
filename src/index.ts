import { GNOSIS_NODE, GNOSIS_SAFE, GNOSIS_USDC, POLYGON_NODE, POLYGON_SAFE, POLYGON_USDC } from "./constants";
import { listen } from "./listeners/Listener";

const main = async () => {
  await Promise.all([
    listen('Polygon', POLYGON_NODE, POLYGON_USDC, POLYGON_SAFE),
    listen('Gnosis', GNOSIS_NODE, GNOSIS_USDC, GNOSIS_SAFE),
  ]);
};

main();
