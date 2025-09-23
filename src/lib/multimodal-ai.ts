'use client';

import { AIProviderManager } from '@/lib/ai-providers';
import { Message, Attachment } from '@/types';

export class MultimodalAIProvider extends AIProviderManager {
  async analyzeImage(imageUrl: string, prompt?: string): Promise<string> {
    try {
      const analysisPrompt = prompt || "Analyze this image and provide a detailed description of what you see.";
      
      if (this.provider === 'google') {
        return await this.analyzeImageWithGemini(imageUrl, analysisPrompt);
      } else if (this.provider === 'openai') {
        return await this.analyzeImageWithGPT4V(imageUrl, analysisPrompt);
      } else {
        // Fallback for providers without image analysis
        return "Image analysis is not available with the current AI provider. Please use Google Gemini or OpenAI GPT-4V for image analysis capabilities.";
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  async analyzeDocument(fileContent: string, fileName: string, mimeType: string): Promise<string> {
    try {
      let content = fileContent;
      
      // Handle different file types
      if (mimeType.includes('pdf')) {
        content = `PDF Document: ${fileName}\n\nContent: ${fileContent}`;
      } else if (mimeType.includes('text')) {
        content = `Text Document: ${fileName}\n\nContent: ${fileContent}`;
      } else if (mimeType.includes('json')) {
        content = `JSON Document: ${fileName}\n\nContent: ${fileContent}`;
      }

      const prompt = `Please analyze this document and provide insights about its content. Document: ${content}`;
      
      const response = await this.generateResponse(prompt, []);
      return response.message;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document. Please try again.');
    }
  }

  async generateResponseWithAttachments(
    userMessage: string,
    conversationHistory: Message[],
    attachments: Attachment[]
  ): Promise<string> {
    try {
      let enhancedMessage = userMessage;
      const imageAttachments = attachments.filter(a => a.type === 'image');
      const documentAttachments = attachments.filter(a => a.type === 'document');

      // Process image attachments
      if (imageAttachments.length > 0) {
        for (const image of imageAttachments) {
          const imageAnalysis = await this.analyzeImage(image.url, `Analyze this image in the context of: ${userMessage}`);
          enhancedMessage += `\n\nImage Analysis (${image.name}): ${imageAnalysis}`;
        }
      }

      // Process document attachments
      if (documentAttachments.length > 0) {
        for (const doc of documentAttachments) {
          if (doc.preview) {
            const docAnalysis = await this.analyzeDocument(doc.preview, doc.name, doc.mimeType || '');
            enhancedMessage += `\n\nDocument Analysis (${doc.name}): ${docAnalysis}`;
          }
        }
      }

      const response = await this.generateResponse(enhancedMessage, conversationHistory);
      return response.message;
    } catch (error) {
      console.error('Error generating response with attachments:', error);
      throw error;
    }
  }

  private async analyzeImageWithGemini(imageUrl: string, prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Google AI API key not configured");
    }

    // Convert image URL to base64 if it's a blob URL
    const imageData = await this.getImageData(imageUrl);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: imageData.mimeType,
                    data: imageData.base64
                  }
                }
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Google AI API error body:", errorBody);
      throw new Error(`Google AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I could not analyze this image.";
  }

  private async analyzeImageWithGPT4V(imageUrl: string, prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async getImageData(imageUrl: string): Promise<{ base64: string; mimeType: string }> {
    if (imageUrl.startsWith('data:')) {
      // Already a data URL
      const [header, base64] = imageUrl.split(',');
      const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
      return { base64, mimeType };
    }

    if (imageUrl.startsWith('blob:')) {
      // Convert blob URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const [header, base64] = result.split(',');
          const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
          resolve({ base64, mimeType });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // For regular URLs, we'd need to fetch and convert
    throw new Error('Unsupported image URL format');
  }

  async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        // For other file types, we might need specialized parsers
        resolve(`[File: ${file.name} - Content extraction not supported for ${file.type}]`);
      }
    });
  }

  async generateCodeExecution(code: string, language: string): Promise<{ output: string; error?: string }> {
    try {
      // This is a simplified code execution simulation
      // In a real implementation, you'd use a sandboxed environment
      
      const prompt = `Please analyze this ${language} code and explain what it does, then simulate its execution:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Code explanation
2. Expected output (if applicable)
3. Any potential issues or improvements`;

      const response = await this.generateResponse(prompt, []);
      
      return {
        output: response.message,
        error: undefined
      };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}