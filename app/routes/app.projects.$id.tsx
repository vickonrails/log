import { Link, Outlet, useOutletContext, useParams } from '@remix-run/react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ChevronLeft } from 'lucide-react';
import Sidebar from '~/components/sidebar';

export default function Projects() {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    const params = useParams() as { id: string }

    return (
        <section className='flex h-full'>
            <Sidebar className='basis-1/5' projectId={params.id} />
            <main className='flex-1 h-full p-4'>
                <Link to='/app/projects' className="flex transition-colors text-muted-foreground hover:text-neutral-600">
                    <ChevronLeft />
                    <span>Back to Projects</span>
                </Link>
                <Outlet context={{ supabase }} />
            </main>
        </section>
    )
}
