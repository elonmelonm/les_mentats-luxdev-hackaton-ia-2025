import os
import random

from dotenv import load_dotenv
from google.genai import Client

from schemas import ResponseSchema
from utils.logs import logger

load_dotenv()


prompt = """Extract all coordinate pairs in this image.

Use the following format:
[
{"x": 123.45, "y": 67.89},
{"x": 98.76, "y": 54.32},
{"x": 12.34, "y": 56.78},
...
]
"""

google_api_keys = [
    os.getenv("GOOGLE_API_KEY_1"),
    os.getenv("GOOGLE_API_KEY_2"),
    """
    os.getenv("GOOGLE_API_KEY_3"),
    os.getenv("GOOGLE_API_KEY_4"),
    os.getenv("GOOGLE_API_KEY_5"),
    """
]


def gemini_ocr(img_path: str):
    logger.info(f"Starting OCR for image: {img_path}")
    try:
        google_api_key = random.choice(google_api_keys)
        google_client = Client(api_key=google_api_key)
        configuration = {
            "response_mime_type": "application/json",
            "response_schema": ResponseSchema
        }
        img_file = google_client.files.upload(file=img_path)
        logger.info("Image uploaded successfully")
        logger.info("Generating content with Gemini")
        response = google_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, img_file],
            config=configuration
        )
        if response.parsed:
            coordinates = response.parsed.model_dump().get("coordinates", [])
            logger.info(f"Extracted {len(coordinates)} coordinates")
            return coordinates
        logger.warning("No parsed response from Gemini")
        return []
    except Exception as e:
        logger.error(f"Error in gemini_ocr: {e}", exc_info=True)
        return []


if __name__ == "__main__":
    img_path = "Data Hackathon_IA_2025/Testing Data/leve9.png"
    result = gemini_ocr(img_path)
    if result:
        # res_model = ResponseSchema(**result)
        print(f"OCR result: {result}")