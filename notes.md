- Start off with yarn, run `yarn create next-app /path/to/next/app`. The path can be replaced with a '.' to use the current directory.
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