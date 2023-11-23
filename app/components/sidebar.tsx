import type { HTMLAttributes } from "react";
import Logo from "./logo";
import { Link } from "@remix-run/react";

export default function Sidebar({ className, ...props }: HTMLAttributes<HTMLElement>) {
    return (
        <aside {...props} className={`${className} p-4 bg-white flex flex-col gap-6`}>
            <div>
                <Logo />
            </div>

            <section className="border-b-">
                <h2 className="text-sm font-bold mb-1">YOU</h2>
                <ul>
                    <li><Link to="/app/projects">Projects</Link></li>
                    <li><Link to="/projects">Requests</Link></li>
                </ul>
            </section>

            <section className="border-b-">
                <h2 className="text-sm font-bold mb-1">EXTERNAL</h2>
                <ul>
                    <li><Link to="/projects">Requests</Link></li>
                    <li><Link to="/projects">Status</Link></li>
                </ul>
            </section>
        </aside>
    )
}
