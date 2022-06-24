import React, { useContext, useState } from "react";

import { RiCopperCoinLine } from "react-icons/ri";
import { AiFillPlayCircle } from "react-icons/ai";

import { ChainContext } from "context/ChainContext";
import { shortenAddress } from "utils/shortenAddress";
import { chainApi } from "apis";

export default function Welcome() {
  const { address, balance } = useContext(ChainContext);


  return (
    <div className="flex w-full justify-center items-center">
      <div className="">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-center text-white  w-full justify-center items-center text-gradient py-1">
            BLOCKCHAIN
          </h1>

          <h3 className="text-white text-3xl text-center my-2 flex w-full justify-center items-center 2xl:px-20 ">
            Wallet Assets Information
          </h3>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-50 sm:w-85 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div>
                <p className="text-white font-semibold text-lg mt-1">
                  <RiCopperCoinLine fontSize={21} color="#fff" />
                  {balance} Chain Coins
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Wallet Address <br /> {shortenAddress(address)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
