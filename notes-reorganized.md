## Creating a Project
Start off with yarn, run `yarn create next-app /path/to/next/app`. The path can be replaced with a '.' to use the current directory.
- Generally, we want to use Typescript, ESLint, Tailwind CSS, App Router and not customize the import alias.
- If we opt to use the `src/` directory, we'd get `src/app` folder, otherwise we'd get `app/` folder at the root of the project.

### Running and Building
`package.json` contains the necessary scripts to start, lint and build the project. Running `yarn build` generates an optimized deployment ready build.

## Defining types
Create a `types.d.ts` file in the root of the project. Here define the all the types. This is very similar to graphql typedefs. These types can then be used in the rest of the project without explicit imports.

## Defining Function
Functions are defined by the keyword `function` keyword. If a function returns something, we add a semicolon followed by the return type to the function definition.

## Frontend
In the `app` folder, create a folder for each route. For example `./app/users`. Each route has a `page.tsx` file containing the following
- A default export function that defines what the page does.
- An optional metadata export of type Metadata (imported from next) which contains title and description of the page.
- Alternatively an optional `generateMetadata` function which accepts the same parameters as the default export function and dynamically generates metadata.

Each route can contain dynamic subroutes which are generated based on a parameter. The syntax is to use square brackets with the parameter name. For instance, to generate a page for each user, we can create `./app/users/[userId]`

### Params and Props
For routes, we define params, i.e. the parameters that the route can accept for example
```
type Params = {
    params: {
        userId: string
    }
}
export default async function UserPage({params: {userId}}: Params) {}
```
Here, the route accepts userId as a parameter.

For components, we define props, i.e. the parameters that the function accepts. For example
```
type Props = {
    promise: Promise<Post[]>
}
export default async function UserPosts({promise}:Props) {}
```

### Suspense
We can use `Suspense` from react to provide feedback while a promise is being resolved.

### SSR and SSG Pages
Our dynamic pages (routes with `/[param]` structure) are SSR pages by default as the server has no idea what the param is going to be. However, we can convert them to SSG pages by adding a `generateStaticParams` function in `page.tsx` in the dynamic route. In that function, we request the same data that we request in the parent component. Running `yarn build` will show that all SSR pages will now be SSG pages.


### Components on every page
If we want something, for example a navbar, to appear on all of our pages, we can add it to `layout.tsx` in the `src/app` folder.

### Navigation
For navigation, we can use `useRouter` from `next/Navigation`. In earlier versions, it was imported from `next/Router` which was meant for the older layout of the `pages` folder. In newer versions, `next/Navigation` version is used for pages in the `app` component.

## Client side components
Components that utilize `useState` or `useEffect` are client side components. These components must have `'use client';` at the top of the code. Some client side components we have used are

### Not found page
If a page does not exist, we can return a default a default 404 page is rendered. We can customize it by adding a `not-found.tsx` file on the same level as `page.tsx`, for example `src/app/api/[userId]/not-found.tsx`

### Loading and Error pages
Like the notfound page, we can also define a loading and error page. Error page must always be a client component, i.e. it must have `'use client';` at the top of the page.

### Link tag
Link from `next/link` allows us to navigate between pages. We can add `prefetch=false` argument to it to avoid prefetching data. This can help if we are mutating data on an element which opens a new page and we want the data to be consistent. Allows us to keep things in sync between page routes. With router.refresh(), this problem should no longer appear so we may not need to use `prefetch=false`.

### When to use client side components
Client side components must be used in the following scenarios
- When we use event listeners (eq: onClick, onChange) in our components
- When we use hooks like useState(), useReducer(), useEffect(), or other custom hooks that are depending on the state or lifecycle hooks
- When we use browser-only APIs (eq: window, document) or hooks that use these APIs
- When we want to use localStorage in our components.
- Some very particular cases for data fetching for example, when our page doesn't require SEO indexing, when we don't need to pre-render our data, or when the content of our pages needs to update frequently. Unlike the server-side rendering APIs, we can use client-side data fetching at the component level.
For client side data fetching, [the official docs recommend SWR](https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side#client-side-data-fetching-with-swr), rather than `useEffect`.
- Pages that involve user interaction.
  
## Server Side Routes
For server side routes, we can create an api folder, and a folder with the api name inside of it. Add a `route.ts` file in a folder with the API name and define the `GET` or `POST` function in it. This is the server side of our app. Next combines both into a single project.

We create files with `.tsx` extension when we need to use react components. This means that our API should use `.ts` extension. We cannot have `route.ts` and `page.tsx` in the same directory.

The API structure follows the same pattern as next routing so anything in the `api` folder will be available at `https://url:port/api/apiname`

If our API gets data from a different source, for example from a database, we can return `res.json()`. Although this is valid, typescript types might show an error. So we wrap the `res.json()` in `NextResponse.json()` imported from `next/server`.

### CRUD Operations
We can define CRUD operations in `route.ts` file by defining async `GET`, `DELETE`, `POST` and `PUT` methods. These methods accept a request parameter of type `Request`. We can use a `Props` object containing a `params` object in `GET` requests to avoid manual URL parsing. `Request` contains headers and other request parameters which can be `Partial<>` or fully destructured. Body of the `Request` can be accessed through `await request.json()` where `request` is an instance of `Request`.

`NextResponse` provides an abstraction over the API `Response`, and we can send a response using `NextResponse.json()`

### Middleware
We can define `middleware.ts` file in the `src` directory which file which exports a function called `middleware`. We can export a `config` object containing `matcher` key which accepts regex of routes that the middleware applies to. This can be a single path or an array. It accepts concrete paths or regex patterns. `matcher:` `/about/:path*` will match all subroutes of `/about/` whereas `matcher:` `/about/:path` will apply middleware to `/about//a` but not `/about/a/b`.

Alternatively, we can add a condition within the `middleware` function like `if (request.url.includes('/api/){}` to limit the scope of the middleware or make it conditional based on different routes. More on middleware can be found in [docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

Middleware allows us to specify origins from which the requests are allowed. We can block all requests if they do not originate from the specified origins as demonstrated in [Chapter 9](./ch09-middleware/src/middleware.ts). Commented code shows how to block all requests that do not contain origin (for example from thunderclient/postman).

### RateLimiter
We can use `RateLimiter` by installing the `limiter` package. `RateLimiter` config lets us define the number of available tokens for a given interval and the length of the interval.

By setting `fireImmediately: true` in the RateLimiter config, we can conditionally return an error with code 429 to indicate too many requests.

We can have multiple rate limiters or a global rate limiter. We can rate limit only certain paths if we want to.

### NextResponse
The first parameter in the `NextResponse` is the response body, the second parameter contains the status code, status text and headers. In the headers, we can specify the `CORS` policy, `content-type` and other HTTP response headers.

### Revalidation
We can revalidate requests at a specified interval in order to have up to date data.
**Revalidate All Requests** by adding `export const revalidate = 3600` in `layout.js` or `page.tsx`.
**Revalidate Specific Requests** by passing `{ next: { revalidate: 3600 } }` as a second parameter to `fetch()`. This value overrides the global revalidate interval.

We can add `cache="nostore"` in our fetch requests or set `revalidate=0` for always refetching data on refresh.

### On-demand Revalidation
We can trigger manual/on-demand revalidation on all routes by adding a revalidation API in `/app/api/revalidate/route.ts`. More on it can be found [here](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating). 
The code requires a secret token in our env variables, the easiest way to do it is to create one through `crypto.randomBytes(256).toString('hex')`.
This is also demonstrated in [Chapter 12](./ch12-final-project/src/app/revalidate/route.ts)

## General
### Request Deduplication
Next.js automatically deduplicates the requests if same request is performed by multiple items on the page.

### Caching
Next caches data by default. With fetch queries, we can pass an options object with `{cache: 'force-cache'}`. We do not need to do this because this is the default. We can pass the value `no-store` to always refetch the data and never use cache. The better option here is to use ISR (incremental static regenration) by passing `{next: {revalidate: 60}}` to check for updates every 60 seconds. We can add the data revalidation at layout or page levels by adding `export const revalidate = 3600`.

### Helper Functions
On the same level as `app`, we can create a folder called `lib` which contains all of our helper functions like `getAllUsers`. It helps keep our code organized.

## Useful Packages
### Font Awesome Icons
Add `react-icons` dependency to use `font-awesome` icons in the project

### Image Optimization in Production
For production Image Optimization with Next.js, the optional `sharp` package is strongly recommended. Just install it with `yarn add sharp` and it will be automatically used.

### Using Partial types
To extract only certain values from our types, we can use `Partial<>` for example `const {id}:Partial<Todo> = await request.json()`.

### env Variables
We can put env variables in `.env.local` which is automatically added to .gitignore by `yarn create next-app`.

## Markdown
### Compiling Markdown
Provide a markdown source (`.mdx` to allow jsx in markdown) to compileMDX. See [getPostById](./ch12-final-project/src/lib/posts.ts) for usage.

### Markdown code and link formatting
Use `highlight.js`, `rehype-highlight`, `rehype-slug`, `rehype-autolink-headings` to improve markdown rendering. Must be passed to compilemdx. Available themes can be found in `node_modules/highlight.js/styles/`

### Adding YouTube videos
For properly rendering youtube videos within markdown files, install `@tailwindcss/aspect-ratio@latest` package. Create a video component and add the following code to it
```
type Props = {
    id: String
}

export default function Video({id}: Props) {
    return (
        <div className="aspect-w-16 aspect-h-9">
            <iframe 
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            />
        </div>
    )
}
```
Pass this function as a component to `compileMDX` as demonstrated in [getPostById](./ch12-final-project/src/lib/posts.ts).

With this code `<Video id='youtubevideoid'/>` in the markdown file will work correctly.

### Adding images
Create a CustomImage component and add the following code to it

```
import Image from "next/image";

type Props = {
    src: string,
    alt: string,
    priority?: string
}

export default function CustomImage({ src, alt, priority }: Props) {
    const prrty = priority ? true : false;
    return (
        <div className="w-full h-full">
            <Image className="rounded-lg max:auto"
                src={src}
                alt={alt}
                width={650}
                height={650}
                priority={prrty}
            />
        </div>
    )
}
```

Pass this function as a component to `compileMDX` to properly display images. However, for this to work, the `mdx` file must contain a `CustomImage` tag like follows

```
<CustomImage src="yoursource.com" alt="alternate text" />
```
In this case, the `CustomIamge` tag in mdx must contain the entire `https://raw.githubusercontent.com/...` path used in the next.config.js below

We also need to define the image source(s) in `next.config.js` as follows (for example if we are using github to store images).

```
const nextConfig = {
    images: [{
        remotePatterns: [{
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            port: '',
            pathname: '/k-amin07/{repo-name}/{branch-name}/{folder-name}/**
        }]
    }]
}
```
**^The above code did not work for me, however, the following did**
```
const nextConfig = {
    images: {
        domains: ['www.cervantes.to']
    }
}
```

### Tailwind Plugins
Add the following plugins to `tailwind.config.ts` for markdown formatting and markdown video aspect ratio. Install from yarn first.
```
plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
```
These plugins will format the elements that include the `prose` class. The tutorial adds it to `layout.tsx` but that messes up with the vertical timeline. Easiest way to fix is to set `main` className in `layout.tsx` to `<main className="px-4 md:px-6 mx-auto">`. In the files where actual markdown is rendered (for example `src/app/post/[id]/page.tsx`) add the prose and other relevant classes. For example, 

```
return (
        <div className="px-4 md:px-6 mx-auto prose prose-xl prose-slate dark:prose-invert">
            <h2 className="text-3xl mt-4 mb-0">{meta.title}</h2>
            <p className="mt-0 text-sm">{meta.date}</p>
            <article>{content}</article>
            <p className="mb-10">
                <Link href="/">Back to Home</Link>
            </p>
        </div>
    )
```

## Using Mongodb
To use mongodb as a database, install the `mongoose` package. This is not covered in the tutorial but i figured it would be better to use an actual database than a github repo to store the markdown files.

### Connecting to db
Create `dbConnect.ts` file in `/src/lib` and add the code to connect to mongo
```
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''


if (!MONGODB_URI.length) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export default async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}
```

Create a `global.d.ts` file in the root of the project to store global variables. This allows us to have a single instance of mongoose. Add the following code to it

```
import mongoose from "mongoose";

declare global {
    var mongoose: mongoose
}
```

### Schema Definiton
Define the types for data to be stored in mongo in `types.d.ts` file. Then create `/src/models` folder and add corresponding files to it. In Chapter 12, I am using `posts.ts` to define the schema for our posts.

```
import { Schema, model, connect, Model, Mongoose } from 'mongoose';
import mongoose from 'mongoose';
type BlogPostModelType = Model<BlogPost>;

const BlogPostSchema = new Schema<BlogPost, BlogPostModelType>({
    id: String,
    meta: new Schema<Meta>({
        id: String,
        title: String,
        date: String,
        tags: [String]
    }),
    content: String
})

export const BlogPostModel = mongoose.models.BlogPost ||  model<BlogPost, BlogPostModelType> ('BlogPost', BlogPostSchema);

```

### Querying the Db
In [`src/lib/posts`](./ch12-final-project/src/lib/posts.ts), import dbConnect and in `getPostById` function do the following
- `await dbConnect()` to ensure we have an active connection
- Import the model, in this case `BlogPostModel` and use `await model.findOne({param:value})`
- To get only a specific key, run `await model.find({},'keyName')`. Useful in generating metadata.

### Creating a document
To create a document, use `model.create`, for example, in our blogPostModel, the code looks like this
```
const id = await generateId()
await BlogPostModel.create({
    id: id.toString(),
    meta: {
        id: id.toString(),
        title: "some title",
        date: "2023-08-19",
        tags: ["tag1", "tag2"]
    },
    content: "We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.",
})
```
`generateId` function is exported from `dbConnect.ts` which returns `new mongoose.Types.ObjectId()`

### Exposing env Variables to client side code
Apparently, `NEXT_PUBLIC_` prefix is required for env variables used by client side code (for example `NEXT_PUBLIC_API_KEY`)
