import { getUser } from "@/lib/getUser"
import { getUserPosts } from "@/lib/getUserPosts"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts" // we do not need curly braces here because we are exporting default in UserPosts.tsx
import { Metadata } from "next"

type Params = {
    params: {
        userId: string
    }
}

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
    // without this function, the page title shows "Create Next App", we are creating dynamic routes based on userId
    // this function will generate dynamic meta data for each user page
    const userData: Promise<User> = getUser(userId)

    // although we are using the same request in both metadata and UserPage functions, the request will be made only once
    // nexxt.js automatically deduplicates the request
    const user:User = await userData

    return {
        title: user.name,
        description: `This is the page for ${user.name}`
    }

}

export default async function UserPage({params: {userId}}: Params) {
//     const userData: Promise<User> = getUser(userId)
//     const userPostsData: Promise<Post[]> = getUserPosts(userId)

//     const [user, userPosts] = await Promise.all([userData, userPostsData])
//   return (
//     <>
//         <h2>{user.name}</h2>
//         <br />
//         <UserPosts posts={userPosts} />
//     </>
//   )

// ^^ This approach works fine but it will first fetch user and its posts and then render everything together. 
    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)

    const user = await userData
    return (
        <>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<h2>Loading...</h2>}>
                <UserPosts promise={userPostsData}/>
            </Suspense>
        </>
    )
}
