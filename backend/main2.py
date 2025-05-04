from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
import logging
import os
from datetime import datetime
import sqlite3

# Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NeuroCare Voice API",
    description="Voice Assistant with Reliable Responses",
    version="3.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('elder_ease.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS emergencies (
            id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending'
        )""")
        conn.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            speaker TEXT NOT NULL,
            text TEXT NOT NULL,
            language TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )""")

init_db()

class Language(str, Enum):
    ENGLISH = "en-US"
    HINDI = "hi-IN"
    TAMIL = "ta-IN"
    TELUGU = "te-IN"
    BENGALI = "bn-IN"

@app.post("/api/emergency")
async def trigger_emergency(
    user_id: str = Form(...),
    message: str = Form("Help! I need immediate assistance")
):
    try:
        # Log in database
        with get_db_connection() as conn:
            conn.execute("""
            INSERT INTO emergencies (user_id, message, status)
            VALUES (?, ?, ?)
            """, (user_id, message, "sent"))
            conn.commit()
        
        return {"status": "success", "message": "Emergency alert logged"}
    except Exception as e:
        logger.error(f"Emergency error: {str(e)}")
        raise HTTPException(500, detail=str(e))

@app.post("/voice-assistant")
async def process_voice(
    text: str = Form(...),
    language: Language = Form(Language.ENGLISH),
    user_id: str = Form("user1")
):
    try:
        logger.info(f"Received text input ({language.value}): {text}")
        
        # Generate appropriate response
        if "emergency" in text.lower():
            response_text = "I've detected an emergency. Help is on the way!"
        else:
            response_text = f"I understood: {text}. How can I help you further?"
        
        # Save conversation
        with get_db_connection() as conn:
            conn.execute("""
            INSERT INTO conversations (user_id, speaker, text, language)
            VALUES (?, ?, ?, ?)
            """, (user_id, "user", text, language.value))
            conn.execute("""
            INSERT INTO conversations (user_id, speaker, text, language)
            VALUES (?, ?, ?, ?)
            """, (user_id, "ai", response_text, language.value))
            conn.commit()
        
        return {
            "input_text": text,
            "response": response_text
        }
        
    except Exception as e:
        logger.error(f"Error processing text: {str(e)}")
        raise HTTPException(500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    