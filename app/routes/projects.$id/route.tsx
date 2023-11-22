import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export async function loader() {
    return json({ message: 'hello world' })
}

export default function Project() {
    const { message } = useLoaderData<typeof loader>()
    return (
        <div>{message}</div>
    )
}
