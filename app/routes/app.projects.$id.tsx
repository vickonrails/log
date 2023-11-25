import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { supabaseClient } from "utils/supabase";
import { v4 as uuid } from 'uuid';
import TasksKanban from "~/components/kanban/tasks-kanban";
import { Button } from "~/components/ui/button";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params
    // if (!projectId) return json({ errorCode: 'not_found' }, { status: 401 })

    const client = supabaseClient({ request });
    const { data: project } = await client.from('projects').select('id, title, description, tasks (id, title, description)').eq('id', projectId!).single()

    // if (error) return json({ errorCode: 'not_found' }, { status: 500 })

    return json({ project })
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

export default function Project() {
    const { project } = useLoaderData<typeof loader>()

    return (
        <section className="p-4 gap-2 h-full">
            <section className="mb-12 flex flex-col gap-6 h-full">
                <div className="mb-4">
                    <h1 className="text-xl font-medium mb-2">{project?.title}</h1>
                    <p>{project?.description}</p>
                </div>
                <div className="flex justify-end">
                    <Button>New Task</Button>
                </div>
                <TasksKanban />
            </section>
        </section>
    )
}

// function TasksForm() {
//     const [description, setDescription] = useState('')
//     const [title, setTitle] = useState('')
//     const navigate = useNavigation()
//     const isSubmitting = navigate.state === 'submitting'

//     return (
//         <div>
//             <h2 c lassName="text-base font-medium mb-4">Create Tasks</h2>
//             <Form method="POST" className="max-w-sm mb-4 flex flex-col gap-4 items-start">
//                 <input className="border px-3 py-2 w-full" name="title" id="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} />
//                 <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="border px-3 py-2 w-full" name="title" id="description" placeholder="Description" />
//                 <button className="bg-gray-200 border px-5 py-1 disabled:pointer-events-none disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Creating' : 'Create'}</button>
//             </Form>
//         </div>
//     )
// }

