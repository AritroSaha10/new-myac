import Airtable from "airtable";

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
})

const airtableDB = Airtable.base(process.env.AIRTABLE_BASE_KEY);

export default airtableDB;