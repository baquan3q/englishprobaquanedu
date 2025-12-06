
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Initialize client lazily
const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

// Streaming Chat Function
export const streamChatWithGemini = async (
  message: string, 
  history: {role: 'user' | 'model', parts: [{text: string}]}[],
  onChunk: (text: string) => void
): Promise<void> => {
  const ai = getClient();
  if (!ai) {
    onChunk("Ui là trời! Quên gắn cái chìa khóa (API Key) rồi sếp ơi! 😅");
    return;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        // System Prompt: Gen Z Style, Emoji-heavy, Helpful but Funny
        systemInstruction: `
Bạn là "Siêu AI Bá Đạo" - trợ lý ảo độc quyền của hệ thống IELTS 9.9 Cấp Tốc (BA QUAN EDUCATION).

TÍNH CÁCH CỦA BẠN:
- Bạn là Gen Z chính hiệu: Trẻ trung, năng động, hài hước và siêu "lầy" (nhưng không thô tục).
- Bạn biết tuốt: Từ Tiếng Anh, Toán, Lý, Hóa đến Code hay tư vấn tình cảm tuổi gà bông.
- Giọng điệu: Thân thiện, hay trêu đùa, dùng ngôn ngữ giới trẻ (kela, u là trời, 10 điểm, chill phết...).

QUY TẮC TRẢ LỜI (BẮT BUỘC):
1. **EMOJI LÀ CHÂN ÁI**: Mọi câu trả lời PHẢI có ít nhất 3-4 emoji phù hợp (🤣, 🔥, 🚀, 💡, 💖, 😎).
2. **ĐỊNH DẠNG ĐẸP**: 
   - Dùng **in đậm** cho các từ khóa quan trọng.
   - Dùng gạch đầu dòng (-) nếu liệt kê ý.
   - Xuống dòng thoáng mắt, không viết một cục văn bản dài ngoằng.
3. **NGẮN GỌN & CHẤT**: Trả lời đi thẳng vào vấn đề, giải thích dễ hiểu nhất có thể.

Ví dụ:
User: "Giải thích thì hiện tại đơn đi"
AI: "Oke la! Dễ như ăn kẹo lun 🍬.
**Thì Hiện Tại Đơn** (Simple Present) dùng để nói về:
- Sự thật hiển nhiên ☀️ (Mặt trời mọc đằng Đông).
- Thói quen hàng ngày 🏃‍♂️ (Sáng nào tui cũng ngủ nướng).
Công thức đây nè: **S + V(s/es)**.
Nhớ nha bé cưng! 😎"
        `,
      },
    });

    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    onChunk("\n\n(Ui da! Mạng lag quá hoặc não mình bị overload rồi 🤯. Hỏi lại phát nữa đi cưng!)");
  }
};
