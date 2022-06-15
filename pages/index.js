import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'

import HeroImage from '../imgs/everyone.jpg'
import SummaryImage from '../imgs/summary.jpg'
import ConnectImage from '../imgs/connect.jpg'
import Logo from '../imgs/logo.png'

import { HiOutlineSpeakerphone, HiOutlineDocumentDuplicate, HiOutlineRefresh } from "react-icons/hi"

export default function Home() {
  return (
    <Layout name="Home">
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
              <button className='bg-blue-500 hover:bg-blue-700 transition-all duration-150 px-4 py-3 font-medium text-white text-xl rounded-md mt-8'>
                View Gallery
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex p-10 flex-col items-center lg:p-20 items-left py-36">
        <div className="flex flex-col text-center">
          <h3 className="text-lg text-blue-500">By the youth, for the youth</h3>
          <h1 className="text-4xl text-black font-bold">Our Objectives</h1>
        </div>

        <div className="w-full xl:w-5/6 grid grid-cols-1 lg:grid-cols-3 p-10 justify-between items-center text-center lg:text-left lg:items-start gap-4">
          <div className="flex flex-col p-4 gap-4 items-center lg:items-start">
            <div className="flex items-center justify-center text-2xl text-white bg-blue-50 w-12 h-12 rounded-lg">
              <HiOutlineSpeakerphone className='text-blue-500' />
            </div>

            <h1 className="text-3xl font-bold">Consult all youth</h1>
            <p className="text-lg text-gray-600">
              MYAC actively consults youth and youth groups across the city to collectively determine the voice and vision of youth across Mississauga.
            </p>
          </div>

          <div className="flex flex-col p-4 gap-4 items-center lg:items-start">
            <div className="flex items-center justify-center text-2xl text-white bg-blue-50 w-12 h-12 rounded-lg">
              <HiOutlineDocumentDuplicate className='text-blue-500' />
            </div>

            <h1 className="text-3xl font-bold">Resources and Development</h1>
            <p className="text-lg text-gray-500">
              MYAC provides resources and professional development to youth in Mississauga who are engaged in student leadership opportunities through the ambassador program and monthly connects.
            </p>
          </div>

          <div className="flex flex-col p-4 gap-4 items-center lg:items-start">
            <div className="flex items-center justify-center text-2xl text-white bg-blue-50 w-12 h-12 rounded-lg">
              <HiOutlineRefresh className='text-blue-500' />
            </div>

            <h1 className="text-3xl font-bold">Volunteer Opportunities</h1>
            <p className="text-lg text-gray-600">
              MYAC provides volunteer opportunities to youth, and encourages volunteerism and student leadership within Mississauga.
            </p>
          </div>
        </div>
      </div>

      <div className="flex p-10 flex-col items-center lg:flex-row lg:p-20 xl:p-40 lg:items-left bg-gray-50">
        <div className="flex flex-col items-center lg:items-start w-4/5 text-center lg:text-left mb-4 lg:mb-0">
          <h3 className="text-lg text-blue-500">We are the Mississauga Youth Action Committee</h3>
          <h1 className="text-5xl text-black font-bold">Empowering Youth</h1>

          <p className="text-xl text-gray-400 font-light mt-2 w-3/4">
            As a youth extension of the City of Mississauga, we represent the 145 000+ youths in the city. We help, engage, and empower.
          </p>

          <div className='my-4'>
            <Link href="/constitution.pdf">
              <button className='px-6 py-3 border-sky-700 text-sky-700 border rounded-lg font-medium text-lg'>
                Our Constitution
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-col w-3/4">
          <Image className="filter duration-75 rounded-lg" src={SummaryImage} alt="Placeholder" objectFit="cover" objectPosition="center" quality={100} placeholder="blur" />
        </div>
      </div>

      <div className="flex p-10 flex-col items-center lg:flex-row-reverse lg:p-20 xl:p-40 lg:items-center justify-between bg-white">
        <div className="flex flex-col items-center lg:items-end w-4/5 text-center lg:text-right mb-4 lg:mb-0 lg:ml-16">
          <h3 className="text-lg text-blue-500">Always Up To Something</h3>
          <h1 className="text-5xl text-black font-bold">MYAC Connects</h1>

          <p className="text-xl text-gray-400 font-light mt-2 w-3/4">
            MYAC Connects are a great way to meet new people and get involved in your community. Come out on the second Wednesday of every month to meet new people, network, and find new opportunities.
          </p>

          <div className='my-4'>
            <Link href="/events">
              <button className='px-6 py-3 border-sky-700 text-sky-700 border rounded-lg font-medium text-lg'>
                View Our Events →
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-col w-3/4">
          <Image className="filter duration-75 rounded-lg" src={ConnectImage} alt="Placeholder" objectFit="cover" objectPosition="center" quality={100} placeholder="blur" />
        </div>
      </div>
    </Layout>
  )
}
