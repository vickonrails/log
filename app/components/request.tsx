import { useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import type { FeatureRequest } from "types";
import { formatDate } from "utils/format-date";

export function FeatureRequest({ request, disabled = false }: { request: FeatureRequest, disabled?: boolean }) {
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
            <button disabled={upvoting || disabled} onClick={upvote} className="text-muted-foreground border rounded-md p-1 w-[40px] items-center flex flex-col disabled:pointer-events-none disabled:opacity-50">
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