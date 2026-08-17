import express from "express";
import OpenAI from "openai";

const app=express();
const port=process.env.PORT||3000;
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

app.use(express.json({limit:"1mb"}));
app.use(express.static("public"));

app.post("/api/ask",async(req,res)=>{
  const question=String(req.body?.question||"").trim();
  if(!question) return res.status(400).json({error:"Ask a question first."});
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"Studivo AI is not connected yet. Add OPENAI_API_KEY to the server environment."});
  try{
    const response=await client.responses.create({
      model:"gpt-5.6",
      instructions:`You are Studivo, an excellent AI tutor for Nigerian students.
Help with JAMB, WAEC, NECO and general school subjects. Explain clearly at the student's level.
For calculations, show steps. If a question is ambiguous, say what is missing.
Do not pretend to know an answer when uncertain.`,
      input:question
    });
    res.json({answer:response.output_text});
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Studivo could not get an AI response right now."});
  }
});

app.listen(port,()=>console.log(`Studivo running on port ${port}`));
