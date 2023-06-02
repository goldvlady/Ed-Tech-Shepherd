import middy from '../utils/middy';
import { HTTPEvent } from "../types";
import Course from '../database/models/Course';

const resources = async (event: HTTPEvent) => {
    let courses = await Course.find();

    return {
        statusCode: 200,
        body: JSON.stringify({
            courses
        })
    }
}

export const handler = middy(resources);