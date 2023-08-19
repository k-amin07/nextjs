import { compileMDX } from "next-mdx-remote/rsc"

import { BlogPostModel } from "@/models/posts"

import dbConnect, { generateId } from "./dbConnect"

import rehypeAutolinkHeadings from "rehype-autolink-headings/lib"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight/lib"
import Video from "@/app/components/Video"
import CustomImage from "@/app/components/CustomImage"

export async function getPostById(id: string): Promise<BlogPost | undefined> {
    await dbConnect()
    const post = await BlogPostModel.findOne({id})
    console.log(post)
    if(!post) {
        console.log({post})
        return undefined
    }
    const mdxSource = `---\ntitle: ${post.meta.title}\ndate: ${post.meta.date}\ntags: ${post?.meta?.tags?.join(",")}\n---\n\n${post.content}`

    const {frontmatter, content} = await compileMDX<{title:string,date:string,tags:string[]}>({
        source: mdxSource,
        components: {
            Video,
            CustomImage,
        },
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [
                    rehypeHighlight,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }]
                ],
            }
        }
    })
        
    const blogPostObject: BlogPost = {
        id: post.id,
        meta: {
            id: post.id,
            title: frontmatter.title,
            date: frontmatter.date,
            tags: post.meta.tags
        },
        content
    }
    return blogPostObject
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
    await dbConnect()
    // const id = await generateId()
    // await BlogPostModel.create({
    //     id: id.toString(),
    //     meta: {
    //         id: id.toString(),
    //         title: "some title",
    //         date: "2023-08-19",
    //         tags: ["tag1", "tag2"]
    //     },
    //     content: "We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.",
    // })
    const res = await BlogPostModel.find({}, 'id');

    if (!res.length) {
        return undefined
    }

    console.log({res})
    

    const posts: Meta[] = []

    for(const id of res) {
        // console.log({id: id.id})
        const post = await getPostById(id.id)
        // console.log({post})
        if(post) {
            posts.push({ ...post.meta, id: id.id})
        }
    }
    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}