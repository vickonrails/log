import { useOutletContext } from "@remix-run/react"
import { type SupabaseClient } from "@supabase/supabase-js"
import { useState, type FormEvent } from "react"

export default function Login() {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleEmailLogin = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()

        if (email === '' || password === '') return;

        await supabase.auth.signInWithPassword({
            email,
            password,
        })
    }

    const handleGitHubLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
            },
        })
    }

    return (
        <section className="max-w-sm mx-auto mt-16">
            <form className="flex flex-col gap-2 mb-5" onSubmit={handleEmailLogin}>
                <input type="email" className="border px-3 py-2" onChange={ev => setEmail(ev.target.value)} value={email} />
                <input type="password" className="border px-3 py-2" onChange={ev => setPassword(ev.target.value)} value={password} />
                <button className="bg-gray-200 border px-2 py-1">Email Login</button>
            </form>
            <div className="flex justify-center items-center gap-2">
                <button className="border px-2 py-1" onClick={handleGitHubLogin}>GitHub Login</button>
            </div>
        </section>
    )
}