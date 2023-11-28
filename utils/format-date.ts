import ms from "ms"

export function formatDate(date: string) {
    const createdDate = new Date(date).getTime()
    return `${ms(Date.now() - createdDate, { long: true })} ago`
}