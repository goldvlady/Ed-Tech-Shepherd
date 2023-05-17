import { HandlerEvent } from "@netlify/functions";
import TutorLead from "../database/models/TutorLead";
import middy from "../utils/middy";

export const toggleTutorActive = async (event: HandlerEvent) => {
    const data = JSON.parse(event.body as string);
    const { selectedIds } = data;

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

export const handler = middy(toggleTutorActive);