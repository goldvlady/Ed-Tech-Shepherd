import middy from "../utils/middy";
import { HTTPEvent } from "../types";
import TutorLead from "../database/models/TutorLead";

const tutor = async (event: HTTPEvent) => {
  const { path } = event;
  let id = path.replace("/.netlify/functions/tutor/", "").replace(/\//gim, "");

  const tutor = await TutorLead.findById(id);

  if (!tutor) {
    return { statusCode: 404 };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(tutor),
  };
};

export const handler = middy(tutor);
