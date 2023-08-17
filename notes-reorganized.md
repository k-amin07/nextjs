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

## General
### Request Deduplication
Next.js automatically deduplicates the requests if same request is performed by multiple items on the page.

### Caching
Next caches data by default. With fetch queries, we can pass an options object with `{cache: 'force-cache'}`. We do not need to do this because this is the default. We can pass the value `no-store` to always refetch the data and never use cache. The better option here is to use ISR (incremental static regenration) by passing `{next: {revalidate: 60}}` to check for updates every 60 seconds. We can add the data revalidation at layout or page levels by adding `export const revalidate = 3600`.

### Helper Functions
On the same level as `app`, we can create a folder called `lib` which contains all of our helper functions like `getAllUsers`. It helps keep our code organized.

## Useful Packages
### Formatting markdowns
`@tailwindcss/typography` helps formatting markdown. Install with `yarn add @tailwindcss/typography --dev`

### Font Awesome Icons
Add `react-icons` dependency to use `font-awesome` icons in the project

### Image Optimization in Production
For production Image Optimization with Next.js, the optional `sharp` package is strongly recommended. Just install it with `yarn add sharp` and it will be automatically used.

### Using Partial types
To extract only certain values from our types, we can use `Partial<>` for example `const {id}:Partial<Todo> = await request.json()`.

### env Variables
We can put env variables in `.env.local` which is automatically added to .gitignore by `yarn create next-app`.