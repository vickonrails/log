import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { LucideLoader } from "lucide-react";
import { createRef, useEffect } from "react";
import { json } from "react-router";
import type { FeatureRequest } from "types";
import { supabaseClient } from "utils/supabase";
import { v4 as uuid } from 'uuid';
import { resetFetcher } from "~/components/kanban/create-task-dialog";
import { FeatureRequest as FeatureRequestCmp } from "~/components/request";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export async function loader({ request, params }: LoaderFunctionArgs) {
    const { id: projectId } = params

    const client = supabaseClient({ request });
    const { data: featureRequests, error } = await client
        .from('feature_requests')
        .select('id, title, description, created_at, upvotes')
        .eq('project_id', projectId!)
        .order('created_at', { ascending: false })

    if (error) return json({ errorCode: 'not_found', project: null }, { status: 500 })

    return json({ featureRequests, errorCode: null })
}

export async function action({ request, params }: ActionFunctionArgs) {
    const client = supabaseClient({ request })
    const { id: projectId } = params

    if (!projectId) return json({ message: 'An error occurred' }, { status: 500 })

    const formData = await request.formData();
    const title = formData.get('title') as string

    // TODO: handle error
    const { error } = await client.from('feature_requests').insert({
        id: uuid(),
        title,
        project_id: projectId
    })

    return json({ ok: true, error })
}

export default function ProjectRequests() {
    const fetcher = useFetcher();
    const { featureRequests } = useLoaderData<{ featureRequests: FeatureRequest[] }>()
    const formRef = createRef<HTMLFormElement>()
    const submitting = fetcher.state === 'submitting'

    useEffect(() => {
        if (fetcher.data) {
            formRef.current?.reset()
            resetFetcher(fetcher)
        }
    }, [fetcher.state])

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        fetcher.submit(ev.currentTarget)
    }

    return (
        <section className="max-w-2xl w-full mx-auto flex flex-col gap-4 pt-6">
            <fetcher.Form ref={formRef} onSubmit={handleSubmit} className="flex flex-col items-start gap-3 [&>label]:w-full" method="POST">
                <Textarea label="Feature" name="title" className="w-full" />
                <Button>
                    {submitting ? (
                        <LucideLoader
                            className="animate-spin"
                        />
                    ) : 'Add Request'}
                </Button>
            </fetcher.Form>

            <hr className="my-4" />

            <ul className="flex flex-col gap-4 py-4">
                {featureRequests.map(request => (
                    <FeatureRequestCmp key={request.id} request={request} />
                ))}
            </ul>
        </section>
    )
}

