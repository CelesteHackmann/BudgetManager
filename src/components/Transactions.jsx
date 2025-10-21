import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Transactions({ session }) {
    const [transactions, setTransactions] = useState([]);
    const { user } = session
    
    useEffect(() => {
        getTransactions();
    }, []);

    async function getTransactions() {
        const { data, error } = await supabase.from("transactions").select('id,date,description,amount').eq('user_id', user.id).order('date', { ascending: true });
        if (error) {
            console.error("Error fetching transactions:", error);
            return;
        }
        setTransactions(data);
    }

    return (
        <div>
            <h1>Budget Manager</h1>
            <h3>Current User: {user.email}</h3>
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
                            <td>{transaction.date}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}