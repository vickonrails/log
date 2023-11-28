import { Link, useLocation } from "@remix-run/react";
import { CopyCheck, ExternalLink, ListTodo, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from "react";
import { cn } from "utils/cn";
import Logo from "./logo";

export default function Sidebar({ className, projectId, ...props }: HTMLAttributes<HTMLElement> & { projectId: string }) {
    return (
        <aside {...props} className={`${className} flex flex-col gap-6 border-r pr-4`}>
            <div className="pt-4 pb-4">
                <Logo />
            </div>

            <section className="flex flex-col">
                <NavGroupHeading title="You" />
                <NavItem title="Tracker" to={`/app/projects/${projectId}/tracker`} Icon={CopyCheck} />
                <NavItem title="Requests" to={`/app/projects/${projectId}/requests`} Icon={ListTodo} />
            </section>

            <section className="flex flex-col">
                <NavGroupHeading title="External" />
                <NavItem title="Requests" to={`/projects/${projectId}/requests`} Icon={ExternalLink} external />
            </section>
        </aside>
    )
}

function NavGroupHeading({ title }: { title: string }) {
    return (
        <h2 className="text-sm px-2 uppercase font-medium select-none mb-2 text-gray-500">{title}</h2>
    )
}

function NavItem({ title, to, Icon, onClick, external = false }: { title: string, to: string, Icon: LucideIcon, onClick?: () => void, external?: boolean }) {
    const { pathname } = useLocation()
    const isChildRoute = pathname.startsWith(to)
    const classes = cn('px-3 py-2 rounded-sm flex items-center text-muted-foreground', isChildRoute ? 'bg-primary text-primary-foreground' : 'hover:bg-blue-50')

    if (external) return (
        <a href={to} target="_blank" rel="noreferrer noopener" className={classes}>
            {<Icon className="w-5 h-5 mr-2" />}
            {title}
        </a>
    )

    return (
        <Link
            className={classes}
            to={to}
            onClick={onClick}
        >
            {<Icon className="w-5 h-5 mr-2" />}
            {title}
        </Link>
    )
}