import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ChevronUp } from 'lucide-react';
import { useState } from "react";
import { json } from "react-router";
import type { FeatureRequest } from "types";
import { formatDate } from "utils/format-date";
import { supabaseClient } from "utils/supabase";
import { v4 as uuid } from 'uuid';
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
    const { data } = await client.from('feature_requests').insert({
        id: uuid(),
        title,
        project_id: projectId
    })

    return json({ data })
}

export default function ProjectRequests() {
    const { featureRequests } = useLoaderData<{ featureRequests: FeatureRequest[] }>()

    return (
        <section className="max-w-2xl w-full mx-auto flex flex-col gap-4 pt-6">
            <Form className="flex flex-col items-start gap-3 [&>label]:w-full" method="POST">
                <Textarea label="Feature" name="title" className="w-full" />
                <Button>Add Request</Button>
            </Form>

            <hr className="my-4" />

            <ul className="flex flex-col gap-4 py-4">
                {featureRequests.map(request => (
                    <Request key={request.id} request={request} />
                ))}
            </ul>
        </section>
    )
}

function Request({ request }: { request: FeatureRequest }) {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()
    const [upvotes, setUpvotes] = useState(request.upvotes)
    const [upvoting, setUpvoting] = useState(false)

    const upvote = async () => {
        setUpvoting(true);
        setUpvotes(upvotes + 1);

        const { error } = await supabase
            .from('feature_requests')
            .update({ upvotes: upvotes + 1 })
            .eq('id', request.id)

        if (error) {
            // TODO: more error handling
            setUpvotes(upvotes - 1);
        }

        setUpvoting(false)
    }

    return (
        <li className="flex items-center gap-2">
            <button disabled={upvoting} onClick={upvote} className="text-muted-foreground border rounded-md p-1 w-[40px] items-center flex flex-col disabled:pointer-events-none disabled:opacity-50">
                <ChevronUp size={20} />
                <span className="text-xs">{upvotes}</span>
            </button>
            <div>
                <h3 className="font-medium">{request.title}</h3>
                {request.created_at && (
                    <span className="text-sm text-muted-foreground">
                        {formatDate(request.created_at)}
                    </span>
                )}
            </div>
        </li>
    )
}