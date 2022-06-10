import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'

import HeroImage from '../imgs/everyone.png'
import Logo from '../imgs/logo.png'

export default function Home() {
  return (
    <Layout>
      <header className="h-screen relative">
        {/* Background image using Next.js Image, taken from here: https://github.com/vercel/next.js/discussions/18357#discussioncomment-132523 */}
        <Image
          src={HeroImage}
          placeholder="blur"
          objectFit="cover"
          objectPosition="center"
          alt="Hero Image"
          layout="fill"
          quality={100}
          priority={true}
        />

        <div className="relative z-1 h-screen flex items-center justify-center">
          <div className="mx-2 text-center">
            <Image src={Logo} width={209} height={75} objectFit="contain" placeholder="blur" quality={100} alt="Logo" />

            <h1 className="font-bold mt-4 text-3xl xs:text-4xl md:text-5xl">
              <span className="text-white">Mississauga Youth Action Committee</span>
            </h1>
            
            <h2 className=" text-lg xs:text-xl md:text-2xl mt-2">
              <span className="text-white">
                We represent the youth of Mississauga. We help, engage, and empower.
              </span>
            </h2>

            <Link href="/gallery">
              <button className='bg-blue-500 px-4 py-3 font-medium text-white text-xl rounded-md mt-8'>
                View Gallery
              </button>
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  )
}
