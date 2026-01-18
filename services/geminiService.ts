
import { GoogleGenAI, Type } from "@google/genai";
import { Dish } from "../types";

export const getChefRecommendation = async (userMood: string, dishes: Dish[]) => {
  // Tránh lỗi nếu process không tồn tại trong môi trường trình duyệt thuần
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    console.warn("API Key không được tìm thấy. Chức năng gợi ý AI sẽ bị hạn chế.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const menuSummary = dishes.map(d => `${d.id}: ${d.name} (${d.category})`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Người dùng đang cảm thấy: "${userMood}". Dựa trên thực đơn sau: ${menuSummary}, hãy chọn MỘT món ăn phù hợp nhất. Giải thích lý do bằng tiếng Việt một cách sang trọng, dân dã, tinh tế và gợi ý thêm một món đồ uống đi kèm có trong thực đơn hoặc phù hợp với món đó.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishId: { type: Type.STRING },
            reason: { type: Type.STRING },
            pairing: { type: Type.STRING }
          },
          required: ["dishId", "reason", "pairing"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (e) {
    console.error("Lỗi khi xử lý phản hồi từ AI", e);
    return null;
  }
};
