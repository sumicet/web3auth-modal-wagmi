import { Web3Auth, IWeb3AuthModal } from '@web3auth/modal';
import { Web3AuthConnector as WagmiWeb3AuthConnector } from '@web3auth/web3auth-wagmi-connector';
import { Chain, ConnectorData, UserRejectedRequestError } from 'wagmi';
import { LoginModal, LOGIN_MODAL_EVENTS } from '@web3auth/ui';

class Connector extends WagmiWeb3AuthConnector {
    async connect() {
        let error: any;

        const value = await new Promise(async (resolve, reject) => {
            this.web3AuthInstance.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible: boolean) => {
                if (!isVisible && !this.provider) {
                    // User closed the modal without connecting
                    // Throw an error to notify `wagmi`
                    // If you don't throw an error here, `wagmi` will think
                    // that the user is still trying to connect and will remain in a
                    // forever loading state
                    reject(new UserRejectedRequestError('User rejected the request'));
                }
            });

            try {
                const result = await super.connect();
                // Make additional requests here if needed
                resolve(result);
            } catch (error: any) {
                reject(error);
            }
        }).catch((err: any) => {
            error = err;
        });

        if (!error) return value as Required<ConnectorData>;

        if (!(error instanceof UserRejectedRequestError)) {
            // Show a generic error message for the user
            console.error(error);

            const web3AuthInstanceModal = this.web3AuthInstance as IWeb3AuthModal & {
                loginModal?: LoginModal;
            };

            // Close the modal on error to prevent the user from attempting
            // to connect to another provider
            // If the user connects to another provider after an error,
            // `wagmi` will not be able to detect that the user is connected
            // since we're not calling `connect` again
            web3AuthInstanceModal.loginModal?.closeModal();
        }

        throw error;
    }
}

export const web3AuthConnector = (chains: Chain[]) => {
    const web3AuthInstance = new Web3Auth({
        clientId:
            'BKfeYPuAvJ8FLsk3fWbJm4YtC6FOgJX_7Lerg7Pe-B5JgBHgiDbdwdUpi8OLGbMB3OTPiRlTw3fj1L-CKd9zNAI', // Should be in an .env file, but I won't do that for this example since I'm not going to use this key for anything else
        web3AuthNetwork: 'testnet', // Should change according to environment
        chainConfig: {
            chainNamespace: 'eip155',
            chainId: `0x${chains[0].id.toString(16)}`,
        },
        uiConfig: {
            theme: 'dark',
            loginMethodsOrder: ['google', 'discord', 'github', 'twitter', 'twitch'],
            appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
        },
        enableLogging: false,
        sessionTime: 86400, // 24 hours
    });

    return new Connector({
        options: {
            web3AuthInstance,
        },
        chains: [
            {
                id: chains[0].id,
                name: chains[0].name,
                rpcUrls: {
                    default: {
                        http: [chains[0].rpcUrls.default.http[0]],
                    },
                    public: {
                        http: [chains[0].rpcUrls.public.http[0]],
                    },
                },
                nativeCurrency: {
                    name: chains[0].nativeCurrency.name,
                    symbol: chains[0].nativeCurrency.symbol,
                    decimals: chains[0].nativeCurrency.decimals,
                },
                network: chains[0].network,
            },
        ],
    });
};
