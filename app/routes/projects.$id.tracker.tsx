import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { supabaseClient } from 'utils/supabase';
import TasksKanban from '~/components/kanban/tasks-kanban';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params

    const client = supabaseClient({ request });
    const { data: project, error } = await client.from('projects').select('id, title, description, tasks (id, title, description, status, column_order, updated_at)').eq('id', projectId!).single()

    if (error) return json({ errorCode: 'not_found', project: null }, { status: 500 })

    return json({ project, errorCode: null })
}

export default function ProjectTracker() {
    const { project } = useLoaderData<typeof loader>()

    return (
        <TasksKanban tasks={project?.tasks ?? []} readonly />
    )
}
