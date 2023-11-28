import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ExternalLink } from "lucide-react";
import { supabaseClient } from "utils/supabase";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params
    if (!projectId) return json({ errorCode: 'not_found', project: null }, { status: 401 })

    const client = supabaseClient({ request });
    const { data: project, error } = await client.from('projects').select('id, title, description, feature_requests (id, title, created_at, upvotes)').eq('id', projectId!).single()

    if (error) return json({ errorCode: 'not_found', project: null }, { status: 500 })

    return json({ project, errorCode: null })
}

export default function ProjectDetails() {
    const { project } = useLoaderData<typeof loader>()

    console.log(project)

    return (
        <section className="flex py-4 gap-2 h-full">
            <section className="mb-12 flex flex-col gap-6 h-ful flex-1">
                <div className="mb-2">
                    <h1 className="text-xl font-medium mb-1">{project?.title}</h1>
                    {project?.description && <p className="text-muted-foreground mb-3">{project?.description}</p>}
                    <a className='inline-flex items-center underline gap-1' target="_blank" rel='noreferrer noopener' href={`/projects/${project?.id}/requests`}>
                        <ExternalLink size={18} className="" />
                        <span>See External</span>
                    </a>
                </div>

                <section>
                    {project?.feature_requests.map((request) => (
                        <div key={request.id} className="flex flex-col gap-2">
                            <h3 className="text-lg font-medium">{request.title}</h3>
                        </div>
                    ))}
                </section>

            </section>

        </section>
    )
}