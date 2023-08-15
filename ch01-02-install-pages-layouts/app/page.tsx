import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}


export default function Home() {
  return (
    <main>
      <h1>Hello World</h1>
      <Link href="/about">Go To About Page</Link>
    </main>
  )
}
