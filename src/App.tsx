import { useAccount, useConnect, useDisconnect } from 'wagmi';

function App() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, status, isConnected } = useAccount();

    return (
        <div className='layout'>
            <h1>web3auth modal ➕ wagmi</h1>
            <p>
                Status:{' '}
                <code>
                    {status}
                    {status === 'connected' ? '🔥' : ''}
                </code>
            </p>
            <p>
                Address: <code>{address || 'N/A'}</code>
            </p>
            {isConnected ? (
                <button onClick={() => disconnect()}>Disconnect</button>
            ) : (
                <button onClick={() => connect({ connector: connectors[0] })}>Connect 🔥</button>
            )}
        </div>
    );
}

export default App;
