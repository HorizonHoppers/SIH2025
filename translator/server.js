const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Please set your GEMINI_API_KEY in the environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// === Translate Route ===
app.post("/translate", async (req, res) => {
  const { content, language } = req.body;

  if (!content || !language) {
    return res
      .status(400)
      .json({ error: "Missing content or language in request body" });
  }

  const promptText = `
You are a translator.
Translate the following English content into ${language}.
Output in two parts:
1) The translation in the native script of ${language}.
2) The transliteration of that translation into English letters.

Content: "${content}"
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const body = {
    contents: [
      {
        parts: [{ text: promptText }],
      },
    ],
  };

  try {
    const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    let translatedText = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n") || "No valid translation returned";

    res.json({ translation: translatedText.trim() });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }
  const referenceURL = "https://github.com/HorizonHoppers/SIH2025/blob/main/Description.txt"
  const fullPrompt = `
You are a friendly chatbot assistant for "Siksha Setu," a digital learning platform for rural students and teachers.

- Keep your answers concise and under 800 characters.
- Always respond positively and clearly.
- Encourage users to learn about Siksha Setu’s features such as offline access, multilingual support, voice navigation, attendance tracking, and personalized dashboards.

Knowledge base:
---
Siksha Setu is a mobile and web app aimed at improving rural education in Nabha, Punjab. It offers offline videos, multilingual notes, dyslexia-friendly fonts, voice navigation, attendance tracking, personalized dashboards, and text-to-speech features.

Team HorizonHoppers created it to empower rural students and teachers with digital literacy despite low internet.

---
Reference file: "${referenceURL}"
User input: "${prompt}"
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );

    const data = await response.json();

    let chatbotResponse = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .join("\n")
      ?.trim();

    if (!chatbotResponse || chatbotResponse.length < 5) {
      chatbotResponse =
        "I didn’t quite catch that. Would you like to know more about Siksha Setu and how it helps rural students and teachers?";
    }

    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
