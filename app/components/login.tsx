import { useOutletContext } from "@remix-run/react"
import { type SupabaseClient } from "@supabase/supabase-js"
import { LucideLoader } from "lucide-react"
import { useState, type FormEvent } from "react"
import { cn } from "utils/cn"
import Logo from "./logo"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Login() {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEmailLogin = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        setFormError('')

        if (email === '') {
            setFormError('please enter a valid email address')
            return
        }

        setIsSubmitting(true)
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.origin}/auth/callback`,
            }
        })

        setIsSubmitting(false)
        if (error) {
            console.log(error)
            alert(`Error: ${error.message}`)
            return;
        }

        if (data) {
            setEmailSent(true)
        }
    }

    const updateEmail = (ev: FormEvent<HTMLInputElement>) => {
        if (formError) setFormError('')
        setEmail(ev.currentTarget.value)
    }

    return (
        <section className="max-w-sm mx-auto mt-16 flex flex-col gap-8">
            <Logo />
            <form className="flex flex-col gap-3 mb-5" onSubmit={handleEmailLogin}>
                <Input
                    label="Email address"
                    autoFocus
                    type="email"
                    className="text-base"
                    onChange={updateEmail}
                    value={email}
                />
                {formError && <p className="text-sm text-red-500 py-3 px-2 bg-red-50 rounded-sm">Please enter a valid email address</p>}
                {emailSent && <p className="text-sm text-green-700 py-3 px-2 bg-green-100 rounded-sm">An email has been sent to your email address</p>}
                <Button disabled={emailSent} className="text-base">
                    {isSubmitting ? (
                        <LucideLoader
                            size={18}
                            className={cn('animate-spin')}
                        />
                    ) :
                        'Get Magic Link'
                    }
                </Button>
            </form>
        </section>
    )
}