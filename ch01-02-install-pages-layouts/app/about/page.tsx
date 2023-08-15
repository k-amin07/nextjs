import Link from "next/link"

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  // throw new Error('Error in About Page')
  return (
    <>
        <h1>About</h1>
        <Link href="/">Link To Home Page</Link>
    </>
  )
}
