from fastapi import FastAPI, UploadFile, File, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, FileResponse
import ollama
import requests
import whisper
import logging
from gtts import gTTS
from io import BytesIO
import tempfile
import os
import pandas as pd
import pickle
import time
from typing import Optional

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ElderEase Voice Assistant")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Prepare TTS directory
TTS_AUDIO_DIR = "static/tts"
os.makedirs(TTS_AUDIO_DIR, exist_ok=True)

# Load Models
try:
    whisper_model = whisper.load_model("tiny")
    logger.info("Whisper model loaded successfully")

    with open("fall_detection_model.pkl", "rb") as f:
        fall_model = pickle.load(f)

    with open("model_columns.pkl", "rb") as f:
        model_columns = pickle.load(f)

    logger.info("Fall detection model loaded successfully")
except Exception as e:
    logger.error(f"Model loading error: {e}")
    raise

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict-fall")
async def predict_fall(request: Request):
    try:
        data = await request.json()
        input_df = pd.DataFrame([data])

        for col in model_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        input_df = input_df[model_columns]

        prediction = fall_model.predict(input_df)
        return {"prediction": int(prediction[0])}
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"prediction": 0, "error": str(e)}

def transcribe_audio(audio_file: BytesIO) -> str:
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
            temp_file.write(audio_file.read())
            temp_file_path = temp_file.name

        result = whisper_model.transcribe(temp_file_path, language="en")
        os.remove(temp_file_path)

        text = result.get("text", "").strip()
        logger.info(f"Transcribed: '{text}'")
        return text
    except Exception as e:
        logger.error(f"Whisper error: {e}")
        return ""

def process_intent(text: str) -> str:
    try:
        prompt = f"""
        You are ElderEase, a warm assistant for elderly users, supporting their well-being and safety.
        Respond in a short (under 40 words), kind, clear way to the input.
        Input: "{text}"

        Rules:
        - Greetings ("hello", "hi"): "Hi there! Ready to help you shine!"
        - Well-being ("sad", "lonely", "tired"): "Oh, I'm here for you! Want to chat?"
        - Health ("medicine", "pill", "doctor"): "Smart thinking! Need a reminder for meds?"
        - Fall ("fall", "fell"): "Let's make sure you're safe."
        - Other: "I hear you! What's on your mind?"

        Be positive, empathetic, and concise.
        """
        response = ollama.generate(model="llama3", prompt=prompt)
        return response["response"].strip()
    except Exception as e:
        logger.error(f"Ollama error: {e}")
        return "Oops, something's off. Let's try again!"

def check_fall_risk() -> str:
    try:
        sample_data = {"sensor1": 0, "sensor2": 0} 
        response = requests.post("http://localhost:8000/predict-fall", json=sample_data)
        response.raise_for_status()
        prediction = response.json().get("prediction", 0)
        return "Fall detected! Help is coming." if prediction == 1 else "You're safe, no fall detected!"
    except Exception as e:
        logger.error(f"Fall check error: {e}")
        return "Can't check falls now, but I'm with you!"

@app.post("/voice-assistant")
async def voice_assistant(
    request: Request,
    audio: UploadFile = File(None),
    text: Optional[str] = Body(None)
):
    try:
        if text:
            logger.info(f"Text received: '{text}'")
            response_text = process_intent(text)
            if "fall" in text.lower() or "fell" in text.lower():
                response_text += " " + check_fall_risk()

        elif audio:
            audio_data = await audio.read()
            audio_file = BytesIO(audio_data)
            audio_file.name = audio.filename

            transcribed_text = transcribe_audio(audio_file)

            if not transcribed_text:
                response_text = "I couldn't understand your voice. Please speak clearly!"
            else:
                logger.info(f"Transcribed text: '{transcribed_text}'")
                response_text = process_intent(transcribed_text)
                if "fall" in transcribed_text.lower() or "fell" in transcribed_text.lower():
                    response_text += " " + check_fall_risk()
        else:
            response_text = "No voice or text input received. Try again!"

        tts = gTTS(text=response_text, lang='en')
        audio_filename = f"tts_response_{int(time.time())}.mp3"
        audio_path = os.path.join(TTS_AUDIO_DIR, audio_filename)
        tts.save(audio_path)

        return {
            "response": response_text,
            "audio_url": f"/static/tts/{audio_filename}"
        }

    except Exception as e:
        logger.error(f"Voice assistant error: {e}")
        return {"response": "Something went wrong. Please try again!"}

@app.get("/static/tts/{file_name}")
async def serve_tts_audio(file_name: str):
    file_path = os.path.join(TTS_AUDIO_DIR, file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg")
    return JSONResponse(content={"error": "Audio file not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
