from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

class NoteInput(BaseModel):
    text: str
    max_length: int = 1000
    min_length: int = 50

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

summarizer = pipeline("summarization", model="t5-small")

def chunk_text(text, max_chars=800, overlap=100):
    if len(text) <= max_chars:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        chunks.append(text[start:end])
        start = end - overlap
        if start < 0:
            start = 0
    return chunks

@app.post("/summarize")
def summarize(payload: NoteInput):
    text = payload.text.strip()
    if not text:
        return {"summary": ""}

    chunks = chunk_text(text, max_chars=800, overlap=100)
    partial_summaries = []
    for chunk in chunks:
        out = summarizer(chunk, max_length=payload.max_length, min_length=payload.min_length, do_sample=False)
        partial_summaries.append(out[0]["summary_text"])

    if len(partial_summaries) > 1:
        combined = " ".join(partial_summaries)
        final = summarizer(combined, max_length=payload.max_length, min_length=payload.min_length, do_sample=False)
        return {"summary": final[0]["summary_text"]}
    else:
        return {"summary": partial_summaries[0]}