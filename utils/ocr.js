import Tesseract from "tesseract.js";

/**
 * Extracts text from an image using OCR (Tesseract.js).
 * @param {string} imageUrl - URL or local path of the image.
 * @returns {Promise<string|null>} Extracted text or null if failed.
 */
export const extractTextFromImage = async (imageUrl) => {
  try {
    const { data } = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => console.log(m), // Logs progress (optional)
    });
    return data.text.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};
