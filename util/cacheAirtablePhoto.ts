import axios from "axios";
import { Attachment } from "airtable";
import airtableDB from "../db/airtable";
import { File } from "@google-cloud/storage"
import initApp from "../db/firebase-admin/app"

/**
 * Caches an Airtable photo by uploading it to GCP storage.
 * @param airtablePhoto A reference to the Airtable photo that should be uploaded to GCP storage
 * @param recordId The record ID that the photo on Airtable is attached to
 * @param tableKey The key of the table that the record is in
 * @param lastAirtableUpdatedDate The last time the Airtable photo was edited/updated
 * @param imgCdnSrcKey The column key of where the GCP url of the original image should be kept
 * @param thumbnailCdnSrcKey The column key of where the GCP url of the thumbnail should be kept
 * @returns File references to the image and thumbnail file on GCP storage respectively 
 */
export default async function cacheAirtablePhoto(airtablePhoto: Attachment, recordId: string, tableKey: string, lastAirtableUpdatedDate: Date, imgCdnSrcKey: string, thumbnailCdnSrcKey: string) {
    initApp()
    
    const { getStorage } = require("firebase-admin/storage")
    const bucket = getStorage().bucket();

    // Extract filename from img url
    const fname = airtablePhoto.filename;
    // Create thumbnail img by adding -thumbnail suffix
    const thumbnailFname = fname.slice(0, fname.indexOf(".")) + "-thumbnail" + fname.slice(fname.indexOf("."));

    // Download and upload the original thumbnail to GCP if it doesn't exist / needs to be refreshed
    const imgFile = bucket.file(fname);
    const imgThumbnail = bucket.file(thumbnailFname);

    // Handles uploading an airtable image to GCP
    const uploadAirtableToGCP = async (url: string, fileRef: File, isThumbnail: boolean) => {
        const downloadedImg = await axios.get(url, { responseType: "arraybuffer" });
        await fileRef.save(downloadedImg.data);
        await fileRef.makePublic();

        if (isThumbnail) {
            await airtableDB(tableKey).update(recordId, {
                [thumbnailCdnSrcKey]: fileRef.publicUrl()
            })
        } else {
            await airtableDB(tableKey).update(recordId, {
                [imgCdnSrcKey]: fileRef.publicUrl()
            })
        }
    }

    const fileExists = (await imgFile.exists())[0]
    const thumbnailExists = (await imgThumbnail.exists())[0]
    // Upload the main image & thumbnail if needed
    if (!fileExists || !thumbnailExists) {
        // Upload to GCP if it doesn't already exist
        console.info(`Uploading images for ${fname} (new file)...`);
        await uploadAirtableToGCP(airtablePhoto.url, imgFile, false);
        await uploadAirtableToGCP(airtablePhoto.thumbnails!.small.url, imgThumbnail, true);
    } else {
        // If it does exist, make sure a new version hasn't been uploaded
        const lastGCPUpdatedDate = new Date((await imgFile.getMetadata())[0].updated);
        
        if (lastAirtableUpdatedDate.getTime() > lastGCPUpdatedDate.getTime()) {
            console.info(`Uploading images for ${fname} (CDN refresh)...`);
            await uploadAirtableToGCP(airtablePhoto.url, imgFile, false);
            await uploadAirtableToGCP(airtablePhoto.thumbnails!.small.url, imgThumbnail, true);
        } else {
            console.info(`Not uploading images for ${fname} (no change in Airtable)`);
        }
    }

    // Make sure the images are public! Or else it breaks
    await imgFile.makePublic();
    await imgThumbnail.makePublic();

    return [imgFile, imgThumbnail]
}