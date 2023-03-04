import { configureChains, createClient, Connector } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { web3AuthConnector } from './connector';

const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai],
    [publicProvider()]
);

export const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    // Seems like the wagmi connector package provided by web3auth has an issue.
    // Property 'onAccountsChanged' is protected but type 'Web3AuthConnector' is
    // not a class derived from 'Connector<Provider, Options, Signer>'.
    // Casting to any to get around this.
    connectors: [web3AuthConnector(chains) as unknown as Connector],
});
