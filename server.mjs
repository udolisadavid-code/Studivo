import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.prompt || req.body.text;
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Direct, standard web call to Google's official Gemini endpoint
    const url = `https://googleapis.com{apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Safely extract the text response
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that response.";

    res.json({
      reply: botReply,
      choices: [{ message: { content: botReply } }]
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server connection failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
