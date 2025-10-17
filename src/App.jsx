import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
    getTotalSpent();
  }, []);

  async function getTransactions() {
    const { data } = await supabase.from("transactions").select();
    setTransactions(data);
  }

  const [totalSpent, setTotalSpent] = useState([]);
  async function getTotalSpent() {
    const { data, error } = await supabase.from("transactions").select("amount");
    if (error) {
      console.error("Error fetching total spent:", error);
      return;
    }
    const total = data.reduce((acc, transaction) => acc + transaction.amount, 0);
    setTotalSpent(total.toFixed(2));
  }

  return (
    <view>
      <h1>Budget Manager</h1>
      <h2>Transactions</h2>
      <table id="transacitons">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.created_at}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </view>
  );
}

export default App;