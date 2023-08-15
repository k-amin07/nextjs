import Link from "next/link"
import { FaLinkedin, FaGithub, FaEnvelope, FaMedium } from 'react-icons/fa'
export default function Navbar() {
  return (
    // classname sticky here makes the navbar stick to the top of the page
    <nav className="bg-slate-600 p-4 sticky top-0 drop-shadow-xl z-10">
        <div className="prose prose-xl mx-auto flex justify-between flex-col sm:flex-row">
            <h1 className="text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0">
                {/* This centers the name on smaller devices */}
                <Link href="/" className="text-white/90 no-underline hover:text-white">
                    {/* The className text-white/90 means 90 percent opacity so that hover:text-white will make it a little bit brighter 
                        no-underline removes the underline from the link
                        The prose class ensures that the div is only as wide as the content on the screen.
                        The name will not be all the way to the left in this config
                    */}
                    Khizar Amin
                </Link>
            </h1>
            <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 text-white text-4xl lg:text-5xl">
                  <Link className="text-white/90 no-underline hover:text-white" href="https://www.linkedin.com/in/k-amin07" target="_blank"><FaLinkedin /></Link>
                  <Link className="text-white/90 no-underline hover:text-white" href="mailto:khizaramin95@gmail.com" target="_blank"><FaEnvelope/></Link>
                  <Link className="text-white/90 no-underline hover:text-white" href="https://www.github.com/k-amin07" target="_blank"><FaGithub /></Link>
                  <Link className="text-white/90 no-underline hover:text-white" href="https://medium.com/@khizaramin95" target="_blank"><FaMedium /></Link>
            </div>
        </div>
    </nav>
  )
}
