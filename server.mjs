import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS so your frontend can communicate with this backend
app.use(cors());
app.use(express.json());

// Serve static files from your frontend public folder
app.use(express.static('public'));

// Initialize the Google Gemini client using your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The primary API route for your tutor chatbot
app.post('/api/chat', async (req, res) => {
  try {
    // Captures the message sent from your frontend input box
    const userMessage = req.body.message || req.body.prompt || req.body.text;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Call Google's fast, free Gemini 2.5 Flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
    });

    // We send back both common ChatGPT formats ('reply' and 'choices') 
    // This ensures your frontend reads the response perfectly without breaking
    res.json({
      reply: response.text,
      choices: [{ message: { content: response.text } }]
    });

  } catch (error) {
    console.error("Gemini Backend Error:", error);
    res.status(500).json({ error: "The AI Tutor could not get a response right now." });
  }
});

// Start the server listening on the port Render assigns
app.listen(PORT, () => {
  console.log(`Studivo running on port ${PORT}`);
});
