import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";
import transition from "../../components/anim/Transitions";

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

const animOffset = 0;

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
        },
        revalidate: 10
    }
}

export default function TeamPage({ directorInfo }) {
    const instagramLinkPrefix = "https://www.instagram.com/";
    const instagramUsername = directorInfo.igLink.slice(instagramLinkPrefix.length, -1);

    return (
        <Layout noAnim name={directorInfo.name}>
            <div className="py-24 w-full">
                <motion.div
                    initial={{
                        x: "-40px",
                        opacity: 0
                    }}
                    animate={{
                        x: 0,
                        opacity: 1,
                        transition: { delay: animOffset + 0.6, ...transition }
                    }}
                    exit={{
                        x: "-40px",
                        opacity: 0,
                        transition: { delay: 0, duration: 0.6, ...transition }
                    }}
                >
                    <Link href="/team">
                        <a className="text-blue-500 text-lg group ml-8 md:ml-16">
                            ← <span className="group-hover:underline">Back</span>
                        </a>
                    </Link>
                </motion.div>

                <div className="flex flex-col px-16 md:px-24">
                    <div className="flex flex-col md:flex-row lg:justify-between mt-6 gap-12 xl:w-3/4 self-center">
                        <div className="flex flex-col items-center gap-4 lg:w-1/4">
                            <motion.div
                                initial={{
                                    scale: 1.5,
                                    x: 25,
                                    y: 25,
                                    opacity: 0
                                }}

                                animate={{
                                    scale: 1,
                                    x: 0,
                                    y: 0,
                                    transition: { delay: animOffset, duration: 0.6, ...transition },
                                    opacity: 1
                                }}

                                exit={{
                                    scale: 1.5,
                                    x: 25,
                                    y: 25,
                                    opacity: 0,
                                    transition: { delay: 0, duration: 0.4, ...transition },
                                }}
                            >
                                <Image
                                    src={directorInfo.image.src}
                                    width={350}
                                    height={350}
                                    placeholder="blur"
                                    blurDataURL={directorInfo.image.blurDataURL}
                                    alt="Director portrait"
                                    className="drop-shadow-lg"
                                />
                            </motion.div>

                            <motion.h2
                                className="text-2xl lg:text-3xl font-bold"
                                initial={{
                                    x: "-50px",
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { delay: animOffset + 0.6, duration: 0.6, ...transition }
                                }}
                                exit={{
                                    x: "-50px",
                                    opacity: 0,
                                    transition: { delay: 0, duration: 0.6, ...transition }
                                }}
                            >
                                {directorInfo.name}
                            </motion.h2>

                            <motion.div
                                className="flex flex-col gap-1 items-center md:items-start"
                                initial={{
                                    x: "-50px",
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { delay: animOffset + 0.8, duration: 0.6, ...transition }
                                }}
                                exit={{
                                    x: "-50px",
                                    opacity: 0,
                                    transition: { delay: 0, duration: 0.6, ...transition }
                                }}
                            >
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
                            </motion.div>
                        </div>

                        <div className="flex flex-col gap-4 w-full xl:w-2/3 mt-4">
                            <motion.h1
                                className="text-4xl font-semibold text-center md:text-left"
                                initial={{
                                    x: "100px",
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { delay: animOffset + 0.6, ...transition }
                                }}
                                exit={{
                                    x: "100px",
                                    opacity: 0,
                                    transition: { delay: 0, duration: 0.6, ...transition }
                                }}
                            >
                                {directorInfo.position}
                            </motion.h1>

                            <motion.hr
                                initial={{
                                    scale: 0,
                                }}

                                animate={{
                                    scale: 1,
                                    transition: { delay: animOffset + 0.2, duration: 0.4, ...transition },
                                }}

                                exit={{
                                    scale: 0,
                                    transition: { delay: 0, duration: 0.4, ...transition },
                                }}
                                style={{
                                    transformOrigin: "center left"
                                }}
                            />

                            <motion.p
                                className="text-lg text-gray-500 font-normal leading-8 text-center md:text-left"
                                initial={{
                                    x: "100px",
                                    opacity: 0
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: { delay: animOffset + 0.7, ...transition }
                                }}
                                exit={{
                                    x: "100px",
                                    opacity: 0,
                                    transition: { delay: 0, duration: 0.6, ...transition }
                                }}
                            >
                                {directorInfo.description}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
