import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] =useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getTransactions();
    getTypes();
    getCategories();
    getSubcategories();
  }, []);

  async function getTransactions() {
    const { data, error } = await supabase.from("transactions").select('id,created_at,description,amount').order('created_at', { ascending: true });
    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }
    setTransactions(data);
  }

  async function getTypes() {
    const { data, error } = await supabase.from("types").select('name');
    if (error) {
      console.error("Error fetching types:", error);
      return;
    }
    setTypes(data.map((type) => type.name));
  }

  async function getCategories() {
    const { data, error } = await supabase.from("categories").select('name');
    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    setCategories(data);
  }

  async function getSubcategories() {
    const { data, error } = await supabase.from("subcategories").select('name');
    if (error) {
      console.error("Error fetching subcategories:", error);
      return;
    }
    setSubcategories(data);
  }

  return (
    <div>
      <h1>Budget Manager</h1>
      <h2>Transactions</h2>
      <button onClick={() => setShowModal(true)}>Add Transaction</button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Transaction</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const description = formData.get("description");
                const amount = parseFloat(formData.get("amount"));
                const created_at = formData.get("date");
                let type = formData.get("type");
                let category = formData.get("category");
                let subcategory = formData.get("subcategory");

                await supabase.from("types").select('id').eq('name', type).single().then(res => {
                  type = res.data ? res.data.id : null;
                });
                await supabase.from("categories").select('id').eq('name', category).single().then(res => {
                  category = res.data ? res.data.id : null;
                });
                await supabase.from("subcategories").select('id').eq('name', subcategory).single().then(res => {
                  subcategory = res.data ? res.data.id : null;
                }); 

                const { error } = await supabase.from("transactions").insert([{ created_at, description, amount, type, category, subcategory }]);
                if (error) {
                  console.error("Error adding transaction:", error);
                  return;
                }
                setShowModal(false);
                getTransactions();
              }}
            >
              <label>
                Description:
                <input type="text" name="description" required />
              </label>
              <label>
                Amount:
                <input type="number" name="amount" step="0.01" required />
              </label>
              <label>
                Date:
                <input type="date" name="date" required />
              </label>
              <label>
                Type:
                <select name="type" required>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category:
                <select name="category">
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subcategory
                <select name="subcategory">
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.name} value={subcategory.name}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;