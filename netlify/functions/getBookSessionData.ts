import { HandlerEvent } from "@netlify/functions";
import { connectToDb } from "./database/connection";
import StudentLead from "./database/models/StudentLead";
import TutorLead from "./database/models/TutorLead";

type Params = {
    studentLeadId: string;
    course: string;
}

export const handler = async (event: HandlerEvent) => {
    const { studentLeadId, course } = event.queryStringParameters as Params;

    await connectToDb();

    const studentLead = await StudentLead.findById(studentLeadId);
    const matchedTutors = await TutorLead.find({
        courses: course,
        active: true
    });

    if (!studentLead) {
        return {
            statusCode: 404
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            studentLead,
            matchedTutors
        })
    }
}