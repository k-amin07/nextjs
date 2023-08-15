export async function getUser(userId: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    if(!res.ok) {
        throw new Error('Unable to fetch User')
    }
    return res.json()
}

