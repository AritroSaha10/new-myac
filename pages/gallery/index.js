import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import { FiLink2 } from "react-icons/fi";

import Layout from "../../components/Layout";
import airtableDB from "../../db/airtable";
import cacheAirtablePhoto from "../../util/cacheAirtablePhoto";

import ConnectImage from "../../imgs/connect.jpg"

export async function getStaticProps() {
    let galleryInfo = [];

    const records = await airtableDB("Gallery").select({
        fields: ["Name", "Date", "GalleryLink", "Thumbnail"],
        sort: [{ field: "Date", direction: "desc" }],
    }).all();

    await Promise.all(records.map(async ({ fields, id }) => {
        const [thumbnailFile, thumbnailBlurDataFile] = await cacheAirtablePhoto(fields.Thumbnail[0], id, "Gallery", new Date(fields["Last Pohotos Edited Time"]), "Thumbnail CDN Link", "Thumbnail Blur CDN Link")

        galleryInfo.push({
            name: fields.Name,
            date: fields.Date,
            route: fields.GalleryLink,
            thumbnail: {
                src: thumbnailFile.publicUrl(),
                blurDataURL: thumbnailBlurDataFile.publicUrl(),
                width: fields.Thumbnail[0].width,
                height: fields.Thumbnail[0].height
            }
        })
    }))

    return {
        props: {
            galleryInfo: galleryInfo
        },
        revalidate: 10
    }
}

export default function GalleryIndex({ galleryInfo }) {
    return (
        <Layout name="Gallery">
            <header className="h-[30vh] lg:h-[44vh] relative">
                {/* Background image using Next.js Image, taken from here: https://github.com/vercel/next.js/discussions/18357#discussioncomment-132523 */}
                <Image
                    src={ConnectImage}
                    placeholder="blur"
                    objectFit="cover"
                    objectPosition="center top"
                    alt="Hero Image"
                    layout="fill"
                    className="saturate-150"
                    quality={100}
                />
            </header>

            <div className="flex p-16 flex-col items-center items-left">
                <div className="flex flex-col text-center">
                    <h3 className="text-lg text-blue-500">Memories from our events</h3>
                    <h1 className="text-5xl lg:text-5xl text-black font-bold">Gallery</h1>
                </div>
            </div>

            <div className="p-8 pt-0 md:pb-16">
                
                {galleryInfo.length === 0 ? (
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-5xl text-gray-600 font-medium text-center mb-4">
                            No albums found
                        </h1>
                        <h3 className="text-xl text-gray-600 font-light text-center md:w-1/2 lg:w-1/3">
                            Sorry, there seems to be no albums as of now. Try coming
                            back later to find new galleries!
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:px-16 xl:px-32">
                        {galleryInfo.map(album => (
                            <div key={album.name}> {/* Wrapper div to allow the cards to resize themselves */}
                                <div className="flex flex-col p-4 gap-2">
                                    <Image
                                        src={album.thumbnail}
                                        width={400}
                                        height={400}
                                        quality={80}
                                        placeholder="blur"
                                        objectFit="cover"
                                        objectPosition="center"
                                        alt="Album thumbnail"
                                        className="rounded-lg"
                                    />

                                    <h1 className="text-3xl font-semibold mt-2">{album.name}</h1>
                                    <p className="text-md text-gray-500">{album.date}</p>

                                    <Link href={`/gallery/${album.route}`}>
                                        <a className="mt-2 text-lg text-blue-600 hover:underline">
                                            <span className="flex items-center gap-2">
                                                View <FiLink2 />
                                            </span>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}