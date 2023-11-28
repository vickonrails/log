import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { supabaseClient } from "utils/supabase";
import { v4 as uuid } from 'uuid';
import TasksKanban from "~/components/kanban/tasks-kanban";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params
    if (!projectId) return json({ errorCode: 'not_found', project: null }, { status: 401 })

    const client = supabaseClient({ request });
    const { data: project, error } = await client.from('projects').select('id, title, description, tasks (id, title, description, status, column_order, updated_at)').eq('id', projectId!).single()

    if (error) return json({ errorCode: 'not_found', project: null }, { status: 500 })

    return json({ project, errorCode: null })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { id: projectId } = params
    const client = supabaseClient({ request })
    if (!projectId) return json({ message: 'Project not found' }, { status: 404 })

    const { data: { session } } = await client.auth.getSession()

    if (!session) return json({ message: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData();
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string

    let { count, error } = await client.from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId!)
        .eq('status', status);

    if (error) return json({ message: 'Error creating task' }, { status: 500 })

    // TODO: handle error
    const { data } = await client.from('tasks').insert({
        id: uuid(),
        title,
        description,
        status: parseInt(status) || 0,
        creator_id: session?.user.id,
        project_id: projectId,
        column_order: count || 0
    })

    return json({ data })
}

export default function ProjectDetails() {
    const { project } = useLoaderData<typeof loader>()

    return (
        <section className="p-4 gap-2 h-full">
            <section className="mb-12 flex flex-col gap-6 h-full">
                <div className="mb-4">
                    <h1 className="text-xl font-medium mb-2">{project?.title}</h1>
                    <p>{project?.description}</p>
                </div>
                <TasksKanban tasks={project?.tasks ?? []} />
            </section>
        </section>
    )
}