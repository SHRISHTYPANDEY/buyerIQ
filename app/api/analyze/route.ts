import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      state,
      confidence,
      evidence,
      recommendation,
    } = body;

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

    const result = await model.generateContent(
      prompt
    );

    const insight =
      result.response.text();

    return Response.json({
      insight,
    });
  } catch (error) {
    console.error(
      "GEMINI ERROR:",
      error
    );

    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}