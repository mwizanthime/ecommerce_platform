// backend/services/deepseekService.js
const axios = require('axios');

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  async predictStockDemand(productId, historicalData) {
    try {
      const prompt = `
        Based on the following historical sales data, predict the demand for the next 30 days:
        ${JSON.stringify(historicalData)}
        
        Please provide:
        1. Predicted daily demand
        2. Confidence score
        3. Recommended reorder points
      `;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('DeepSeek AI API error:', error);
      throw new Error('Failed to get prediction from AI service');
    }
  }

  parseAIResponse(response) {
    // Parse the AI response and extract structured data
    // This would need to be customized based on the AI's response format
    return {
      predictedDemand: 0,
      confidence: 0,
      recommendations: []
    };
  }
}

module.exports = new DeepSeekService();