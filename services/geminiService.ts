
import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const dataUrlToBase64 = (dataUrl: string): { base64: string, mimeType: string } => {
  const parts = dataUrl.split(',');
  const mimeType = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png';
  const base64 = parts[1];
  return { base64, mimeType };
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};


export const editImage = async (prompt: string, originalImageDataUrl: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const { base64, mimeType } = dataUrlToBase64(originalImageDataUrl);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    const firstPart = response.candidates?.[0]?.content?.parts?.[0];

    if (firstPart && firstPart.inlineData) {
      const base64ImageBytes: string = firstPart.inlineData.data;
      const newMimeType = firstPart.inlineData.mimeType;
      return `data:${newMimeType};base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image editing failed, no image data returned.");
    }
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. Please check the console for details.");
  }
};
