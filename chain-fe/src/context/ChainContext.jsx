/* eslint-disable react-hooks/exhaustive-deps */
import { chainApi, chainJsApi } from "apis";
import React, { useEffect, useState } from "react";
import { get_local_storage_data, localStorageKey, localStorageKeyWalletId, localStorageKeyPassword, set_local_storage_data, remove_local_storage_data } from "utils/localStorage";

export const ChainContext = React.createContext();

export function ChainProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [password, setPassword] = useState(null);
  const [walletId, setWalletId] = useState(null);

  function saveAddress(id, password, address) {
    if (address == null && id != null) {
      chainJsApi.createAddress(id, password).then((res) => {
        let address = res.data.address;
        setAddress(address);


        setPrivateKey(res.data.secret);
        setPassword(password);
        setWalletId(id);

        if (password) {
          set_local_storage_data(localStorageKeyPassword, password);
        } else {
          remove_local_storage_data(localStorageKeyPassword);
        }
  
        if (id) {
          set_local_storage_data(localStorageKeyWalletId, id);
        } else {
          remove_local_storage_data(localStorageKeyWalletId);
        }

        if (address) {
          set_local_storage_data(localStorageKey, address);
        } else {
          remove_local_storage_data(localStorageKey);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      setAddress(address);
      setPassword(password);
      setWalletId(id);

      if (password == null && id == null && address == null) {
        setBalance(null)
      }

      if (password) {
        set_local_storage_data(localStorageKeyPassword, password);
      } else {
        remove_local_storage_data(localStorageKeyPassword);
      }

      if (id) {
        set_local_storage_data(localStorageKeyWalletId, id);
      } else {
        remove_local_storage_data(localStorageKeyWalletId);
      }

      if (address) {
        set_local_storage_data(localStorageKey, address);
      } else {
        remove_local_storage_data(localStorageKey);
      }
    }
  }

  useEffect(() => {
    // get adddress from local storage
    const address = get_local_storage_data(localStorageKey);
    const walletId = get_local_storage_data(localStorageKeyWalletId);
    const password = get_local_storage_data(localStorageKeyPassword);

    if (address) {
      saveAddress(walletId, password, address);
    }
  }, []);

  useEffect(() => {
    // get balance of address
    if (address) {
      // get balance of address
      getBalance();
    }
  }, [address]);

  // async function getBalance() { Ham nay cua cho' Nhut
  //   if (address) {
  //     chainApi.getBalance(address).then((res) => {
  //       setBalance(res?.data?.result?.Balance);
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }

  async function getBalance() {
    if (address) {
      chainJsApi.getBalance(address).then((res) => {
        setBalance(res?.data.balance);
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  return (
    <ChainContext.Provider
      value={{
        address,
        saveAddress,
        getBalance,
        balance,
        privateKey,
        password,
        walletId,
        setWalletId,
        setPassword,
        setPrivateKey
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
