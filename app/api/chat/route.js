import { NextResponse } from "next/server";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Handler for GET requests (used for streaming)
export async function GET(request) {
  // Reuse the same logic as POST but with query parameters
  const response = await handleChatRequest(request, true);

  // Add CORS headers
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Handler for POST requests
export async function POST(request) {
  const response = await handleChatRequest(request, false);

  // Add CORS headers
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Shared handler for both GET and POST requests
async function handleChatRequest(request, isGetRequest) {
  try {
    let message,
      advisorId,
      thinkMode = false, // Set to false by default
      streamMode = true;

    if (isGetRequest) {
      // Parse query parameters for GET requests (streaming)
      const url = new URL(request.url);
      message = url.searchParams.get("message") || "";
      advisorId = url.searchParams.get("advisorId") || "general";
      thinkMode = url.searchParams.get("thinkMode") === "true";
      streamMode = true;
    } else {
      // Parse JSON body for POST requests
      const body = await request.json();
      message = body.message;
      advisorId = body.advisorId;
      thinkMode = body.thinkMode === true;
      streamMode = body.stream === true;
    }

    // Get the appropriate system message based on the advisor
    let systemMessage = getSystemMessage(advisorId);

    // Think mode is disabled - no system message modification
    // thinkMode parameter is kept for backward compatibility

    const API_URL =
      process.env.API_URL || "https://api.operatornext.cn/v1/chat/completions";
    const API_KEY = process.env.API_KEY;

    if (process.env.NODE_ENV === "development") {
      console.log("API_URL:", API_URL);
      console.log("API_KEY:", API_KEY);
    }

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If streaming is requested, forward the stream directly
    if (streamMode || isGetRequest) {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: true,
          model: "deepseek-v3-250324",
          temperature: 0.5,
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("API Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch from API" }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Forward the response with appropriate headers
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming mode - original implementation
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Referer: "",
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
          model: "deepseek-v3-250324",
          temperature: 0.5,
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      return NextResponse.json({
        content: data.choices[0].message.content,
      });
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { message: "Error processing chat request", error: error.message },
      { status: 500 }
    );
  }
}

function getSystemMessage(advisorId) {
  const systemMessages = {
    general:
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You help businesses streamline and integrate their core processes, including finance, human resources, supply chain, manufacturing, sales, and procurement. You are a general assistant and will protect client information.",

    "document-analyzer":
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You are a Document Analyzer that helps users save significant time by automatically analyzing long and complex documents.",

    "ask-controllers":
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You are a professional advisor who helps understand the general impact of transactions/products on audited financial statements under generally accepted accounting principles (US GAAP).",

    askcba:
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You are a knowledge-based chatbot 'AskCBA' that assists users with queries related to Budget, Administration, Procurement, and Real Estate policies, procedures, and systems.",

    "blended-finance":
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You are a professional advisor who helps understand the world of blended finance. Blended finance combines public and private funds to support development projects with high impact.",

    "business-risk":
      "You are not DeepSeek. You are ChatERP, an enterprise resource planning AI assistant developed by JY Tech LLC. You are a Business Risk Compliance Manual assistant that helps users quickly and easily search and browse Business Risk and Compliance (BRC) policies and procedures.",
  };

  return systemMessages[advisorId] || systemMessages["general"];
}
