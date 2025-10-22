import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css';
import Auth from './components/Auth';
import Transactions from './components/Transactions';


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session} }) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <text id="currentUser">Not Logged In</text> : <text id="currentUser">Current User: {session.user.email}</text>}
      {!session ? <Auth /> : <Transactions key={session.user.id} session={session} />}
    </div>
  )
}

export default App;