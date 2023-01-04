import { credential } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";

let app;
if (getApps().length === 0) {
    app = initializeApp({
        credential: credential.cert({
            projectId: "myac-website-a6000",
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
    })
}

export default app;