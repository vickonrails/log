import type { LoaderFunctionArgs } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createServerClient } from '@supabase/auth-helpers-remix';
import { type Database } from 'types/supabase';

export function supabaseClient({ request }: Pick<LoaderFunctionArgs, "request">) {
    const response = new Response();

    return createServerClient<Database>(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_ANON_KEY as string,
        { request, response }
    )
}