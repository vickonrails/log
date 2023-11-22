import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export async function loader() {
    return json({ message: 'hello world' })
}

export default function Projects() {
    const { message } = useLoaderData<typeof loader>()
    return (
        <div className="text-red-500">{message}</div>
    )
}