import axios from 'axios';

class ChatService {
  static getSimulatedResponse(message, advisor) {
    const lowerMessage = message.toLowerCase();
    
    // Add a test message with Deepseek-style thinking content
    if (lowerMessage.includes('test') || lowerMessage.includes('thinking')) {
      return `I need to analyze what the user is asking about testing or thinking functionality.

The user seems to be testing the thinking mode feature of the application.

I should provide information about how thinking mode works and demonstrate that the feature is functioning correctly.

I'll explain the purpose of thinking mode and how it can be useful for transparency.
</think>

I see you're testing the thinking mode feature! This is working correctly if you can see my thought process above this message. The thinking mode allows you to see how I analyze and process your questions before providing a final answer. It's useful for understanding my reasoning process and for debugging complex queries.`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm ${advisor ? advisor.name : 'ChatERP'}. How can I help you today?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `I can help you with various ERP-related tasks. What specific area would you like assistance with?`;
    }
    
    if (advisor && advisor.id === 'document-analyzer' && lowerMessage.includes('analyze')) {
      return `I'll analyze that document for you. Please upload it or provide the text content.`;
    }
    
    if (advisor && advisor.id === 'personalize') {
      return `I'm your personalized assistant. I'll remember your preferences and adapt to your needs over time.`;
    }
    
    return `Thank you for your message. I'm ${advisor ? advisor.name : 'ChatERP'}, and I'm here to assist with your business needs. Could you provide more details about what you're looking for?`;
  }
  
  static chunkString(str, size) {
    const chunks = [];
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.slice(i, i + size));
    }
    return chunks;
  }
  
  static async sendMessage(message, advisorId, thinkMode = false, useStream = true) {
    try {
      if (useStream) {
        // Return a special object for streaming mode
        return this.streamResponse(message, advisorId, thinkMode);
      } else {
        // Regular non-streaming mode
        const response = await axios.post('/api/chat', {
          message,
          advisorId,
          thinkMode,
          stream: false
        });
        
        return {
          data: {
            content: response.data.content
          }
        };
      }
    } catch (error) {
      console.error('Error in ChatService:', error);
      throw error;
    }
  }

  static async sendMessageTest(message, advisor, onStream) {
    try {
      // In a real app, you would send this to an API
      // For now, we'll just simulate a response
      
      // Start streaming
      let streamedContent = "";
      
      // Simulate streaming by sending chunks of the response
      const response = this.getSimulatedResponse(message, advisor);
      const chunks = this.chunkString(response, 10);
      
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Delay between chunks
        streamedContent += chunk;
        onStream(streamedContent);
      }
      
      return streamedContent;
    } catch (error) {
      console.error("Error in ChatService:", error);
      throw error;
    }
  }

  static streamResponse(message, advisorId, thinkMode = false) {
    // Create a readable stream that will be fed by the EventSource
    const stream = new ReadableStream({
      start(controller) {
        // Create EventSource to connect to our API endpoint
        // Build the URL with properly encoded query parameters
        const params = new URLSearchParams();
        params.append('message', message);
        params.append('advisorId', advisorId);
        params.append('thinkMode', thinkMode);
        
        const eventSource = new EventSource(`/api/chat?${params.toString()}`);
        
        let accumulatedContent = '';
        
        // Handle incoming messages
        eventSource.onmessage = (event) => {
          if (event.data === '[DONE]') {
            // Stream is complete
            eventSource.close();
            controller.close();
            return;
          }
          
          try {
            const data = JSON.parse(event.data);
            if (data.content) {
              // Add to accumulated content
              accumulatedContent += data.content;
              // Enqueue the chunk
              controller.enqueue(data.content);
            } else if (data.error) {
              console.error('Stream error:', data.error);
              controller.error(new Error(data.error));
              eventSource.close();
            }
          } catch (error) {
            console.error('Error parsing event data:', error);
          }
        };
        
        // Handle errors
        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          controller.error(error);
          eventSource.close();
        };
      }
    });
    
    // Return a special object that includes both the stream and methods to consume it
    return {
      stream,
      isStream: true,
      // Helper method to convert stream to text
      async getText() {
        const reader = stream.getReader();
        let result = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += value;
          }
          return result;
        } catch (error) {
          console.error('Error reading stream:', error);
          throw error;
        }
      }
    };
  }
}

export default ChatService;
