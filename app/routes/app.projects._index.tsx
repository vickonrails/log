import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useState } from "react"
import { supabaseClient } from "utils/supabase"
import { v4 as uuid } from 'uuid'
import CreateProjectDialog from "~/components/kanban/create-project-dialog"
import Logo from "~/components/logo"
import { Button } from "~/components/ui/button"
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
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className=" flex flex-col gap-4">
            <section className="p-4 flex flex-col gap-2">
                <div className="pt-4 pb-4">
                    <Logo />
                </div>
                <div className="flex justify-end">
                    <Button
                        size='sm'
                        onClick={() => setModalOpen(true)}
                    >
                        New Project
                    </Button>
                </div>
                {projects && <Table projects={projects} />}
            </section>
            {/* TODO: close the form after the project is created */}
            <CreateProjectDialog
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </section>
    )
}