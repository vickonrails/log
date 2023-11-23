import { Outlet } from '@remix-run/react'
import Sidebar from '~/components/sidebar'

export default function app() {
    return (
        <section className='flex h-full'>
            <Sidebar className='basis-1/5' />
            <main className='flex-1'>
                <Outlet />
            </main>
        </section>
    )
}
