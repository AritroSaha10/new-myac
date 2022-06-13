import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/Layout";
import airtableDB from "../../db/airtable";
import { FiMail, FiInstagram } from "react-icons/fi"

export async function getStaticPaths(context) {
    const records = await airtableDB("Team").select({
        fields: ["Route"],
    }).all();

    const routes = records.map(record => (
        {
            params: {
                route: record.fields.Route
            },
        }
    ))

    return {
        paths: routes,
        fallback: 'blocking'
    };
}

// Convert undefined values to null (required for nextjs props)
// Should be used for fields that might not be there
const undefinedToNull = param => param !== undefined ? param : null;

export async function getStaticProps({ params }) {
    const recordRoute = params.route;

    const records = await airtableDB("Team").select({
        fields: ["Name", "Position", "Bio", "Email", "Instagram Link", "Avatar", "Route"]
    }).all();

    const directorRecords = records.filter(record => record.fields.Route === recordRoute);

    if (directorRecords.length == 0) {
        // No director record to be found
        return {
            notFound: true
        }
    }

    
    const directorRecord = directorRecords[0];
    
    const directorInfo = {
        name: directorRecord.fields.Name,
        position: directorRecord.fields.Position,
        description: directorRecord.fields.Bio,
        email: undefinedToNull(directorRecord.fields.Email),
        igLink: undefinedToNull(directorRecord.fields["Instagram Link"]),
        image: {
            src: directorRecord.fields.Avatar[0].url,
            blurDataURL: directorRecord.fields.Avatar[0].thumbnails.small.url
        }
    }

    return {
        props: {
            directorInfo: directorInfo
        }
    }
}

export default function TeamPage({ directorInfo }) {
    const instagramLinkPrefix = "https://www.instagram.com/";
    const instagramUsername = directorInfo.igLink.slice(instagramLinkPrefix.length, -1);

    return (
        <Layout>
            <div className="py-24 w-full">
                <Link href="/team">
                    <a className="text-blue-500 text-lg group ml-8 md:ml-16">
                        ← <span className="group-hover:underline">Back</span>
                    </a>
                </Link>

                <div className="flex flex-col px-16 md:px-24">
                    <div className="flex flex-col sm:flex-row lg:justify-between mt-6 gap-12 xl:w-3/4 self-center">
                        <div className="flex flex-col items-center gap-4 lg:w-1/4">
                            <Image
                                src={directorInfo.image.src}
                                width={250}
                                height={250}
                                placeholder="blur"
                                blurDataURL={directorInfo.image.blurDataURL}
                                alt="Director portrait"
                                className="drop-shadow-lg"
                            />

                            <h2 className="text-2xl lg:text-3xl font-bold">{directorInfo.name}</h2>
                            <div className="flex flex-col gap-1 items-start">
                                {directorInfo.email &&
                                    <a className="flex items-center gap-1" href={`mailto:${directorInfo.email}`} target="_blank" rel="noreferrer">
                                        <FiMail /> <span className="text-blue-600 hover:underline">{directorInfo.email}</span>
                                    </a>
                                }
                                {directorInfo.igLink &&
                                    <a className="flex items-center gap-1" href={`https://www.instagram.com/${instagramUsername}`} target="_blank" rel="noreferrer">
                                        <FiInstagram /> <span className="text-blue-600 hover:underline">{instagramUsername}</span>
                                    </a>
                                }
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full xl:w-2/3 mt-4">
                            <h1 className="text-4xl font-semibold">{directorInfo.position}</h1>
                            <hr />
                            <p className="text-lg text-gray-500 font-normal leading-8">
                                {directorInfo.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}