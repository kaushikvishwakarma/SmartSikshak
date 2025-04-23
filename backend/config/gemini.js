import axios from 'axios';

export const predictUsingGemini = async (prompt) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No prediction generated.';
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return 'AI prediction failed. Please try again later.';
  }
};
