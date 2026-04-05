import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, apiKey, mode, modelType } = req.body;
  
  // Use user's key if provided, otherwise fallback to the secure server environment key
  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  if (!activeKey) {
    return res.status(400).json({ error: "Server API Key not configured and no custom key provided." });
  }

  try {
    const genAI = new GoogleGenerativeAI(activeKey);
    const modelName = modelType === 'advanced' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemInstruction = `You are an elite software engineer and code reviewer.
Your job is to analyze user-submitted code and provide:
1. Error detection (syntax, logical, runtime issues)
2. Code corrections (fixed version of the code)
3. Optimization suggestions (performance, readability, best practices)
4. Explanation in simple terms
5. Code quality score (0–100)

Mode Context: ${mode === 'strict' ? 'Strict Mode (Senior Reviewer): Flag bad practices, enforce clean coding, suggest industry-level improvements.' : 'Beginner Mode: Simplified explanations, avoid heavy jargon, learning-focused suggestions.'}

Provide your response in the strictly structured format below. DO NOT DEVIATE.

### === CODE ANALYSIS ===
- Language detected: <language>
- Summary: <summary>

### === ERRORS FOUND ===
- <list of errors or 'No critical errors found'>

### === EXPLANATION & SUGGESTIONS ===
- <Explanation of fixes and complexity analysis (Time/Space)>

### === CODE QUALITY SCORE ===
<Provide ONLY a number from 0 to 100>

### === FIXED CODE ===
\`\`\`<language>
<corrected full code here>
\`\`\`
`;

    const prompt = `${systemInstruction}\n\nHere is the user's code to analyze:\n\n${code}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    function parseAIResponse(text) {
      const analysisMatch = text.match(/### === CODE ANALYSIS ===\n([\s\S]*?)(?=### === ERRORS FOUND ===)/);
      const errorsMatch = text.match(/### === ERRORS FOUND ===\n([\s\S]*?)(?=### === EXPLANATION & SUGGESTIONS ===)/);
      const explanationMatch = text.match(/### === EXPLANATION & SUGGESTIONS ===\n([\s\S]*?)(?=### === CODE QUALITY SCORE ===)/);
      const scoreMatch = text.match(/### === CODE QUALITY SCORE ===\n([\s\S]*?)(?=### === FIXED CODE ===)/);
      const codeMatch = text.match(/### === FIXED CODE ===\n([\s\S]*?)$/);

      return {
        analysis: analysisMatch ? analysisMatch[1].trim() : "Analysis failed to format.",
        errors: errorsMatch ? errorsMatch[1].trim() : "No errors identified.",
        explanation: explanationMatch ? explanationMatch[1].trim() : "No explanation provided.",
        score: scoreMatch ? parseInt(scoreMatch[1].trim().replace(/[^0-9]/g, '')) || 80 : 0,
        fixedCode: codeMatch ? codeMatch[1].replace(/^\`\`\`.*\n/, '').replace(/\`\`\`$/, '').trim() : "",
        raw: text
      };
    }

    const parsedData = parseAIResponse(response.text());
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Failed to analyze code" });
  }
}
