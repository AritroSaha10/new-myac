import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";
import transition from "../../components/anim/Transitions";

import airtableDB from "../../db/airtable";

import Layout from "../../components/Layout";

export async function getStaticPaths(context) {
    const records = await airtableDB("Gallery").select({
        fields: ["GalleryLink"],
    }).all();

    const routes = records.map(record => (
        {
            params: {
                route: record.fields.GalleryLink
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

    const records = await airtableDB("Gallery").select({
        fields: ["Name", "Date", "GalleryLink", "Photos", "CompressedPhotos"]
    }).all();

    const albumRecords = records.filter(record => record.fields.GalleryLink === recordRoute);

    if (albumRecords.length == 0) {
        // No album record to be found
        return {
            notFound: true
        }
    }


    const albumRecord = albumRecords[0].fields;

    const albumInfo = {
        name: albumRecord.Name,
        date: albumRecord.Date,
        route: albumRecord.GalleryLink,
        images: albumRecord.CompressedPhotos.map(image => ({
            src: image.url,
            width: image.width,
            height: image.height,
            blurDataURL: image.thumbnails.small.url
        }))
    };


    return {
        props: {
            albumInfo: albumInfo
        },
        revalidate: 10
    }
}

export default function AlbumPage({ albumInfo }) {
    return (
        <Layout name={albumInfo.name}>
            <div className="p-24 lg:px-48 w-full">
                <Link href="/gallery">
                    <a className="text-blue-500 text-lg group">
                        ← <span className="group-hover:underline">Back</span>
                    </a>
                </Link>

                <h1 className="text-4xl font-bold mt-4">{albumInfo.name}</h1>
                <h3 className="text-xl text-gray-400 mb-4">{albumInfo.date}</h3>

                <motion.div
                    className="columns-1 md:columns-2 lg:columns-3 gap-8"
                    initial={{
                        opacity: 0,
                        y: 60,
                        scale: 1.0
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.5,
                            ...{ transition }
                        }
                    }}
                    exit={{
                        opacity: 0,
                        y: 60,
                        transition: {
                            duration: 0.5,
                            ...{ transition }
                        }
                    }}
                >
                    {albumInfo.images.map((img, i) =>
                        <motion.div
                            className="mb-4"
                            key={i}
                            initial={{
                                opacity: 0,
                                y: 60,
                                scale: 1.0
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: i * 0.2,
                                    ...{ transition },
                                    duration: 0.5,
                                }
                            }}
                            exit={{
                                opacity: 0,
                                y: 60,
                                transition: {
                                    delay: 0.15, // Maximum 3 in a row, modulo done in order to speed up transitions
                                    ...{ transition },
                                    duration: 0.5,
                                }
                            }}
                            whileHover={{
                                scale: 1.03,
                                transition: {
                                    ease: "easeInOut",
                                    duration: 0.15
                                }
                            }}
                        >
                            <Image src={img} placeholder="blur" quality={60} alt="Album img" className="inline-block rounded-lg" />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </Layout>
    );
}