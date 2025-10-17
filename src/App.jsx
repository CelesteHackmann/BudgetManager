import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, []);

  async function getTransactions() {
    const { data } = await supabase.from("transactions").select();
    setTransactions(data);
  }

  return (
    <table id="transacitons">
      <thead>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr id={transaction.id}>
            <td>{transaction.created_at}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2">Total Spent</th>
          <td>ToDo: Math Here</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default App;