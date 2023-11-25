import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData, useNavigation } from "@remix-run/react"
import { useState } from "react"
import { supabaseClient } from "utils/supabase"
import { v4 as uuid } from 'uuid'
import Table from "~/components/ui/table"

export async function loader({ request }: LoaderFunctionArgs) {
    const client = supabaseClient({ request })
    const { data: projects } = await client.from('projects').select(`*`);
    return json({ projects })
}

export async function action({ request }: ActionFunctionArgs) {
    const client = supabaseClient({ request })

    const { data: { session } } = await client.auth.getSession()

    if (!session) return json({ message: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData();
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    // TODO: handle error
    const { data } = await client.from('projects').insert({
        id: uuid(),
        title,
        description,
        creator_id: session?.user.id
    })

    return json({ data })
}

export default function Projects() {
    const { projects } = useLoaderData<typeof loader>()
    return (
        <section className=" flex flex-col gap-4">
            <nav className="border-b p-4">
                <h1 className="text-xl font-medium">Projects</h1>
            </nav>
            <section className="p-4">
                {/* <Button>New Project</Button> */}
                {projects && <Table projects={projects} />}
                {/* <ProjectForm /> */}
                {/* <div className="flex flex-col gap-2">
                    {projects?.map(project => (<Link className="inline-block underline" to={`/app/projects/${project.id}`} key={project.id}>{project.title}</Link>))}
                </div> */}
            </section>
        </section>
    )
}

function ProjectForm() {
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const navigate = useNavigation()
    const isSubmitting = navigate.state === 'submitting'

    return (
        <Form method="POST" className="flex flex-col gap-4 items-start">
            <input className="border px-3 py-2 w-full" name="title" id="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} />
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="border px-3 py-2 w-full" name="title" id="description" placeholder="Description" />
            <button className="bg-gray-200 border px-5 py-1 disabled:pointer-events-none disabled:opacity-50" disabled={isSubmitting}>{isSubmitting ? 'Creating' : 'Create'}</button>
        </Form>
    )
}