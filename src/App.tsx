import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

function App() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, status, isConnected, isConnecting, isReconnecting, isDisconnected } =
        useAccount();
    const { chain } = useNetwork();

    // Eager connection
    useEffect(() => {
        if (!isDisconnected) return;
        const wagmiConnected = localStorage.getItem('wagmi.connected');
        const isWagmiConnected = wagmiConnected ? JSON.parse(wagmiConnected) : false;

        if (!isWagmiConnected) return;

        connect({ connector: connectors[0] });
    }, [connect, connectors]);

    return (
        <div className='layout'>
            <h1>web3auth modal ➕ wagmi</h1>
            <p>
                Status:{' '}
                <code>
                    {status}
                    {status === 'connected' ? '🔥' : ''}
                </code>
                {status === 'connected' ? ` to ${chain?.name}` : ''}
            </p>
            <p>
                Address: <code>{address || 'N/A'}</code>
            </p>
            <div style={{ marginTop: 20 }}>
                {isConnecting || isReconnecting ? (
                    <button>Loading</button>
                ) : isConnected ? (
                    <button onClick={() => disconnect()}>Disconnect</button>
                ) : (
                    <button onClick={() => connect({ connector: connectors[0] })}>
                        Connect 🔥
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;
