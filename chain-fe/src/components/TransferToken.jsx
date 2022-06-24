import React, { useState, useContext } from "react";

import { ChainContext } from "context/ChainContext";
import { Loader } from ".";
import { chainApi } from "apis";
import { chainJsApi } from "apis";


const Input = ({ placeholder, type, name, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.00025"
    value={value}
    onChange={(e) => handleChange(e.target.value)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

export default function TransferToken() {
  const { walletId, password, address, balance, setPassword, getBalance, setWalletId } = useContext(ChainContext);

  const [isLoading, setIsLoading] = useState(false);

  const [addressTo, setAddressTo] = useState("");
  function handleChangeAddressTo(value) {
    setAddressTo(value);
  }

  const [amount, setAmount] = useState(1);
  function handleChangeAmount(value) {
    if (value > balance) {
      alert("You don't have enough balance");
      return;
    }
    setAmount(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    chainJsApi.transferToken(password, walletId, address, addressTo, parseInt(amount, 10), address).then(() => {
      setIsLoading(false);
      getBalance();
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-12 py-12 px-4">
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0">
          <div>
            <h3 className="text-white text-3xl text-center my-2 flex w-full justify-center items-center 2xl:px-20 ">
              Transfer token
            </h3>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input
              placeholder="Address get Token"
              name="addressGetToken"
              type="text"
              value={addressTo}
              handleChange={handleChangeAddressTo}
            />
            <Input
              placeholder="Investment money"
              name="investmentMoney"
              type="number"
              value={amount}
              handleChange={handleChangeAmount}
            />

            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Confirm Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
