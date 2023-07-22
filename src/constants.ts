import { CELO_NODE, ZKEVM_NODE } from "./secrets";

export const POLYGON_SAFE = '0xbb544Ee3a9adb4a0e1441f29A88BA2ec0f866ccA';
export const POLYGON_AA_MODULE = '0x175d303d407763206B726b1Af0ea0A9518440c32';
export const GNOSIS_SAFE = '0x76c41891Ca4524BbF116C141b7cFbf200dA3d63e';
export const GNOSIS_AA_MODULE = '0xeBB67444eb915bbd8d64A7409830809dC1EcC2A6';
export const CELO_SAFE = '0x4dA27dda1F235b16A6A5acc47C01616A489bCdE3';

export const GNOSIS_USDC = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83';
export const POLYGON_USDC = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
export const CELO_CUSD = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
export const ZKEVM_USDT = '0x1E4a5963aBFD975d8c9021ce480b42188849D41d';

export const POLYGON_NODE = 'wss://polygon-mainnet.g.alchemy.com/v2/IKV1Snx-bw7DIfA34x6RRFaY1rTWbvHB';
export const GNOSIS_NODE = 'wss://rpc.gnosischain.com/wss';

export type NETWORK = 'Polygon' | 'Gnosis' | 'Celo' | /*'ZkSync' |*/ 'ZkEvm';
export const NETWORKS: NETWORK[] = ['Polygon', 'Gnosis', 'Celo', /*'ZkSync',*/ 'ZkEvm'];

export const NETWORK_TO_NODE: Record<NETWORK, string> = {
  Polygon: POLYGON_NODE,
  Gnosis: GNOSIS_NODE,
  Celo: CELO_NODE,
  // ZkSync: 'wss://events.zksync.io/',
  ZkEvm: ZKEVM_NODE,
};

export const NETWORK_TO_SAFE: Record<NETWORK, `0x${string}`> = {
  Polygon: POLYGON_SAFE,
  Gnosis: GNOSIS_SAFE,
  Celo: CELO_SAFE,
  ZkEvm: CELO_SAFE,
};

export const RECEIVERS: Record<NETWORK, `0x${string}`> = {
  Polygon: '0xE144132bD46B28F543955494C349540d415663E1',
  Gnosis: '0x2c368B299931Bc3b3a86503679F0B1766B70b3a4',
  Celo: '0x4942ddba13627bbf11e6AECE01b80a9983C9D357',
  ZkEvm: '0x3F41dD2D9CEcc7D3dacF236538000BbA400EEf08',
  // ZkSync: '0xFC0670429Ea3F157573ba420196574131e4Ac34D',
};

export const RECEIVERS_FLAT = Object.values(RECEIVERS);

export const RECEIVER_TO_NETWORK = Object.fromEntries(
  Object.entries(RECEIVERS).map(([network, receiver]) => [receiver, network])
);

export const TOKEN: Record<NETWORK, [`0x${string}`, number]> = {
  Polygon: [POLYGON_USDC, 6],
  Gnosis: [GNOSIS_USDC, 6],
  Celo: [CELO_CUSD, 18],
  ZkEvm: [ZKEVM_USDT, 6],
  // ZkSync: [CELO_CUSD, 18],
};
