export default async function getWikiResults(searcTerm: string) {
    // these search params are from the wikipedia API
    const searchParams = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: searcTerm,
        gsrlimit: '20',
        prop: 'pageimages|extracts',
        exchars: '100',
        exintro: 'true',
        explaintext: 'true',
        exlimit: 'max',
        format: 'json',
        origin: '*'
    })

    const response = await fetch("https://en.wikipedia.org/w/api.php?" + searchParams)

    return response.json()
}

// we need to define the search result type in types.d.ts file. These are from wikipedia API so just copy pasting them.