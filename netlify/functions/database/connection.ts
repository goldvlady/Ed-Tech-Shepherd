import { connect } from "mongoose";
require("./models/index");

export const connectToDb = async () => {
  const connection = connect('mongodb+srv://spa:RIRo8R4PMIvn6ilB@cluster0.jukxo1q.mongodb.net/?retryWrites=true&w=majority');

  return connection;
}