import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { supabaseClient } from "utils/supabase";
import { v4 as uuid } from 'uuid';
import CreateTaskDialog from "~/components/kanban/create-task-dialog";
import TasksKanban from "~/components/kanban/tasks-kanban";
import { Button } from "~/components/ui/button";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params
    if (!projectId) return json({ errorCode: 'not_found', project: null }, { status: 401 })

    const client = supabaseClient({ request });
    const { data: project, error } = await client.from('projects').select('id, title, description, tasks (id, title, description, status)').eq('id', projectId!).single()

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

    // TODO: handle error
    const { data } = await client.from('tasks').insert({
        id: uuid(),
        title,
        description,
        creator_id: session?.user.id,
        project_id: projectId
    })

    return json({ data })
}

export default function ProjectDetails() {
    const { project } = useLoaderData<typeof loader>()
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <section className="p-4 gap-2 h-full">
            <section className="mb-12 flex flex-col gap-6 h-full">
                <div className="mb-4">
                    <h1 className="text-xl font-medium mb-2">{project?.title}</h1>
                    <p>{project?.description}</p>
                </div>
                <div className="flex justify-end">
                    <Button size='sm' onClick={() => setModalOpen(true)}>New Task</Button>
                </div>
                <TasksKanban tasks={project?.tasks ?? []} />
            </section>
            <CreateTaskDialog open={modalOpen} onOpenChange={setModalOpen} />
        </section>
    )
}