const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { SessionsClient } = require("@google-cloud/dialogflow");

console.log("Starting Dialogflow server...");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const client = new SessionsClient({
  keyFilename: "womencrimeinfobot-si99-37d1c6abfb8b.json" // your file
});

const PROJECT_ID = "womencrimeinfobot-si99";

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const sessionPath = client.projectAgentSessionPath(
    PROJECT_ID,
    "session-" + Date.now()
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  try {
    const responses = await client.detectIntent(request);
    const reply = responses[0].queryResult.fulfillmentText;

    res.json({ reply });
  } catch (err) {
  console.error("FULL ERROR:", err);   // 👈 terminal log
  res.status(500).json({
    reply: "Error",
    details: err.message              // 👈 send to curl
  });
}
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});