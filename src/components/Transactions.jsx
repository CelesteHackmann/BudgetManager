import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getTransactions();
    }, []);

    async function getTransactions() {
        const { data, error } = await supabase.from("transactions").select('id,created_at,description,amount').order('created_at', { ascending: true });
        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }
        setTransactions(data);
    }

    return (
        <div>
            <h1>Budget Manager</h1>
            <h2>Transactions</h2>
            <table id="transactions">
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
        </div>
    );
}