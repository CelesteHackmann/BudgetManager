import { useState } from 'react'
import './Auth.css'
import { supabase } from "../lib/supabase";
import { ToastContainer, toast } from 'react-toastify';


export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()

        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            toast(error.error_description || error.message)
        } else {
            toast('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="row flex flex-center">
            <div className="col-6 form-widget authentication">
                <h1 className="header">Budget Manager</h1>
                <p className="description">Sign in via magic link with your email below</p>
                <form className="form-widget" onSubmit={handleLogin}>
                    <div>
                        <input
                            className="inputField"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className={'button block'} disabled={loading} type='submit'>
                            {loading ? <span>Loading</span> : <span>Send magic link</span>}
                        </button>
                        <ToastContainer/>
                    </div>
                </form>
            </div>
        </div>
    )
}