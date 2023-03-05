import { credential } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";

export default function initApp() {
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
}
