# Web3Auth Modal + Wagmi

This is an example project of how to integrate [`web3auth`](https://web3auth.io/docs/) modal together with [`wagmi`](https://wagmi.sh/).

### Why this choice of technologies?

The `web3auth` modal provides web3 social authentication. It automatically creates a new wallet and injects a web3 provider for each user who logs in using social providers (google, twitter, discord, etc.).

`wagmi` is an ethereum hook library, great when dealing with web3 transactions.

### This repo showcases how to:
- Solve the `vite` [polyfill issue](https://web3auth.io/docs/troubleshooting/vite-issues)
- Implement **eager connection**
- Make additional requests during authentication (eg call your BE server to authenticate the user)
- Close the modal when errors happen during the authentication
- Listen to modal events

Result: a unified deterministic and finite auth state. Call `useAccount` to get `isConnected` and `address`.
