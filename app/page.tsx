"use client";

import { useState } from "react";
import { classifyShopper } from "@/lib/classifier";

export default function Home() {
  const [sessionJson, setSessionJson] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [aiInsight, setAiInsight] =
    useState("");

  const [classification, setClassification] =
    useState({
      state: "",
      confidence: 0,
      evidence: [] as string[],
      recommendation: "",
    });

 const analyzeSession = async () => {
  setLoading(true);
  try {
    setError("");

    const parsedData = JSON.parse(sessionJson);

    setEvents(parsedData.events || []);

    const shopperResult = classifyShopper(
      parsedData.events || []
    );

    setClassification(shopperResult);

    try {
      const aiResponse = await fetch(
        "/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shopperResult),
        }
      );
setLoading(false);
      const aiData = await aiResponse.json();

      setAiInsight(
        aiData.insight ||
          "AI insight unavailable."
      );
    } catch {
      setAiInsight(
        "AI insight unavailable."
      );
    }
  } catch (err) {
    setLoading(false);
    setError("Invalid JSON format");

    setEvents([]);

    setClassification({
      state: "",
      confidence: 0,
      evidence: [],
      recommendation: "",
    });

    setAiInsight("");
  }
};

     const sampleSessions = {
  comparer: {
    events: [
      "view_product",
      "compare_products",
      "compare_products",
      "view_reviews"
    ]
  },

  cartAbandoner: {
    events: [
      "view_product",
      "add_to_cart",
      "view_reviews"
    ]
  },

  loyalCustomer: {
    events: [
      "purchase",
      "purchase",
      "purchase"
    ]
  },

  discountSeeker: {
    events: [
      "search_coupon",
      "search_coupon",
      "view_product"
    ]
  }
};

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Shopper State Intelligence Engine
          </h1>

          <p className="text-slate-700">
            Analyze shopper behavior and classify customer intent.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <label className="block text-lg font-semibold text-black mb-3">
            Paste Session JSON
          </label>

     

<div className="flex flex-wrap gap-3 mb-4">

  <button
    onClick={() =>
      setSessionJson(
        JSON.stringify(
          sampleSessions.comparer,
          null,
          2
        )
      )
    }
    className="px-4 py-2 rounded-lg bg-white border text-black"
  >
    Comparer
  </button>

  <button
    onClick={() =>
      setSessionJson(
        JSON.stringify(
          sampleSessions.cartAbandoner,
          null,
          2
        )
      )
    }
    className="px-4 py-2 rounded-lg bg-white border text-black"
  >
    Cart Abandoner
  </button>

  <button
    onClick={() =>
      setSessionJson(
        JSON.stringify(
          sampleSessions.loyalCustomer,
          null,
          2
        )
      )
    }
    className="px-4 py-2 rounded-lg bg-white border text-black"
  >
    Loyal Customer
  </button>

  <button
    onClick={() =>
      setSessionJson(
        JSON.stringify(
          sampleSessions.discountSeeker,
          null,
          2
        )
      )
    }
    className="px-4 py-2 rounded-lg bg-white border text-black"
  >
    Discount Seeker
  </button>

</div>

          <textarea
            value={sessionJson}
            onChange={(e) =>
              setSessionJson(e.target.value)
            }
            className="
              w-full
              h-64
              border
              border-slate-300
              rounded-xl
              p-4
              text-black
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            placeholder={`{
  "events": [
    "view_product",
    "compare_products",
    "view_reviews"
  ]
}`}
          />
<button
  onClick={analyzeSession}
  disabled={loading}
  className="
    mt-4
    bg-blue-600
    hover:bg-blue-700
    disabled:bg-gray-400
    text-white
    px-6
    py-3
    rounded-xl
    font-medium
    transition
  "
>
  {loading ? "Analyzing..." : "Analyze Session"}
</button>

          {error && (
            <p className="text-red-600 mt-4 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Shopper State Card */}
        {classification.state && (
          <div className="bg-green-50 border border-green-200 rounded-2xl shadow mt-6 p-6">

            <h3 className="text-xl font-bold text-green-800 mb-2">
              Shopper Classification
            </h3>

            <p className="text-black text-lg">
              <span className="font-semibold">
                State:
              </span>{" "}
              {classification.state}
            </p>

            <div className="mt-3">

  <span
    className="
      inline-block
      px-3
      py-1
      rounded-full
      bg-green-600
      text-white
      text-sm
      font-semibold
    "
  >
    Confidence: {classification.confidence}%
  </span>

</div>
            <div className="mt-4">
              <h4 className="font-semibold text-black mb-2">
                Evidence
              </h4>

              <ul className="space-y-2">
                {classification.evidence.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-black"
                    >
                      ✓ {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-black mb-2">
                Recommended Action
              </h4>

              <p className="text-black">
                {classification.recommendation}
              </p>
            </div>

            {aiInsight && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">

                <h3 className="font-bold text-lg text-black mb-2">
                  AI Insight
                </h3>

                <p className="text-black whitespace-pre-line">
                  {aiInsight}
                </p>

              </div>
            )}
          </div>
        )}

        {classification.state && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl shadow mt-6 p-6">

            <h3 className="text-xl font-bold text-purple-800 mb-3">
              Business Impact
            </h3>

            <p className="text-black">
              This shopper is currently classified as a{" "}
              <span className="font-semibold">
                {classification.state}
              </span>.
              Taking the recommended action at this stage can
              improve engagement and increase conversion
              probability.
            </p>

          </div>
        )}

        {/* Events Result */}
        <div className="bg-white rounded-2xl shadow-lg mt-6 p-6">

          <h2 className="text-2xl font-bold text-black mb-4">
            Analysis Result
          </h2>

          <p className="font-semibold text-black mb-4">
            Total Events: {events.length}
          </p>

          {events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((event, index) => (
                <li
                  key={index}
                  className="
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-lg
                    p-3
                    text-black
                  "
                >
                  {event}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">
Paste a session JSON or use a sample session above to begin analysis.            </p>
          )}
        </div>

      </div>
    </main>
  );
}