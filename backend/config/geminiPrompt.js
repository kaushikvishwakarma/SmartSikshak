function generatePrompt(qaList) {
  const qaText = qaList.map(
    (qa, i) =>
      `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}\n`
  ).join('\n');

  return `You are an expert education evaluator and plagiarism checker. Analyze the following student assignment and evaluate each answer.

For each question, provide:
- Score (0-10)
- Constructive feedback
- Plagiarism analysis:
  - level: One of "Low", "Medium", or "High"
  - reason: Why this level was assigned

Also provide a summary of the overall evaluation, including a plagiarism summary.

Respond ONLY in raw JSON format (no code block, no explanation, no markdown). 

Example format:
{
  "questions": [
    {
      "question": "...",
      "answer": "...",
      "score": 0-10,
      "feedback": "...",
      "plagiarism": {
        "level": "Low",
        "reason": "Answer is original, language and structure are unique"
      }
    }
  ],
  "summary": {
    "overallScore": 7.8,
    "remark": "Good",
    "strengths": ["Well-structured answers", "Good understanding"],
    "improvements": ["Add more examples", "Explain concepts better"],
    "plagiarismSummary": {
      "level": "Low",
      "reason": "Most answers appear to be original with consistent writing style",
      "note": "No strong signs of AI-generated or copied content"
    }
  }
}

Assignment:
${qaText}`;
}

export default generatePrompt;
