import { configureChains, createClient } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains(
    [polygonMumbai],
    [publicProvider()]
);

export const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
});
