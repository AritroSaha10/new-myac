import Layout from "../../components/Layout";
import airtableDB from "../../db/airtable";

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

export async function getStaticProps({ params }) {
    console.log(params)
    const recordRoute = params.route;

    const records = await airtableDB("Team").select({
        fields: ["Name", "Position", "Bio", "Email", "Instagram Link", "Avatar", "Route"]
    }).all();

    // If more than 1 person has the same route, there are other problems we need to fix.
    const directorRecord = records.filter(record => record.fields.Route === recordRoute)[0];

    console.log(directorRecord.fields)

    return {
        props: {
            
        }
    }
}

export default function TeamPage({  }) {
    return (
        <Layout>
            
        </Layout>
    )
}