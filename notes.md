- Start off with yarn, run `yarn create next-app /path/to/next/app`. The path can be replaced with a '.' to use the current directory.
  - Generally, we want to use Typescript, ESLint, Tailwind CSS, App Router and not customize the import alias.
  - If we opt to use the `src/` directory, we'd get `src/app` folder, otherwise we'd get `app/` folder at the root of the project.
- Create a `types.d.ts` file in the root of the project. Here define the all the types. This is very similar to graphql typedefs.
- In the `app` folder, create a folder for each route. For example `./app/users`.
- Each route has a `page.tsx` file containing the following
  - A default export function that defines what the page does.
  - An optional metadata export of type Metadata (imported from next) which contains title and description of the page.
  - Alternatively an optional `generateMetadata` function which accepts the same parameters as the default export function and dynamically generates metadata.
- Next.js automatically deduplicates the requests if same request is performed by multiple items on the page.
- Each route can contain dynamic subroutes which are generated based on a parameter. The syntax is to use square brackets with the parameter name. For instance, to generate a page for each user, we can create `./app/users/[userId]`
  - Each subroute contains its own `page.tsx` with its own metadata and its own defualt export.
  - Each routes can also contain its components, which are sort of helper functions to generate various parts of the page.
- For routes, we define params, i.e. the parameters that the route can accept for example
  ```
    type Params = {
        params: {
            userId: string
        }
    }
    export default async function UserPage({params: {userId}}: Params) {}
  ```
  Here, the route accepts userId as a parameter.
- For components, we define props, i.e. the parameters that the function accepts. For example
  ```
    type Props = {
        promise: Promise<Post[]>
    }
    export default async function UserPosts({promise}:Props) {}
  ```
- On the same level as `app`, we can create a folder called `lib` which contains all of our helper functions like `getAllUsers`. 
- If a function returns something, we add a semicolon followed by the return type to the function definition.
- We can use `Suspense` from react to provide feedback while a promise is being resolved.
- Running `yarn build` generates an optimized deployment ready build
- Next caches data by default. In `getUserPosts`, we are using a fetch query. We can pass an options object with `{cache: 'force-cache'}`. We do not need to do this because this is the default.
  - We can pass the value `no-store` to always refetch the data and never use cache.
  - The better option is to use ISR (incremental static regenration), in the options object, pass `{next: {revalidate: 60}}` so it checks for updates every 60 seconds. Refer to [getUserPosts](./ch03-fetching-data/lib/getAllUsers.tsx)
  - We can add the data revalidation at layout or page levels.
- Our `./app/users/[userId]` pages are currently SSR pages (server side rendered pages) because we have this dynamic folder `[userId]`. Next has no idea what this `userId` is going to be passed as a parameter. We can actually tell NextJS what those possible parameters would be and that would turn our SSR pages into the recommended SSG pages.
  - Go to page.tsx in [`./app/users/[userId]`](./ch04-ssg-ssr-isr/app/users/[userId]/page.tsx) and add a function `generateStaticParams` and request the same data i.e. getAllUsers in this case which is actually called by the parent component, next will deduplicate automatically.
  - In generateStaticParams method, we need to parse user.id to string because parameters are always string type.
  - If we run yarn build, we would be able to see that all SSR pages are now SSG pages
  - If we open a user page now, there will be no loading since all of the data is already available.
- If a page does not exist, we can return a default 404 page as demonstrated in [`./app/users/[userId]`](./ch04-ssg-ssr-isr/app/users/[userId]/not-found.tsx). We would also have to change `getUser` function in lib to return undefined if user is not found. Now if we go to `localhost:3000/users/1000`, we would see a 404 not found page.
- Link from `next/link` allows us to navigate between pages. We can add `prefetch=false` argument to it to avoid prefetching data.
  - This can help if we are mutating data on an element which opens a new page and we want the data to be consistent.
  - Allows us to keep things in sync between page routes.
  - With router.refresh(), this problem should no longer appear so we may not need to use `prefetch=false`.
- If we want something, for example a navbar, to appear on all of our pages, we can add it to `layout.tsx` in the app folder.
- When using tailwind, globals.css has some effects applied to the body, we may want to remove them.
- To create a client side component, add `'use client` in the file. An example of this is the `error` component in about section of the [first chapter](./ch01-02-install-pages-layouts/app/about/error.tsx)
  - We can use a client component inside a server component as we did with the search component (client side) inside Navbar (server side) in [chapter five](./ch05-small-project/app/components/Navbar.tsx)
- For navigation, we can use `useRouter` from `next/Navigation`. In earlier versions, it was imported from `next/Router` which was meant for the older layout of the `pages` folder. In newer versions, `next/Navigation` version is used for pages in the `app` component.
- `@tailwindcss/typography` helps formatting markdown. Install with `yarn add @tailwindcss/typography --dev`
- Add `react-icons` dependency to use `font-awesome` icons in the project
- For production Image Optimization with Next.js, the optional `sharp` package is strongly recommended. Just install it with `yarn add sharp` and it will be automatically used.
- For server side routes, we can create an api folder, and a folder with the api name inside of it. Add a `route.ts` file in a folder with the API name and define the `GET` or `POST` function in it. This is the server side of our app. Next combines both into a single project.
  - We create files with `.tsx` extension when we need to use react components. This means that our API should use `.ts` extension. This is demonstrated in [chapter seven](./ch07-route-handlers/src/app/api/hello/route.ts)
  - The API structure follows the same pattern as next routing, in the above example, the hello api will be available at `localhost:3000/api/hello`
  - We cannot have `route.ts` and `page.tsx` in the same directory.
  - If our API gets data from a different source, for example from a database, we can return `res.json()`. Although this is valid, typescript types might show an error. So we wrap the `res.json()` in `NextResponse.json()` imported from `next/server`. This is demonstrated in the [hello-json api](./ch07-route-handlers/src/app/api/hello-json/route.ts)
- Client Side Pages that include user interaction must include `'use client'`
- To extract only certain values from our types, we can use `Partial<>` for example `const {id}:Partial<Todo> = await request.json()`.
- We can put env variables in `.env.local` which is automatically added to .gitignore by `yarn create next-app`.
- GET request can receive
  - No parameter
  - the `Request` object as the first parameter
  - `Props` object containing a `params` object as the second parameter, which allows us to avoid string manipulation. Demonstrated in [chapter 9](./ch09-middleware/src/app/api/todos/[id]/route.ts)
- We can add a middleware in the `src` directory by creating a `middleware.ts` file which exports a function called `middleware`.
  - If we declare it in the `src` directory, every single request will be passed through the middleware.
  - we can export a config object containing `matcher` key which accepts regex of routes that the middleware applies to. This can be a single path or an array. It accepts concrete paths or regex patterns.
  - For instance, we can define `matcher:` `/about/:path` to accept `/about/a`, `about/b` etc but it wouldnt match `about/a/b`
  - `matcher:` `/about/:path*` will match all subroutes as well.
- Alternatively, we can add a condition within the `middleware` function like `if (request.url.includes('/api/){}` to limit the scope of the middleware or make it conditional based on different routes.
- We can use `RateLimiter` by installing the `limiter` package. We can see that in action in [todos api in Chapter 9](./ch09-middleware/src/app/api/todos/[id]/route.ts)
  - If we do not set `fireImmediately: true` when initializing rate limiter, it will wait until tokens are available to process the request.
  - If we do set `fireImmediately: true`, we can add a condition to return error code 429 too many requests.
  - The first parameter in the `NextResponse` is the response body, the second parameter contains the status code, status text and headers.
- We can add the allowed origins to the middleware like in [middleware in chapter 9](./ch09-middleware/src/middleware.ts)
  - If we want to block requests from places that do not include an origin at all (like postman or thunderclient), we can add a condition for that as well (see commented code in the linked file.)
- In production builds (yarn build) we can revalidate all requests by adding `export const revalidate = 3600` in `layout.js` / `page.tsx`. We can revalidate particular fetch requests by passing `fetch('https://...', { next: { revalidate: 3600 } })`.
  - This means that data is revalidated on server every x seconds. For example, in chapter 6, if we add a new blogpost to the [`blogposts`](./ch06-blog-website/blogposts/) directory when the server is running, when a user refreshes the page, updated data will be available to them, provided the revalidation period has passed.
  - We can trigger manual/on-demand revalidation by adding `/app/api/revalidate/route.ts` with the following code (taken from docs)
    ```
    import { NextRequest, NextResponse } from 'next/server'
    import { revalidateTag } from 'next/cache'
    
    // e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`
    export async function POST(request: NextRequest) {
      const secret = request.nextUrl.searchParams.get('secret')
      const tag = request.nextUrl.searchParams.get('tag')
    
      if (secret !== process.env.MY_SECRET_TOKEN) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
      }
    
      if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
      }
    
      revalidateTag(tag)
    
      return NextResponse.json({ revalidated: true, now: Date.now() })
    }
    ```
  - For this code to work, we need to add a secret token in our env variables (for example by generating one through `crypto.randomBytes(256).toString('hex')`) and then send a POST request to the route with this token. Now when the client refreshes, they'll see the updated data.
  - More can be found in [docs](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
  - We can add `cache="nostore"` in our fetch requests or set `revalidate=0` for always refetching data on refresh.
  - Note: This is chapter 10 of the video but I have not included that in the code.
- highlight.js rehype-highlight rehype-slug rehype-autolink-headings can be used to better format markdowns using compilemdx, used in Chapter 12.
  - highlight.js provides code snippet themes, available themes can be found in `node_modules/highlight.js/styles/`