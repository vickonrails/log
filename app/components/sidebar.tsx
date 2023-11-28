import { Link, useLocation, useOutletContext } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CopyCheck, ExternalLink, ListTodo, LogOut, type LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from "react";
import { cn } from "utils/cn";
import Logo from "./logo";

export default function Sidebar({ className, ...props }: HTMLAttributes<HTMLElement>) {
    const { supabase } = useOutletContext<{ supabase: SupabaseClient }>()

    const handleLogOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <aside {...props} className={`${className} flex flex-col gap-6 border-r pr-4`}>
            <div className="pt-4 pb-4">
                <Logo />
            </div>

            <section className="flex flex-col">
                <NavGroupHeading title="You" />
                <NavItem title="Projects" to="/app/projects" Icon={CopyCheck} />
                <NavItem title="Requests" to="/app/requests" Icon={ListTodo} />
            </section>

            <section className="flex flex-col">
                <NavGroupHeading title="External" />
                <NavItem title="Requests" to="/projects" Icon={ExternalLink} />
                <NavItem title="Status" to="/projects" Icon={ExternalLink} />
            </section>

            <NavItem title="Logout" Icon={LogOut} onClick={handleLogOut} />
        </aside>
    )
}

function NavGroupHeading({ title }: { title: string }) {
    return (
        <h2 className="text-sm px-2 uppercase font-medium select-none mb-2 text-gray-500">{title}</h2>
    )
}

function NavItem({ title, to, Icon, onClick }: { title: string, to?: string, Icon: LucideIcon, onClick?: () => void }) {
    const { pathname } = useLocation()
    const isChildRoute = to && pathname.startsWith(to)

    return (
        <Link className={cn('px-3 py-2 rounded-sm flex items-center text-muted-foreground', isChildRoute ? 'bg-primary text-primary-foreground' : 'hover:bg-blue-50')} to={to} onClick={onClick}>
            {<Icon className="w-5 h-5 mr-2" />}
            {title}
        </Link>
    )
}