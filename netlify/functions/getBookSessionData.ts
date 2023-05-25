import { HandlerEvent } from "@netlify/functions";
import StudentLead from "../database/models/StudentLead";
import TutorLead from "../database/models/TutorLead";
import authMiddleware from "../middlewares/authMiddleware";
import middy from "../utils/middy";

type Params = {
    studentLeadId: string;
    course: string;
}

export const getBookSessionData = async (event: HandlerEvent) => {
    const { studentLeadId, course } = event.queryStringParameters as Params;

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

export const handler = middy(getBookSessionData).use(authMiddleware());