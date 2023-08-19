type Meta = {
    id?: string,
    title: string,
    date: string,
    tags?: string[]
}

type BlogPost = {
    id: string,
    meta: Meta,
    content: ReactElement<any, string | JSXElementConstructor<any>>,
}
// the react element is returned by copileMDX function from next-mdx-remote
// in app/lib/posts.ts, hover over content to get the return type