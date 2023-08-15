import { getUser } from "@/lib/getUser";
import getAllUsers from "@/lib/getAllUsers"; // default export, no paranthesis needed
import { getUserPosts } from "@/lib/getUserPosts";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import { Metadata } from "next";
import {notFound} from "next/navigation"

type Params = {
    params: {
        userId: string
    }
}

export async function generateMetadata({params: {userId}}: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId)
    const user:User = await userData

    if (!user) {
        return {
            title: "Not found"
        }
    }

    return {
        title: user.name,
        description: `This is the page for ${user.name}`
    }
}

export default async function UserPage({params: {userId}}: Params) {
    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)

    const user = await userData
    if(!user) {
        return notFound()
    }
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

export async function generateStaticParams() {
    const usersData: Promise<User[]> = getAllUsers()
    const users = await usersData;

    return users.map(user => ({
        userId: user.id.toString()
    }))
}