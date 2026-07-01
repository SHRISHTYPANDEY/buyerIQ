import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  console.log("=== GEMINI ENV CHECK ===");
  console.log("Exists:", !!apiKey);
  console.log("Prefix:", apiKey?.slice(0, 10));
  console.log("Length:", apiKey?.length);
  console.log("Last:", apiKey?.slice(-5));

  try {
    const body = await req.json();

    const {
      state,
      confidence,
      evidence,
      recommendation,
    } = body;

    const genAI = new GoogleGenerativeAI(apiKey!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an ecommerce personalization expert.

Shopper State:
${state}

Confidence:
${confidence}

Evidence:
${evidence.join(", ")}

Recommendation:
${recommendation}

Explain:
1. Why this shopper belongs to this state.
2. What behavior indicates this.
3. What business action should be taken.

Keep response under 100 words.
`;

    const result = await model.generateContent(prompt);

    return Response.json({
      insight: result.response.text(),
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}