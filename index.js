import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gkresumegenerator.netlify.app', 'https://ai-powered-resume-ge-i4n2.bolt.host']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate resume content endpoint
app.post('/api/generate-resume', async (req, res) => {
  try {
    const { companyName, jobTitle, jobDescription, userToken } = req.body;

    // Validate required fields
    if (!companyName || !jobTitle || !jobDescription) {
      return res.status(400).json({ 
        error: 'Missing required fields: companyName, jobTitle, jobDescription' 
      });
    }

    // Here you could add Firebase Admin SDK to verify the user token
    // For now, we'll proceed with the generation

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert ATS-optimized resume writer with 15+ years of experience. Your goal is to create resume content that achieves 95+ ATS score by strategically incorporating **ALL** relevant keywords and using proven ATS formatting.

CRITICAL ATS OPTIMIZATION REQUIREMENTS:
1. Use **EXACT KEYWORDS** from the job description naturally within context — include ALL listed below.
2. Include industry-standard tools, platforms, frameworks, and methodologies.
3. Use strong action verbs recognized by ATS systems (e.g., Led, Developed, Implemented).
4. Incorporate measurable achievements with numbers, percentages, or timeframes.
5. Ensure every bullet point contains at least 2-3 relevant keywords.
6. Match the job requirements with specific examples from the candidate's background.
7. Maintain professional language while ensuring keyword density.
8. **NEVER mention specific company names or job roles in ANY generated content.**

JOB TITLE: ${jobTitle}
COMPANY: ${companyName}

BASED ON THE FOLLOWING JOB DESCRIPTION:
${jobDescription}

Generate ATS-friendly resume content in this EXACT format:

<SUMMARY>
• [25-30 words, max two lines (~80 chars per line)] Technical skills showcase featuring specific tools, platforms, and methodologies mentioned in the job description
• [25-30 words, max two lines (~80 chars per line)] Leadership and collaboration experience emphasizing team management and cross-functional project delivery
• [25-30 words, max two lines (~80 chars per line)] Quantifiable achievements demonstrating impact on business outcomes, efficiency improvements, or cost savings
• [25-30 words, max two lines (~80 chars per line)] Process optimization and automation expertise relevant to target role responsibilities
• [25-30 words, max two lines (~80 chars per line)] Innovation and problem-solving capabilities with examples of complex technical challenges resolved
• [25-30 words, max two lines (~80 chars per line)] Industry knowledge and best practices implementation aligned with business objectives
• [25-30 words, max two lines (~80 chars per line)] Professional development and continuous learning commitment showcasing relevant certifications or advanced skills
</SUMMARY>

<EXPERIENCE_1>
• [25-30 words, max two lines (~80 chars per line)] Led major project or initiative using key technologies from job description with quantifiable business impact
• [25-30 words, max two lines (~80 chars per line)] Collaborated with cross-functional teams to deliver solutions addressing specific requirements mentioned in the JD
• [25-30 words, max two lines (~80 chars per line)] Implemented automation, optimization, or innovative solutions resulting in measurable improvements
• [25-30 words, max two lines (~80 chars per line)] Managed or mentored team members while utilizing specific tools and platforms required for target role
• [25-30 words, max two lines (~80 chars per line)] Achieved significant cost savings, efficiency gains, or performance improvements through strategic initiatives
• [25-30 words, max two lines (~80 chars per line)] Developed or enhanced processes, systems, or workflows directly relevant to the target role responsibilities
</EXPERIENCE_1>

<ACHIEVEMENTS_1>
• [25-30 words, max two lines (~80 chars per line)] Quantifiable achievement showcasing measurable business impact using relevant technologies and methodologies from job description
• [25-30 words, max two lines (~80 chars per line)] Recognition or award received for exceptional performance in key areas mentioned in target role requirements
</ACHIEVEMENTS_1>

<EXPERIENCE_2>
• [25-30 words, max two lines (~80 chars per line)] Delivered complex technical project showcasing expertise in key areas mentioned in the job requirements
• [25-30 words, max two lines (~80 chars per line)] Partnered with stakeholders to implement solutions addressing business challenges similar to target needs
• [25-30 words, max two lines (~80 chars per line)] Optimized existing systems or processes using technologies and methodologies specified in the job description
• [25-30 words, max two lines (~80 chars per line)] Provided technical leadership and guidance while working with relevant tools and platforms
• [25-30 words, max two lines (~80 chars per line)] Achieved measurable results in performance, quality, or operational efficiency improvements
• [25-30 words, max two lines (~80 chars per line)] Contributed to strategic initiatives that align with the responsibilities and goals of the target position
</EXPERIENCE_2>

<ACHIEVEMENTS_2>
• [25-30 words, max two lines (~80 chars per line)] Outstanding accomplishment demonstrating expertise in technologies and skills relevant to target role requirements
• [25-30 words, max two lines (~80 chars per line)] Significant milestone achieved through application of methodologies and tools mentioned in job description
</ACHIEVEMENTS_2>

MANDATORY REQUIREMENTS:
- Each bullet point must be exactly 25-30 words
- Naturally incorporate **ALL** provided keywords from the job description
- Include specific numbers, percentages, or quantifiable results where possible
- Use strong action verbs (Led, Implemented, Developed, Optimized, Achieved, etc.)
- Ensure content is relevant to target role requirements
- Maintain professional tone and ATS-friendly language
- Avoid buzzwords without substance
- Each bullet must fit on **no more than two lines** in a standard 11 pt Times New Roman Word document (wrap at ~80 characters).
- **NEVER mention specific company names or job roles in generated content**

Generate ONLY the formatted content above with no additional commentary or explanations. Return the content in JSON format with the following structure:
{
  "summary_bullet_1": "content here",
  "summary_bullet_2": "content here",
  "summary_bullet_3": "content here",
  "summary_bullet_4": "content here",
  "summary_bullet_5": "content here",
  "summary_bullet_6": "content here",
  "summary_bullet_7": "content here",
  "exp1_bullet_1": "content here",
  "exp1_bullet_2": "content here",
  "exp1_bullet_3": "content here",
  "exp1_bullet_4": "content here",
  "exp1_bullet_5": "content here",
  "exp1_bullet_6": "content here",
  "exp1_achievement_1": "content here",
  "exp1_achievement_2": "content here",
  "exp2_bullet_1": "content here",
  "exp2_bullet_2": "content here",
  "exp2_bullet_3": "content here",
  "exp2_bullet_4": "content here",
  "exp2_bullet_5": "content here",
  "exp2_bullet_6": "content here",
  "exp2_achievement_1": "content here",
  "exp2_achievement_2": "content here"
}

Return ONLY the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract only the JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }
    
    const generatedContent = JSON.parse(jsonMatch[0]);
    res.json(generatedContent);

  } catch (error) {
    console.error('Error generating content:', error);
    
    if (error.message?.includes('503') || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'The AI model is currently overloaded. Please try again in a few moments.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate resume content. Please try again.' 
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});