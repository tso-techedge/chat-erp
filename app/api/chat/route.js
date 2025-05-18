import { NextResponse } from "next/server";

// Handler for GET requests (used for streaming)
export async function GET(request) {
  // Reuse the same logic as POST but with query parameters
  return handleChatRequest(request, true);
}

// Handler for POST requests
export async function POST(request) {
  return handleChatRequest(request, false);
}

// Shared handler for both GET and POST requests
async function handleChatRequest(request, isGetRequest) {
  try {
    let message, advisorId, thinkMode = false, streamMode = false;
    
    if (isGetRequest) {
      // Parse query parameters for GET requests (streaming)
      const url = new URL(request.url);
      message = url.searchParams.get('message') || '';
      advisorId = url.searchParams.get('advisorId') || 'general';
      thinkMode = url.searchParams.get('thinkMode') === 'true';
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
    
    // Add think mode instructions if enabled
    if (thinkMode) {
      systemMessage += "\n\nPlease think step by step. First, analyze the question carefully. Then, break down your reasoning process explicitly, showing your work as you arrive at the answer. Consider different angles and explain your thought process in detail.\n\nWrap your thinking process in <think> and </think> tags. After your thinking process, provide a clear, concise final answer without the tags. For example:\n<think>\nHere I analyze the problem...\nStep 1: ...\nStep 2: ...\n</think>\nHere's my final answer based on my analysis.";
    }

    const API_URL =
      process.env.API_URL || "https://api.operatornext.cn/v1/chat/completions";
    const API_KEY = process.env.API_KEY;

    // If streaming is requested, handle it differently
    if (streamMode || isGetRequest) {
      // Create a TransformStream for streaming the response
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      // Start the fetch request without awaiting it
      fetch(API_URL, {
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
          stream: true, // Enable streaming
          model: "deepseek-v3-250324",
          temperature: 0.5,
          presence_penalty: 0,
          frequency_penalty: 0,
          top_p: 1,
          max_tokens: 4000,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorMessage = `API error: ${response.status}`;
          writer.write(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
          writer.close();
          return;
        }

        const reader = response.body.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Decode the chunk and add it to our buffer
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete SSE messages
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6); // Remove "data: " prefix
                if (data === "[DONE]") {
                  // End of stream
                  writer.write(encoder.encode(`data: [DONE]\n\n`));
                  continue;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                    // Forward the content chunk
                    writer.write(encoder.encode(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`));
                  }
                } catch (e) {
                  console.error("Error parsing SSE message:", e);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error reading stream:", error);
          writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        } finally {
          writer.close();
        }
      }).catch((error) => {
        console.error("Fetch error:", error);
        writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
        writer.close();
      });

      // Return the readable stream as the response
      return new Response(stream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
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
