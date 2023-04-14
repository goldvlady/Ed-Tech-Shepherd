import { HandlerEvent } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import TutorLead from "./database/models/TutorLead";

export const handler = async (event: HandlerEvent) => {
    const data = JSON.parse(event.body as string);
    const { selectedIds } = data;

    await connectToDb();

    const tutor = await TutorLead.findOne({ pipedriveDealId: selectedIds });

    if (!tutor) {
        return {
            statusCode: 404
        }
    }

    await tutor.updateOne({
        active: !tutor.active
    })

    return {
        statusCode: 200
    }
}