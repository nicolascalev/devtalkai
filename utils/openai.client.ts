import { Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_ORGANIZATION || !process.env.OPENAI_API_KEY)
  throw new Error(
    "OPENAI_ORGANIZATION and OPENAI_API_KEY env variables are required"
  );
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default openai;
