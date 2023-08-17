import { NextResponse } from "next/server";

import { limiter } from "../../config/limiter";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos/"

type Props = {
    params: {
        id: string
    }
}

export async function GET(request: Request, { params: { id }}: Props) {
    // const id = request.url.slice(request.url.lastIndexOf("/") + 1)
    const remaining = await limiter.removeTokens(1)

    console.log({remaining})

    if(remaining < 0) {
        return new NextResponse(null,{
            status: 429,
            statusText: "Too Many Requests",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "text/plain"
            }
        })
    }

    const response = await fetch(`${DATA_SOURCE_URL}/${id}`);
    const todo: Todo = await response.json();

    if(!todo.id) {
        return NextResponse.json({"message": "Todo Not Found"})
    }

    return NextResponse.json(todo);
}