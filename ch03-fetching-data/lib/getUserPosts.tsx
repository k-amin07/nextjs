export async function getUserPosts(userId: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    if (!res.ok) {
        throw new Error('Unable to fetch User\'s Posts')
    }
    return res.json()
}

