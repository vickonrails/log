import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node'
import { supabaseClient } from 'utils/supabase'
import Login from '~/components/login'

export async function loader({ request }: LoaderFunctionArgs) {
    const client = supabaseClient({ request })
    const { data: { session } } = await client.auth.getSession()
    if (session) {
        return redirect('/app/projects')
    }

    return json({ ok: true })
}

export default function SignIn() {
    return (
        <Login />
    )
}
