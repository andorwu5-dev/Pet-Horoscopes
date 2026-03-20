import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PetInfo {
  name: string;
  type: string;
  breed: string;
  birthday: string;
  personality: string;
}

export async function getPetFortune(pet: PetInfo, category: string = "综合运势") {
  const prompt = `
    你是一位精通宠物心理学和神秘学的“宠物命理大师”。
    请为以下宠物进行一次趣味性的“${category}”分析：
    
    宠物姓名：${pet.name}
    宠物种类：${pet.type}
    品种：${pet.breed}
    生日/年龄：${pet.birthday}
    性格特点：${pet.personality}
    
    请从以下几个维度进行分析：
    1. 命格简述（用富有诗意或幽默的语言描述宠物的天生气质）
    2. 运势详解（针对${category}给出具体的分析）
    3. 幸运物/幸运色（推荐适合它的颜色或玩具）
    4. 大师叮嘱（给主人的建议，如何让宠物更开心）
    
    要求：
    - 语气要亲切、幽默、富有想象力。
    - 结合宠物的品种和性格特点。
    - 结果以Markdown格式返回。
    - 长度约300-500字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "大师正在闭关，请稍后再试...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "算命球碎了，请检查网络或稍后再试。";
  }
}
