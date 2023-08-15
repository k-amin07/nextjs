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
- Running `yarn build` generates an optimized
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