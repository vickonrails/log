import { Outlet } from '@remix-run/react'

export default function Index() {
    return (
        <section>
            <Outlet />
            <div>Index</div>
        </section>
    )
}
