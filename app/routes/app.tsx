import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { supabaseClient } from 'utils/supabase'
import Sidebar from '~/components/sidebar'

export async function loader({ request }: LoaderFunctionArgs) {
    const client = supabaseClient({ request })
    const { data: { session } } = await client.auth.getSession();

    if (!session) {
        console.log(`sessioning`)
        return redirect('/sign-in')
    }

    return json({ ok: true })
}

export default function app() {
    return (
        <section className='flex h-full max-w-7xl mx-auto'>
            <Sidebar className='basis-1/5' />
            <main className='flex-1'>
                <Outlet />
            </main>
        </section>
    )
}
