import Posts from "./components/Posts";
import MyProfilePic from './components/MyProfilePic'

export default function Home() {
  return (
    <main className="px-6 mx-auto">
      <MyProfilePic />
      <p className="mt-12 mb-12 text-3xl text-center dark:text-white">
        Hello and Welcome 👋&nbsp;
        <span className="whitespace-nowrap">
          I'm <span className="font-bold">Khizar</span>
        </span>
      </p>
      <Posts />
    </main>
  )
}
