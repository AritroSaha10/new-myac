import Airtable from "airtable";

const airtableDB = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_KEY
);

export default airtableDB;