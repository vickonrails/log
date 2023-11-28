import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "utils/supabase";
import Logo from "~/components/logo";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params

    const client = supabaseClient({ request });
    const { data: project, error } = await client.from('projects').select('id, title, description').eq('id', projectId!).single()

    if (error) return json({ errorCode: 'not_found', project: null }, { status: 500 })

    return json({ project, errorCode: null })
}

export default function ProjectDetails() {
    const { project } = useLoaderData<typeof loader>()
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()

    return (
        <section className="p-4 gap-2 h-full">
            <nav className="py-4 flex items-center gap-4 max-w-6xl mx-auto">
                <Logo />
                <div className="flex gap-4">
                    <Link className="underline" to='tracker'>Project Tracker</Link>
                    <Link className="underline" to='requests'>Feature Requests</Link>
                </div>
            </nav>
            <section className="flex flex-col gap-2 h-[80%] max-w-6xl mx-auto mt-3">
                <div className="mb-2">
                    <h1 className="text-xl font-medium mb-2">{project?.title}</h1>
                    <p>{project?.description}</p>
                </div>

                <Outlet context={{ supabase }} />
            </section>
        </section>
    )
}