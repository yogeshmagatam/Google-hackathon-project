                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIResponse {
  message: string;
  usage?: {
    tokens: number;
    cost?: number;
  };
  provider: string;
  metadata?: Record<string, any>;
}

export class AIProviderManager {
  protected provider: string;
  protected apiKey: string | undefined;

  constructor() {
    this.provider = process.env.AI_PROVIDER || "local";
    this.apiKey = this.getApiKey();

    // Debug logging
    console.log("AI Provider initialized:", {
      provider: this.provider,
      hasApiKey: !!this.apiKey,
      keyLength: this.apiKey ? this.apiKey.length : 0,
    });
  }

  setProvider(provider: string): void {
    this.provider = provider;
    this.apiKey = this.getApiKey();
    console.log("AI Provider changed to:", {
      provider: this.provider,
      hasApiKey: !!this.apiKey,
    });
  }

  private getApiKey(): string | undefined {
    switch (this.provider) {
      case "openai":
        return process.env.OPENAI_API_KEY;
      case "anthropic":
        return process.env.ANTHROPIC_API_KEY;
      case "huggingface":
        return process.env.HUGGINGFACE_API_KEY;
      case "google":
        return process.env.GOOGLE_AI_API_KEY || "AIzaSyDJ0ZTlSRA6MP_1yreDcTu2U9on5QTYtA4";
      case "groq":
        return process.env.GROQ_API_KEY;
      default:
        return undefined;
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<AIResponse> {
    try {
      let response: AIResponse;
      
      switch (this.provider) {
        case "openai":
          response = await this.callOpenAI(userMessage, conversationHistory);
          break;
        case "anthropic":
          response = await this.callAnthropic(userMessage, conversationHistory);
          break;
        case "huggingface":
          response = await this.callHuggingFace(userMessage, conversationHistory);
          break;
        case "google":
          response = await this.callGoogleAI(userMessage, conversationHistory);
          break;
        case "groq":
          response = await this.callGroq(userMessage, conversationHistory);
          break;
        default:
          response = await this.callLocalAI(userMessage, conversationHistory);
          break;
      }
      
      // If we got a quota exceeded response, don't throw an error - just return it
      if (response.metadata?.quotaExceeded) {
        console.warn(`${this.provider} quota exceeded, returning quota message`);
        return response;
      }
      
      return response;
      
    } catch (error) {
      console.error(`Error with ${this.provider} provider:`, error);
      
      // For quota errors that weren't handled gracefully, provide a better message
      if (error instanceof Error && (
        error.message.includes('quota') || 
        error.message.includes('rate limit') ||
        error.message.includes('429') ||
        error.message.includes('RESOURCE_EXHAUSTED')
      )) {
        console.warn(`${this.provider} quota/rate limit error, falling back to local AI`);
        const fallbackResponse = await this.callLocalAI(userMessage, conversationHistory);
        return {
          ...fallbackResponse,
          message: `⚠️ AI service quota reached. Using local processing: ${fallbackResponse.message}`,
        };
      }
      
      // Fallback to local AI for other errors
      return await this.callLocalAI(userMessage, conversationHistory);
    }
  }

  private async callOpenAI(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const messages = this.formatMessagesForOpenAI(userMessage, history);

    console.log("Calling OpenAI with messages:", {
      messageCount: messages.length,
      systemPrompt: messages[0]?.content?.substring(0, 100) + "...",
      userMessage: userMessage.substring(0, 100),
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: parseInt(process.env.MAX_TOKENS || "1000"),
        temperature: parseFloat(process.env.TEMPERATURE || "0.7"),
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("OpenAI response received:", {
      tokensUsed: data.usage?.total_tokens,
      responseLength: data.choices[0].message.content.length,
    });

    return {
      message: data.choices[0].message.content,
      usage: {
        tokens: data.usage?.total_tokens || 0,
      },
      provider: "openai",
    };
  }

  private async callAnthropic(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const prompt = this.formatMessagesForAnthropic(userMessage, history);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: parseInt(process.env.MAX_TOKENS || "1000"),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.content[0].text,
      usage: {
        tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
      },
      provider: "anthropic",
    };
  }

  private async callHuggingFace(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("Hugging Face API key not configured");
    }

    const prompt = this.formatMessagesForHuggingFace(userMessage, history);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: parseInt(process.env.MAX_TOKENS || "1000"),
            temperature: parseFloat(process.env.TEMPERATURE || "0.7"),
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message:
        data[0]?.generated_text ||
        "I apologize, but I could not generate a response.",
      provider: "huggingface",
    };
  }

  private async callGoogleAI(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("Google AI API key not configured");
    }

    const prompt = this.formatMessagesForGoogle(userMessage, history);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      
      try {
        const errorData = JSON.parse(errorBody);
        
        // Handle quota exceeded error specifically
        if (errorData.error?.code === 429 || errorData.error?.status === "RESOURCE_EXHAUSTED") {
          console.warn("Google AI quota exceeded, returning fallback message");
          return {
            message: "I apologize, but I've reached my daily limit for AI responses. Please try again tomorrow, or consider upgrading to a paid plan for unlimited access. In the meantime, I can still help you with basic career guidance based on our conversation.",
            provider: "google",
            metadata: { quotaExceeded: true }
          };
        }
        
        // Handle other specific errors
        if (errorData.error?.code === 403) {
          console.error("Google AI API access denied - check API key");
          throw new Error("API access denied. Please check your API key configuration.");
        }
        
        console.error("Google AI API error:", errorData);
        throw new Error(`Google AI API error: ${errorData.error?.message || response.statusText}`);
        
      } catch (parseError) {
        // If we can't parse the error, log the raw body and throw generic error
        console.error("Google AI API error (unparseable):", errorBody);
        throw new Error(`Google AI API error: ${response.statusText}`);
      }
    }

    const data = await response.json();

    return {
      message:
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I could not generate a response.",
      provider: "google",
    };
  }

  private async callGroq(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error("Groq API key not configured");
    }

    const messages = this.formatMessagesForOpenAI(userMessage, history); // Groq uses OpenAI format

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages,
          max_tokens: parseInt(process.env.MAX_TOKENS || "1000"),
          temperature: parseFloat(process.env.TEMPERATURE || "0.7"),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.choices[0].message.content,
      usage: {
        tokens: data.usage?.total_tokens || 0,
      },
      provider: "groq",
    };
  }

  private async callLocalAI(
    userMessage: string,
    history: Message[]
  ): Promise<AIResponse> {
    // Import the existing local AI logic
    const { generateCareerAdvice } = await import("./career-advisor");

    // Check if we should use custom prompt for local AI too
    const customPrompt = process.env.CUSTOM_SYSTEM_PROMPT;

    let response: string;

    if (customPrompt && customPrompt.trim() !== "") {
      // Use custom prompt approach with local AI
      response = await this.generateLocalWithCustomPrompt(
        userMessage,
        history,
        customPrompt
      );
    } else {
      // Use the original local AI logic
      response = await generateCareerAdvice(userMessage, history);
    }

    return {
      message: response,
      provider: "local",
    };
  }

  private async generateLocalWithCustomPrompt(
    userMessage: string,
    history: Message[],
    customPrompt: string
  ): Promise<string> {
    // Simple implementation that incorporates the custom prompt
    const contextualResponse = this.generateContextualResponse(
      userMessage,
      customPrompt
    );
    return contextualResponse;
  }

  private generateContextualResponse(
    userMessage: string,
    customPrompt: string
  ): string {
    // Extract key characteristics from the custom prompt
    const isUpbeat =
      customPrompt.toLowerCase().includes("upbeat") ||
      customPrompt.toLowerCase().includes("enthusiastic");
    const usesEmojis = customPrompt.toLowerCase().includes("emoji");
    const isNamed = customPrompt.includes("named ");

    let response = "";

    // Add greeting based on prompt style
    if (isUpbeat) {
      response += usesEmojis ? "🌟 Hello there! " : "Hello there! ";
    } else {
      response += "Hello! ";
    }

    // Extract name if specified
    if (isNamed) {
      const nameMatch = customPrompt.match(/named (\w+)/i);
      if (nameMatch) {
        response += `I'm ${nameMatch[1]}, and `;
      }
    }

    // Core career advice based on message content
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("career change") ||
      lowerMessage.includes("new career")
    ) {
      response += this.getCareerChangeAdvice(usesEmojis);
    } else if (
      lowerMessage.includes("skill") ||
      lowerMessage.includes("learn")
    ) {
      response += this.getSkillDevelopmentAdvice(usesEmojis);
    } else if (
      lowerMessage.includes("interview") ||
      lowerMessage.includes("job search")
    ) {
      response += this.getJobSearchAdvice(usesEmojis);
    } else if (
      lowerMessage.includes("salary") ||
      lowerMessage.includes("negotiate")
    ) {
      response += this.getSalaryAdvice(usesEmojis);
    } else {
      response += this.getGeneralCareerAdvice(usesEmojis);
    }

    // Add encouraging ending if prompt suggests it
    if (
      customPrompt.toLowerCase().includes("encouraging") ||
      customPrompt.toLowerCase().includes("motivational")
    ) {
      response += usesEmojis
        ? "\n\n🚀 You've got this! Remember, every expert was once a beginner. Keep moving forward!"
        : "\n\nYou've got this! Remember, every expert was once a beginner. Keep moving forward!";
    }

    return response;
  }

  private getCareerChangeAdvice(useEmojis: boolean): string {
    const emoji = useEmojis ? "🔄 " : "";
    return `${emoji}I'm excited to help you explore new career possibilities! Career changes can be incredibly rewarding.\n\n**Here's your action plan:**\n\n• **Self-Discovery**: Take time to identify your values, interests, and transferable skills\n• **Research**: Explore industries that align with your passions\n• **Network**: Connect with professionals in your target field\n• **Skill Building**: Identify and develop any missing skills\n• **Transition Strategy**: Plan your move carefully with realistic timelines`;
  }

  private getSkillDevelopmentAdvice(useEmojis: boolean): string {
    const emoji = useEmojis ? "📚 " : "";
    return `${emoji}I love that you're focused on growth! Skill development is the key to career success.\n\n**Top learning strategies:**\n\n• **Online Courses**: Platforms like Coursera, Udemy, and LinkedIn Learning\n• **Hands-on Projects**: Build a portfolio that showcases your abilities\n• **Mentorship**: Find experienced professionals to guide your learning\n• **Industry Events**: Attend conferences and workshops\n• **Practice**: Apply new skills in real-world scenarios`;
  }

  private getJobSearchAdvice(useEmojis: boolean): string {
    const emoji = useEmojis ? "🎯 " : "";
    return `${emoji}Let's get you that dream job! The job search process can be exciting when approached strategically.\n\n**Winning job search tactics:**\n\n• **Resume Optimization**: Tailor your resume for each application\n• **Interview Preparation**: Practice common questions and research companies\n• **Networking**: Leverage your professional connections\n• **Online Presence**: Optimize your LinkedIn profile\n• **Follow-up**: Send thoughtful thank-you notes after interviews`;
  }

  private getSalaryAdvice(useEmojis: boolean): string {
    const emoji = useEmojis ? "💰 " : "";
    return `${emoji}Great question! Knowing your worth and negotiating effectively is crucial for career success.\n\n**Salary negotiation tips:**\n\n• **Research**: Know the market rate for your role and location\n• **Document Value**: Prepare examples of your contributions and achievements\n• **Timing**: Negotiate after receiving an offer, not during interviews\n• **Be Confident**: Present your case professionally and with conviction\n• **Consider Total Package**: Look beyond base salary to benefits and growth opportunities`;
  }

  private getGeneralCareerAdvice(useEmojis: boolean): string {
    const emoji = useEmojis ? "✨ " : "";
    return `${emoji}I'm here to support your career journey! Whether you're just starting out or looking to advance, there are always opportunities to grow.\n\n**Key career success principles:**\n\n• **Continuous Learning**: Stay curious and keep developing new skills\n• **Professional Relationships**: Build genuine connections in your industry\n• **Goal Setting**: Define clear, achievable career objectives\n• **Personal Brand**: Consistently demonstrate your unique value\n• **Work-Life Balance**: Prioritize your well-being for long-term success\n\nWhat specific aspect of your career would you like to explore further?`;
  }

  private formatMessagesForOpenAI(userMessage: string, history: Message[]) {
    const systemPrompt = this.getSystemPrompt();
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history
    history.slice(-10).forEach((msg) => {
      // Last 10 messages for context
      messages.push({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      });
    });

    // Add current message
    messages.push({ role: "user", content: userMessage });

    return messages;
  }

  private formatMessagesForAnthropic(
    userMessage: string,
    history: Message[]
  ): string {
    const systemPrompt = this.getSystemPrompt();
    let prompt = `${systemPrompt}\n\nConversation History:\n`;

    history.slice(-5).forEach((msg) => {
      prompt += `${msg.sender === "user" ? "Human" : "Assistant"}: ${
        msg.text
      }\n`;
    });

    prompt += `\nHuman: ${userMessage}\n\nAssistant:`;
    return prompt;
  }

  private formatMessagesForHuggingFace(
    userMessage: string,
    history: Message[]
  ): string {
    let prompt = "";

    history.slice(-3).forEach((msg) => {
      prompt += `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}\n`;
    });

    prompt += `User: ${userMessage}\nBot:`;
    return prompt;
  }

  private formatMessagesForGoogle(
    userMessage: string,
    history: Message[]
  ): string {
    const systemPrompt = this.getSystemPrompt();
    let prompt = `${systemPrompt}\n\nConversation:\n`;

    history.slice(-5).forEach((msg) => {
      prompt += `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}\n`;
    });

    prompt += `User: ${userMessage}\nAI:`;
    return prompt;
  }

  private getSystemPrompt(): string {
    // Check for custom system prompt in environment variables
    const customPrompt = process.env.CUSTOM_SYSTEM_PROMPT;

    if (customPrompt && customPrompt.trim() !== "") {
      return customPrompt.trim();
    }

    // Default career advisor prompt
    return `You are an expert AI Career & Skills Advisor with deep knowledge in:
- Career development and transition planning
- Skills assessment and development recommendations
- Industry insights and job market trends
- Professional development strategies
- Interview preparation and job search tactics
- Salary negotiation and career advancement
- Work-life balance and career satisfaction

Your responses should be:
- Professional and supportive
- Actionable and specific
- Based on current industry best practices
- Personalized to the user's situation
- Encouraging while being realistic
- Well-structured with clear sections and bullet points
- Include relevant examples and resources when helpful

Always format your responses using Markdown for better readability. Be conversational but professional, and ask follow-up questions when appropriate to provide better assistance.`;
  }
}
