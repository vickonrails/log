import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet, useOutletContext } from '@remix-run/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from 'utils/supabase';

export async function loader({ request }: LoaderFunctionArgs) {
    const client = supabaseClient({ request })
    const { data: { session } } = await client.auth.getSession();

    if (!session) {
        console.log(`sessioning`)
        return redirect('/sign-in')
    }

    return json({ ok: true })
}

export default function App() {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    return (
        <section className='max-w-7xl mx-auto h-full'>
            <main className='h-full'>
                <Outlet context={{ supabase }} />
            </main>
        </section>
    )
}
