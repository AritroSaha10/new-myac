import Layout from "../../components/Layout";

import Image from "next/image";
import Link from "next/link";

import TeamImage from "../../imgs/team.png"
import SampleImage from "../../imgs/sample-highres.jpg"

import airtableDB from "../../db/airtable";

export async function getStaticProps(context) {
    let boardOfDirectorsInfo = [];

    const records = await airtableDB("Team").select({
        fields: ["Name", "Position", "Route", "Avatar"],
        sort: [{ field: "Rank", direction: "asc" }],
    }).all();
    
    records.map(({ fields }) => {
        const portrait = fields.Avatar[0];

        boardOfDirectorsInfo.push({
            name: fields.Name,
            position: fields.Position,
            image: portrait.url,
            blurDataURL: portrait.thumbnails.small.url,
            route: fields.Route
        })
    })

    return {
        props: {
            boardOfDirectorsInfo: boardOfDirectorsInfo
        },
        revalidate: 10
    }
}

export default function TeamPage({ boardOfDirectorsInfo }) {
    return (
        <Layout name="Team">
            <header className="h-[30vh] lg:h-[44vh] relative">
                {/* Background image using Next.js Image, taken from here: https://github.com/vercel/next.js/discussions/18357#discussioncomment-132523 */}
                <Image
                    src={TeamImage}
                    placeholder="blur"
                    objectFit="cover"
                    objectPosition="center top"
                    alt="Hero Image"
                    layout="fill"
                    className="saturate-150"
                    quality={100}
                />
            </header>

            <div className="flex p-24 flex-col items-center items-left">
                <div className="flex flex-col text-center">
                    <h3 className="text-lg text-blue-500">The people who make it happen</h3>
                    <h1 className="text-5xl lg:text-5xl text-black font-bold">MYAC Board of Directors</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-16 md:p-24 lg:p-36 pt-0 md:pt-0 lg:pt-0 gap-8 md:gap-16">
                {boardOfDirectorsInfo.map(({ name, position, image, route, blurDataURL }) => (
                    <Link href={`/team/${route}`} key={route}>
                        <a>
                            <Image 
                                src={image} 
                                height={700} 
                                width={700} 
                                objectFit="cover" 
                                objectPosition="center" 
                                alt="Sample image" 
                                placeholder="blur"
                                blurDataURL={blurDataURL}
                            />
                            <h1 className="text-3xl font-bold text-gray-800 mt-4">{position}</h1>
                            <h1 className="text-xl font-semibold text-gray-500 my-1">{name}</h1>
                        </a>
                    </Link>
                ))}
            </div>
        </Layout>
    )
}