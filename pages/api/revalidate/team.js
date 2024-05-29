import airtableDB from "../../../db/airtable";

export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        await res.revalidate('/team')
        
        const records = await airtableDB("Team").select({
            fields: ["Route"],
        }).all();

        
        const routes = records.map(record => record.fields.Route).filter(route => route !== undefined)
        await Promise.all(routes.map(route => res.revalidate(`/team/${route}`)))

        return res.json({ revalidated: true })
    } catch (err) {
        console.error(err)
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}