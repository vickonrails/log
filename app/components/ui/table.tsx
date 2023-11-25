import { useNavigate } from "@remix-run/react"
import ms from 'ms'
import type { HTMLAttributes } from "react"
import { type Project } from "types"
import { cn } from "utils/cn"

export default function Table({ projects }: { projects: Project[] }) {
    const navigate = useNavigate()

    return (
        <table className="w-full border border-collapse text-sm select-none">
            <thead>
                <tr className="text-left border text-gray-500">
                    <th className="p-4 py-3">Title</th>
                    <th className="p-4 py-3">Start Date</th>
                    <th className="p-4 py-3">Time Spent</th>
                    <th className="p-4 py-3">Created at</th>
                    <th className="p-4 py-3">Status</th>
                </tr>
            </thead>

            <tbody>
                {projects.map((project, idx) => {
                    const createdDate = new Date(project.created_at!).getTime()
                    const created_at = project.created_at ? ms(Date.now() - createdDate, { long: true }) : ''
                    return (
                        <tr key={project.id} onClick={() => navigate(`/app/projects/${project.id}`)} className={cn('border-b border text-muted-foreground hover:bg-blue-50', idx % 2 && 'bg-gray-50')}>
                            <td className="p-4 py-3">{project.title}</td>
                            <td className="p-4 py-3">{project.startdate ?? '-'}</td>
                            <td className="p-4 py-3">-</td>
                            <td className="p-4 py-3">{created_at} ago</td>
                            <td className="p-4 py-3"><Status status={project.status} /></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

const status_lookup = {
    0: { title: 'Planned', classes: 'bg-orange-50 border-orange-200 text-orange-400' },
    1: { title: 'In Progress', classes: 'bg-blue-50 border-blue-200 text-blue-400' },
    2: { title: 'Paused', classes: 'bg-red-50 border-red-200 text-red-400' },
    3: { title: 'Done', classes: 'bg-green-100 border-green-300 text-green-500' },
}

interface LabelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title: string
}

function Label({ title, className, ...rest }: LabelProps) {
    return (
        <div className={cn('border inline-block rounded-xl text-sm bg-gray-100 px-2 py-0.5', className)} {...rest}>
            {title}
        </div>
    )
}

function Status({ status = 0 }: { status: number }) {
    if (status > 3) return;

    // @ts-ignore
    const { title, classes } = status_lookup[status]
    switch (status) {
        case 0:
            return <Label title={title} className={classes} />
        case 1:
            return <Label title={title} className={classes} />
        case 2:
            return <Label title={title} className={classes} />
        case 3:
            return <Label title={title} className={classes} />
    }
}

// orange - not started
// green - done
// blue - in progress
// red - paused