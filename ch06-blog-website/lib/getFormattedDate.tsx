export default function getFormattedDate(dateString: string):string {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Karachi' }).format(new Date(dateString))
}