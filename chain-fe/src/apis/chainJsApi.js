import axios from "axios";
import { apiUrl, chainApiUrl } from "utils/constants";

const chainJsApi = {
    loginWallet: async (secret, password) => {
        const uri = apiUrl + "/operator/wallets/login";
        const data = {
            "secret": secret,
            "password": password
        };

        return axios.post(uri, data)
    },
    createWallet: async (password) => {
        const uri = apiUrl + "/operator/wallets";
        const data = {
            "password": password
        };

        return axios.post(uri, data)
    },
    createAddress: async (id, password) => {
        const uri = apiUrl + `/operator/wallets/${id}/addresses`;
        return axios.post(uri, null, {
            headers: {
                "password": password
            }
        })
    },
    getBalance: async (address) => {
        const uri = apiUrl + `/operator/${address}/balance`;
        return axios.get(uri)
    },
    transferToken: async (password, walletId, fromAddress, toAddress, amount, changeAddress) => {
        const uri = apiUrl + `/operator/wallets/${walletId}/transactions`;
        const data = {
            "fromAddress": fromAddress,
            "toAddress": toAddress,
            "amount": amount,
            "changeAddress": changeAddress,
        };
        return axios.post(uri, data, {
            headers: {
                "password": password
            }
        })
    },
    getAllBlocks: async () => {
        const uri = apiUrl + `/blockchain/blocks`;
        return axios.get(uri)
    },
    getAllWallets: async () => {
        const uri = apiUrl + `/operator/wallets`;
        return axios.get(uri)
    },
}

export default chainJsApi;
