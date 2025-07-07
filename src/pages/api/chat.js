import { Configuration, OpenAIApi } from "openai";
const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

const agents = {
  selfAwareness: "You are Rigby, helping users reflect on emotions...",
  selfManagement: "You are Rigby, supporting users to regulate emotions...",
  socialAwareness: "You are Rigby, guiding empathy and perspective-taking...",
  relationshipSkills: "You are Rigby, fostering communication skills...",
  decisionMaking: "You are Rigby, promoting thoughtful decision-making..."
};

function chooseAgent(text) {
  if (/feel|emotion/.test(text)) return agents.selfAwareness;
  if (/manage|cope/.test(text)) return agents.selfManagement;
  if (/others|empathy/.test(text)) return agents.socialAwareness;
  if (/talk|communicate/.test(text)) return agents.relationshipSkills;
  if (/decide|choice/.test(text)) return agents.decisionMaking;
  return agents.selfAwareness;
}

export default async function handler(req, res) {
  const user = req.body.message;
  const system = chooseAgent(user);
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "system", content: system }, { role: "user", content: user }]
  });
  res.status(200).json({ reply: completion.data.choices[0].message.content });
}
