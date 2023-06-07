import middy from "../utils/middy";
import { HTTPEvent } from "../types";
import TutorLead from "../database/models/TutorLead";
import { MongooseQueryParser } from "mongoose-query-parser";

const tutors = async (event: HTTPEvent) => {
  const { queryStringParameters } = event;

  const parser = new MongooseQueryParser();
  const predefined = {
    active: true,
  };
  const parsed = parser.parse(queryStringParameters || "", predefined);

  const tutors = await TutorLead.aggregate([
    {
      $match: {
        $and: [parsed.filter],
      },
    },
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(tutors),
  };
};

export const handler = middy(tutors);
