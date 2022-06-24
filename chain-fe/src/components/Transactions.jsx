import { chainApi } from "apis";
import { useState, useEffect } from "react";
import { truncate } from "utils/shortenAddress";
import { chainJsApi } from "apis";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        chainJsApi.getAllBlocks().then((res) => {
            let vecTransactions = [];
            console.log(res);
            res.data.forEach(block => {
                if (block.nonce !== 0) {
                    block.transactions.forEach(transaction => {
                        if (transaction.type === "regular") {
                            vecTransactions.push(transaction);
                        }
                    })
                }
            });

            setTransactions(vecTransactions || []);
        });
    }, []);

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-blocks">
            <div className="flex flex-col md:p-12 py-12 px-4">
                <h3 className="text-white text-3xl text-center my-2">
                    Transactions History
                </h3>
                <div className="mt-10 relative overflow-x-auto shadow-md sm:rounded-lg" Style="max-height: 400px">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    AddressFrom
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    AddressTo
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
            </div>
        </div>
    );
}