import Layout from "../../components/Layout";

import Image from "next/image";
import Link from "next/link";

import TeamImage from "../../imgs/team-resize.jpg"

import airtableDB from "../../db/airtable";
import axios from "axios";

export async function getStaticProps(context) {
    const { credential } = require("firebase-admin");
    const { initializeApp, getApps } = require("firebase-admin/app");
    const { getStorage } = require("firebase-admin/storage");
    const { app } = require("firebase-admin")

    if (getApps().length === 0) {
        initializeApp({
            credential: credential.cert({
                projectId: "myac-website-a6000",
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            }),
            storageBucket: "myac-website-a6000.appspot.com"
        })
    }

    const bucket = getStorage().bucket();

    let boardOfDirectorsInfo = [];

    const records = await airtableDB("Team").select({
        fields: ["Name", "Position", "Route", "Avatar", "Last Avatar Edit Time"],
        sort: [{ field: "Rank", direction: "asc" }],
    }).all();
    
    await Promise.all(records.map(async ({ fields, id }, idx) => {
        const portrait = fields.Avatar[0];

        // Extract filename from avatar url
        const avatarFname = portrait.filename;
        // Create avatar thumbnail fname by adding -thumbnail suffix
        const avatarThumbnailFname = avatarFname.slice(0, avatarFname.indexOf(".")) + "-thumbnail" + avatarFname.slice(avatarFname.indexOf("."));

        // Download and upload the original thumbnail to GCP if it doesn't exist / needs to be refreshed
        const avatarFile = bucket.file(avatarFname);
        const avatarThumbnail = bucket.file(avatarThumbnailFname);

        // Handles uploading an airtable image to GCP
        const uploadAirtableToGCP = async (url, fileRef, isThumbnail) => {
            const downloadedImg = await axios.get(url, { responseType: "arraybuffer" });
            await fileRef.save(downloadedImg.data);
            await fileRef.makePublic();

            if (isThumbnail) {
                await airtableDB("Team").update(id, {
                    "Avatar Thumbnail CDN Link": fileRef.publicUrl()
                })
            } else {
                await airtableDB("Team").update(id, {
                    "Avatar CDN Link": fileRef.publicUrl()
                })
            }
        }

        const fileExists = (await avatarFile.exists())[0]
        const thumbnailExists = (await avatarThumbnail.exists())[0]
        // Upload the main avatar & thumbnail if needed
        if (!fileExists || !thumbnailExists) {
            // Upload to GCP if it doesn't already exist
            console.info(`Uploading images for ${avatarThumbnailFname} (new file)...`);
            await uploadAirtableToGCP(portrait.url, avatarFile, false);
            await uploadAirtableToGCP(portrait.thumbnails.small.url, avatarThumbnail, true);
        } else {
            // If it does exist, make sure a new version hasn't been uploaded
            const lastGCPUpdatedDate = new Date((await avatarFile.getMetadata())[0].updated);
            const lastAirtableUpdatedDate = new Date(fields["Last Avatar Edit Time"]);
            
            if (lastAirtableUpdatedDate.getTime() > lastGCPUpdatedDate.getTime()) {
                console.info(`Uploading images for ${avatarThumbnailFname} (CDN refresh)...`);
                await uploadAirtableToGCP(portrait.url, avatarFile, false);
                await uploadAirtableToGCP(portrait.thumbnails.small.url, avatarThumbnail, true);
            } else {
                console.info(`Not uploading images for ${avatarThumbnailFname} (no change in Airtable)`);
            }

            // Make sure the images are public! Or else it breaks
            await avatarFile.makePublic();
            await avatarThumbnail.makePublic();
        }

        // Push to main info array
        boardOfDirectorsInfo.push({
            name: fields.Name,
            position: fields.Position,
            image: avatarFile.publicUrl(),
            blurDataURL: avatarThumbnail.publicUrl(),
            route: fields.Route,
            idx: idx
        })
    }));

    // Sort BOD by actual order
    boardOfDirectorsInfo.sort((a, b) => a.idx - b.idx)

    return {
        props: {
            boardOfDirectorsInfo: boardOfDirectorsInfo
        },
        revalidate: 10
    };
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
                                quality={100}
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
