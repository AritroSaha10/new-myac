import Link from "next/link";
import Image from "next/image";

import { FiLink2 } from "react-icons/fi";

import Layout from "../../components/Layout";
import airtableDB from "../../db/airtable";

import TeamImage from "../../imgs/team.jpg"

export async function getStaticProps() {
    let galleryInfo = [];

    const records = await airtableDB("Gallery").select({
        fields: ["Name", "Date", "GalleryLink", "Photos"],
        sort: [{ field: "Date", direction: "desc" }],
    }).all();

    records.map(({ fields }) => {
        galleryInfo.push({
            name: fields.Name,
            date: fields.Date,
            route: fields.GalleryLink,
            images: fields.Photos.map(image => ({
                src: image.url,
                width: image.width,
                height: image.height,
                blurDataURL: image.thumbnails.small.url
            })),
            thumbnail: {
                src: fields.Photos[0].url,
                blurDataURL: fields.Photos[0].thumbnails.small.url,
                width: fields.Photos[0].width,
                height: fields.Photos[0].height
            }
        })
    })

    return {
        props: {
            galleryInfo: galleryInfo
        }
    }
}

export default function GalleryIndex({ galleryInfo }) {
    return (
        <Layout>
            <div className="p-16 md:py-24">
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
                                <div className="flex flex-col p-4 bg-white outline outline-gray-200 drop-shadow-lg rounded-lg gap-2">
                                    <Image
                                        src={album.thumbnail}
                                        width={400}
                                        height={400}
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