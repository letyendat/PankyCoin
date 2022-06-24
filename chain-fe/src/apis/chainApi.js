import axios from "axios";
import { chainApiUrl } from "utils/constants";

const chainApi = {
    getBalance: async (address) => {
        const data = {
            "id": 1,
            "method": "API.GetBalance", 
            "params": [{"Address": address}]
        }
        return axios.post(chainApiUrl, data);
    },
    newWallet: async () => {
        const data = {
            "id": 1,
            "method": "API.CreateWallet", 
            "params": []
        };
        return axios.post(chainApiUrl, data);
    },
    listAddress: async () => {
        const data = {
            "id": 1,
            "method": "API.ListAddresses", 
            "params": []
        };
        return axios.post(chainApiUrl, data);
    },
    send: async (addressFrom, addressTo, amount) => {
        const data = {
            "id": 1,
            "method": "API.Send",
            "params": [
                {
                    "sendFrom": addressFrom,
                    "sendTo": addressTo,
                    "amount": amount,
                    "mine": true
                }
            ]
        };
        return axios.post(chainApiUrl, data);
    },
    getBlockchain: async () => {
        const data = {
            "id": 1,
            "method": "API.GetBlockchain", 
            "params": []
        };
        return axios.post(chainApiUrl, data);
    }
}

export default chainApi;
