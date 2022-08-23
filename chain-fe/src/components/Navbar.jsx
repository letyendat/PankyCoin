import React, { useContext, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Modal, Button, Label, Checkbox } from "flowbite-react";

import logo from "assets/images/chain.png";
import { ChainContext } from "context/ChainContext";
import { truncate } from "utils/shortenAddress";
import { chainJsApi } from "apis";

import copy from "copy-to-clipboard";

function NavBarItem({ title, classprops }) {
  return (
    <li className={`mx-4 cursor-pointer hover:text-blue-400 ${classprops}`}>{title}</li>
  );
}

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const { privateKey, address, saveAddress } = useContext(ChainContext);

  const [isShowLoginModal, setIsShowLoginModal] = useState(false);

  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);

  const [isShowPrivateKeyModal, setIsShowPrivateKeyModal] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [allAddress, setAllAddress] = useState([]);


  const [isShowAllAddressModal, setIsShowAllAddressModal] = useState(false);

  const [isShowTransactionsModal, setIsShowTransactionsModal] = useState(false);



  // const [privateKey, setPrivateKey] = useState("");

  const [loginData, setLoginData] = useState({
    privateKey: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    password: "",
  });

  function onCloseCbLogin() {
    setIsShowLoginModal(false);
  }

  function onCloseCbRegister() {
    setIsShowRegisterModal(false);
  }

  function onCloseCbPrivateKey() {
    setIsShowPrivateKeyModal(false);
  }

  function onCloseCbTransactions() {
    setIsShowTransactionsModal(false);
  }

  function onCloseCbAllAddress() {
    setIsShowAllAddressModal(false);
  }

  function onRegisterClick(e) {
    e.preventDefault()

    if (registerData?.password) {
      chainJsApi.createWallet(registerData.password).then((res) => {
        saveAddress(res?.data.id, registerData.password, res?.data.addresses[0]);

        setIsShowPrivateKeyModal(true);
      }).catch((err) => {
        console.log(err)
      }).finally(() => { });
      setIsShowRegisterModal(false);
      setIsShowLoginModal(false);
    }
  }

  function onLoginClick(e) {
    e.preventDefault()

    if (loginData?.privateKey && loginData?.password) {
      chainJsApi.loginWallet(loginData?.privateKey, loginData?.password).then((res) => {
        saveAddress(res.data.id, loginData.password, res.data.addresses[0]);
      }).catch((err) => {
        console.log(err)
      }).finally(() => { });
      setIsShowLoginModal(false);
    }
  }

  function onStatisticsClick(e) {
    e.preventDefault()

    chainJsApi.getAllBlocks().then((res) => {
      let vecTransactions = [];
      console.log(res);
      res.data.forEach(block => {
        if (block.nonce !== 0) {
          block.transactions.forEach(transaction => {
            if (transaction.type === "regular" && (transaction.data.inputs[0].address === address || transaction.data.outputs[0].address === address)) {
              vecTransactions.push(transaction);
            }
          })
        }
      });

      setTransactions(vecTransactions || []);
    }).catch((err) => {
      console.log(err);
    });

    setIsShowTransactionsModal(true);
  }

  function onAccountStatisticsClick(e) {
    e.preventDefault()

    chainJsApi.getAllWallets().then((res) => {
      let vecAddress = [];
      res.data.forEach(wallet => {
        vecAddress.push(wallet.addresses);
      });

      setAllAddress(vecAddress || []);
    }).catch((err) => {
      console.log(err);
    });

    setIsShowAllAddressModal(true);
  }

  function copyToClipboard(text) {
    copy(text);
    alert(`You have copied "${text}"`);
  }

  function logoutClick() {
    saveAddress(null, null, null);
  }



  return (
    <>
      <nav className="w-full flex md:justify-center justify-between items-center p-4">
        <div className="md:flex-[0.5] flex-initial justify-center items-center">
          <img src={logo} alt="logo" className="w-32 cursor-pointer" />
        </div>
        <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
          {
            address ? (
              <li type="button submit" className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
                onClick={onAccountStatisticsClick}
              >
                Account statistics
              </li>
            ) : (<p></p>)
          }
          {
            address ? (
              <li type="button submit" className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
                onClick={onStatisticsClick}
              >
                Your Transactions History
              </li>
            ) : (<p></p>)
          }
          {
            address ? (<>
              <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
                {truncate(address, 8)}
              </li>
              <li type="button" className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
                onClick={logoutClick}
              >
                Log out
              </li>
            </>) : (
              <li type="button" className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]"
                onClick={() => setIsShowLoginModal(true)}
              >
                Login
              </li>
            )
          }
        </ul>
        <div className="flex relative">
          {!toggleMenu && (
            <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
          )}
          {toggleMenu && (
            <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
          )}
          {toggleMenu && (
            <ul
              className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
            >
              <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
              {["Market", "Exchange", "Tutorials", "Wallets"].map(
                (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
              )}
            </ul>
          )}
        </div>
      </nav>

      {/* Login */}
      <Modal
        show={isShowLoginModal}
        size="md"
        popup={true}
        onClose={onCloseCbLogin}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <div>
              <Label
                className="mb-2 block"
                htmlFor="name"
              >
                Your Private Key
              </Label>
              <input
                type="text"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter private key"
                required
                onChange={(e) => setLoginData({ ...loginData, privateKey: e.target.value })}
              />
            </div>
            <div>
              <Label
                className="mb-2 block"
                htmlFor="name"
              >
                Your Password
              </Label>
              <input
                type="text"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your password"
                required
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            {/* <div>
              <Label
                className="mb-2 block"
                htmlFor="password"
              >
                Your password
              </Label>
              <input type="text" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your pharse" />
            </div> */}
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="dark:border-gray-500 dark:bg-gray-600"
                />
                <Label htmlFor="remember">
                  Remember me
                </Label>
              </div>
              {/* <a
                href="/modal"
                className="text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Lost Password?
              </a> */}
            </div>
            <div className="w-full">
              <Button
                type="submit"
                onClick={onLoginClick}
              >
                Log in
              </Button>
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{' '}
              <div className="w-full">
                <Button
                  type="submit"
                  onClick={() => setIsShowRegisterModal(true)}
                >
                  Create account
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/**Register */}
      <Modal
        show={isShowRegisterModal}
        size="md"
        popup={true}
        onClose={onCloseCbRegister}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Register Wallet
            </h3>
            <div>
              <Label
                className="mb-2 block"
                htmlFor="name"
              >
                Password
              </Label>
              <input
                type="text"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter password"
                required
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="dark:border-gray-500 dark:bg-gray-600"
                />
                <Label htmlFor="remember">
                  Remember me
                </Label>
              </div>
            </div>
            <div className="w-full">
              <Button
                type="submit"
                onClick={(e) => {
                  onRegisterClick(e);
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/**Show Private Key */}
      <Modal
        show={isShowPrivateKeyModal}
        size="md"
        popup={true}
        onClose={onCloseCbPrivateKey}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Your Private Key
            </h3>
            {
              privateKey ? (<div className="text-xl font-medium text-gray-900 dark:text-white">
                {truncate(privateKey, 8)}
              </div>) : ""
            }

            <div className="w-full">
              <Button
                type="submit"
                onClick={() => {
                  copyToClipboard(privateKey);
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/**History Transaction Your */}
      <Modal
        show={isShowTransactionsModal}
        size=""
        popup={true}
        onClose={onCloseCbTransactions}
      >
        <Modal.Header />
        <Modal.Body>

          <h3 className="text-3xl text-center my-2">
            Your Transactions History
          </h3>
          <div className="mt-10 relative overflow-x-auto shadow-md sm:rounded-lg" Style="max-height: 400px">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Address From
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address To
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>

                  {/* <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th> */}
                </tr>
              </thead>
              <tbody>
                {
                  transactions.map((transaction, index) => {
                    return (
                      <tr className="bg-white dark:bg-gray-800" key={transaction.hash}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {transaction.data.inputs[0].address}
                        </th>
                        <td className="px-6 py-4">
                          {transaction.data.outputs[0].address}
                        </td>
                        <td className="px-6 py-4">
                          {transaction.data.outputs[0].amount}
                        </td>

                        {/* <td className="px-6 py-4 text-right">
                                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                            </td> */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>

        </Modal.Body>
      </Modal>

      {/**Account Statistics Key */}
      <Modal
        show={isShowAllAddressModal}
        size=""
        popup={true}
        onClose={onCloseCbAllAddress}
      >
        <Modal.Header />
        <Modal.Body>

          <h3 className="text-3xl text-center my-2">
            Account Statistics
          </h3>
          <h5 className="text-2xl text-center my-2">
            Total number of existing addresses: {allAddress.length}
          </h5>
          <div className="mt-10 relative overflow-x-auto shadow-md sm:rounded-lg" Style="max-height: 400px">

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  allAddress.map((address, index) => {
                    return (
                      <tr className="bg-white dark:bg-gray-800" key={address}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {address}
                        </th>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
};
