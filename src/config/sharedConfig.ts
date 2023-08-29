import {
  DECIMALS,
  GAS_LIMIT,
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER,
  GAS_PRICE as DEFAULT_GAS_PRICE
} from '@multiversx/sdk-dapp/constants/index';
import { object, string, boolean } from 'yup';
import { NetworkUrlType, NetworkType } from 'types/network.types';

const GAS_PRICE = String(DEFAULT_GAS_PRICE);
const DIGITS = 2;

export {
  DECIMALS,
  DIGITS,
  GAS_LIMIT,
  GAS_PER_DATA_BYTE,
  GAS_PRICE_MODIFIER,
  GAS_PRICE
};

export const links: NetworkUrlType[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    url: 'https://explorer.multiversx.com/'
  },
  {
    id: 'testnet',
    name: 'Testnet',
    url: 'https://testnet-explorer.multiversx.com/'
  },
  {
    id: 'devnet',
    name: 'Devnet',
    url: 'https://devnet-explorer.multiversx.com/'
  }
];

export const allApps = (apps?: { id: string; name: string; url: string }[]) => {
  const baseApps = [
    {
      id: 'main-site',
      name: 'Main site',
      url: 'https://multiversx.com/'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      url: 'https://wallet.multiversx.com'
    },
    {
      id: 'explorer',
      name: 'Explorer', // navbar title
      url: 'http://explorer.multiversx.com'
    },
    {
      id: 'xexchange',
      name: 'xExchange',
      url: 'https://xexchange.com/'
    },
    {
      id: 'xlaunchpad',
      name: 'xLaunchpad',
      url: 'https://xlaunchpad.com/'
    },
    {
      id: 'xspotlight',
      name: 'xSpotlight',
      url: 'https://xspotlight.com/'
    },
    {
      id: 'bridge',
      name: 'Bridge',
      url: 'https://bridge.multiversx.com/'
    },
    {
      id: 'docs',
      name: 'Docs',
      url: 'https://docs.multiversx.com/'
    }
  ];

  if (apps) {
    const mergedApps = baseApps.map((app) => ({
      ...app,
      ...apps.find((configApp) => configApp.id === app.id)
    }));

    return mergedApps;
  }

  return baseApps;
};

export const getInternalNetworks = (): NetworkType[] => {
  if (process.env.VITE_APP_INTERNAL_NETWORKS) {
    try {
      const decodedNetworks = atob(
        String(process.env.VITE_APP_INTERNAL_NETWORKS)
      );

      const parsedNetworks = JSON.parse(decodedNetworks);
      if (parsedNetworks && parsedNetworks.length > 0) {
        return parsedNetworks.map((network: NetworkType) => {
          return {
            ...network,
            ...(!network?.adapter ? { adapter: 'api' } : {}),
            ...(!network?.egldLabel ? { egldLabel: 'xEGLD' } : {})
          };
        });
      }
    } catch {
      return [];
    }
  }

  return [];
};

export const networkBaseSchema = object({
  default: boolean(),
  id: string().defined().required(),
  egldLabel: string().defined().required(),
  name: string().defined().required(),
  theme: string().oneOf(['default', 'testnet']),
  walletAddress: string(),
  explorerAddress: string(),
  accessToken: boolean()
}).required();

export const adapterSchema = object({
  extrasApi: string().when('accessToken', {
    is: true,
    then: string().required()
  }),
  adapter: string().defined().oneOf(['api', 'elastic']),
  apiAddress: string().when('adapter', {
    is: 'api',
    then: string().required()
  }),
  growthApi: string().when('adapter', {
    is: 'api',
    then: string().when('id', {
      is: 'mainnet',
      then: string().required()
    })
  }),
  elasticUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required()
  }),
  proxyUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required()
  })
}).required();

export const schema = networkBaseSchema.concat(adapterSchema);