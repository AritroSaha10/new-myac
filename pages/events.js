import Link from "next/link";
import Image from "next/image";

import { FiExternalLink } from "react-icons/fi";

import Layout from "../components/Layout";
import airtableDB from "../db/airtable";
import cacheAirtablePhoto from "../util/cacheAirtablePhoto";

export async function getStaticProps() {
    let eventsInfo = [];

    const records = await airtableDB("Content pipeline").select({
        fields: ["Name", "Date", "Description", "Status", "URL", "Thumbnail"],
        sort: [{ field: "Date", direction: "desc" }],
        filterByFormula: "NOT({Status} = 'Concluded')"
    }).all();

    await Promise.all(records.map(async ({ fields, id }) => {
        const [thumbnailFile, thumbnailSmallFile] = await cacheAirtablePhoto(fields.Thumbnail[0], id, "Content pipeline", new Date(fields["Last Thumbnail Edit Time"]), "Thumbnail CDN Link", "Thumbnail Small CDN Link")

        eventsInfo.push({
            name: fields.Name,
            description: fields.Description.replace("<br/>", "\n"),
            date: fields.Date,
            url: fields.URL,
            status: fields.Status,
            image: thumbnailFile.publicUrl(),
            blurDataURL: thumbnailSmallFile.publicUrl(),
        })
    }))

    return {
        props: {
            eventsInfo: eventsInfo
        },
        revalidate: 10
    }
}

export default function Events({ eventsInfo }) {
    return (
        <Layout name="Events">
            <div className="p-16 md:py-24">
                {eventsInfo.length === 0 ? (
                    <div className="flex flex-col items-center w-full">
                        <h1 className="text-5xl text-gray-600 font-medium text-center mb-4">
                            No upcoming events found
                        </h1>
                        <h3 className="text-xl text-gray-600 font-light text-center md:w-1/2 lg:w-1/3">
                            Sorry, there seems to be no upcoming events as of now. Try clicking
                            {" "}
                            <Link href="/past-events">
                                <a className="text-blue-600 hover:underline">
                                    here
                                </a>
                            </Link>
                            {" "}
                            to view past events, or come back later to find new events by MYAC!
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:px-16 xl:px-32">
                        {eventsInfo.map(event => (
                            <div key={event.name}> {/* Wrapper div to allow the cards to resize themselves */}
                                <div className="flex flex-col p-4 bg-white outline outline-gray-200 drop-shadow-lg rounded-lg gap-2">
                                    <Image
                                        src={event.image}
                                        height={800}
                                        width={800}
                                        blurDataURL={event.blurDataURL}
                                        placeholder="blur"
                                        objectFit="cover"
                                        objectPosition="center"
                                        alt="Event promo"
                                        className="rounded-lg"
                                    />

                                    <h1 className="text-3xl font-semibold mt-2">{event.name}</h1>

                                    <p className="text-md text-gray-500">{event.date}</p>

                                    <p className="text-lg text-gray-600 whitespace-pre-line">
                                        {event.description}
                                    </p>

                                    <a className="mt-2 text-lg text-blue-600 hover:underline" href={event.url} target="_blank" rel="noreferrer">
                                        <span className="flex items-center gap-2">
                                            Learn More <FiExternalLink />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}