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
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: `Gemini API error: ${errorText}` });
    }

    const data = await response.json();
    //console.log("Gemini API response:", JSON.stringify(data, null, 2));

    let translatedText = "No valid translation returned";

    if (data.candidates && data.candidates[0]?.content?.parts) {
      translatedText = data.candidates[0].content.parts
        .map(part => part.text)
        .join("\n");
    } else if (data.outputs && data.outputs[0]?.text) {
      translatedText = data.outputs[0].text;
    } else if (typeof data.text === "string") {
      translatedText = data.text;
    }

    translatedText =
      typeof translatedText === "string"
        ? translatedText.trim()
        : String(translatedText);

    res.json({ translation: translatedText });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
