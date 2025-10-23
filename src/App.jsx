import { useEffect, useState } from "react";
import './App.css';
import Auth from './components/Auth';
import Transactions from './components/Transactions';
import { supabase } from "./lib/supabase";

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: {session} }) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <span id="currentUser">Not Logged In</span> : <span id="currentUser">Current User: {session.user.email}</span>}
      {!session ? <Auth /> : <Transactions key={session.user.id} session={session} />}
    </div>
  )
}

export default App;