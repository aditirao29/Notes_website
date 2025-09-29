from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

class NoteInput(BaseModel):
    text: str
    max_length: int = 300
    min_length: int = 100

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

summarizer = pipeline("summarization", model="t5-large", device_map="auto")

def chunk_text_by_sentences(text: str, max_sentences: int = 5, overlap: int = 1):
    sentences = text.split(". ")
    if len(sentences) <= max_sentences:
        return [text]

    chunks = []
    start = 0
    while start < len(sentences):
        end = start + max_sentences
        chunk = ". ".join(sentences[start:end])
        if not chunk.endswith("."):
            chunk += "."
        chunks.append(chunk)
        start = end - overlap
        if start < 0:
            start = 0
    return chunks

@app.post("/summarize")
def summarize(payload: NoteInput):
    text = payload.text.strip()
    if not text:
        return {"summary": ""}

    chunks = chunk_text_by_sentences(text, max_sentences=5, overlap=1)

    partial_summaries = []
    for chunk in chunks:
        out = summarizer(
            chunk,
            max_length=payload.max_length,
            min_length=payload.min_length,
            do_sample=False,
            repetition_penalty=1.5
        )
        partial_summaries.append(out[0]["summary_text"])

    combined_summary = " ".join(partial_summaries)

    if len(partial_summaries) > 1:
        final_out = summarizer(
            combined_summary,
            max_length=payload.max_length * 2,
            min_length=payload.min_length,
            do_sample=False,
            repetition_penalty=1.5
        )
        return {"summary": final_out[0]["summary_text"]}
    else:
        return {"summary": combined_summary}
