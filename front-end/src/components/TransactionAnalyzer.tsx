import { useState } from "react";
import axios from "axios";

const NOVES_API_KEY = "YOUR_NOVES_API_KEY"; // Replace with your actual API key

export default function TransactionAnalyzer() {
  const [txHash, setTxHash] = useState<string>("");
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [chain, setChain] = useState<string>("eth");
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [transactionDescription, setTransactionDescription] = useState<
    string | null
  >(null);
  const [tokenBalances, setTokenBalances] = useState<any>(null);

  // Set up axios default header for API key
  axios.defaults.headers.common["apiKey"] = NOVES_API_KEY;

  // Fetch a classified description of the transaction
  const classifyTransaction = async () => {
    try {
      const response = await axios.get(
        `https://translate.noves.fi/evm/${chain}/describeTx/${txHash}`
      );
      setTransactionDescription(response.data.description);
    } catch (error) {
      console.error("Error classifying transaction:", error);
    }
  };

  // Fetch transaction details
  const fetchTransactionDetails = async () => {
    try {
      const response = await axios.get(
        `https://translate.noves.fi/evm/${chain}/tx/${txHash}`
      );
      setTransactionDetails(response.data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // Fetch token balances
  const fetchTokenBalances = async () => {
    try {
      const response = await axios.post(
        `https://translate.noves.fi/evm/${chain}/tokens/balancesOf/${accountAddress}`
      );
      setTokenBalances(response.data);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  return (
    <div className="bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        Transaction Analyzer
      </h2>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Chain</label>
        <input
          type="text"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          placeholder="e.g., eth, bsc"
          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Transaction Hash</label>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Enter transaction hash"
          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Account Address</label>
        <input
          type="text"
          value={accountAddress}
          onChange={(e) => setAccountAddress(e.target.value)}
          placeholder="Enter account address"
          className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:justify-between gap-4">
        <button
          onClick={classifyTransaction}
          className="w-full md:w-1/3 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition-all"
        >
          Classify Transaction
        </button>
        <button
          onClick={fetchTransactionDetails}
          className="w-full md:w-1/3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold transition-all"
        >
          Get Transaction Details
        </button>
        <button
          onClick={fetchTokenBalances}
          className="w-full md:w-1/3 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md font-semibold transition-all"
        >
          Get Token Balances
        </button>
      </div>

      {/* Display Results */}
      {transactionDescription && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">
            Transaction Description:
          </h3>
          <p className="text-gray-300">{transactionDescription}</p>
        </div>
      )}

      {transactionDetails && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Transaction Details:</h3>
          <pre className="text-gray-300 overflow-x-auto">
            {JSON.stringify(transactionDetails, null, 2)}
          </pre>
        </div>
      )}

      {tokenBalances && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Token Balances:</h3>
          <pre className="text-gray-300 overflow-x-auto">
            {JSON.stringify(tokenBalances, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
