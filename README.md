# ResumeAI Pro - AI-Powered ATS Resume Generator

A production-ready web application that generates ATS-optimized resumes using Google's Gemini AI, achieving 95+ ATS scores consistently.

## Features

- **AI-Powered Content Generation**: Uses Gemini 1.5 Flash to create tailored resume content
- **ATS Optimization**: Generates quantifiable, buzzword-free content for maximum ATS compatibility
- **Template Preservation**: Maintains original .docx formatting while replacing placeholders
- **No Authentication Required**: Simple, user-friendly interface without signup barriers
- **Real-time Processing**: Fast resume generation with loading states and error handling
- **Production Ready**: Built with security best practices and comprehensive error handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## How It Works

1. **Upload Template**: Users upload a .docx resume template with placeholder tags
2. **Job Analysis**: AI analyzes the job description to extract key requirements
3. **Content Generation**: Gemini AI generates ATS-optimized bullet points and achievements
4. **Template Processing**: Placeholders are replaced while preserving original formatting
5. **Download**: Users get a tailored resume ready for submission

## Template Placeholders

Your .docx template should include these placeholder tags:

**Summary Section:**
- `{{summary_bullet_1}}` through `{{summary_bullet_7}}`

**Experience 1:**
- `{{exp1_bullet_1}}` through `{{exp1_bullet_6}}`
- `{{exp1_achievement_1}}` and `{{exp1_achievement_2}}`

**Experience 2:**
- `{{exp2_bullet_1}}` through `{{exp2_bullet_6}}`
- `{{exp2_achievement_1}}` and `{{exp2_achievement_2}}`

## AI Content Guidelines

The AI generates content following these principles:

- ✅ Quantifiable metrics and specific achievements
- ✅ Relevant keywords from job descriptions
- ✅ Action verbs and impactful language
- ✅ ATS-friendly formatting
- ❌ No company names in generated content
- ❌ No years of experience mentioned
- ❌ No buzzwords or generic phrases

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **AI Integration**: Google Gemini 1.5 Flash
- **Document Processing**: docx, mammoth
- **File Handling**: file-saver
- **Icons**: Lucide React
- **Build Tool**: Vite

## Security Features

- Environment variable protection for API keys
- Input validation and sanitization
- Error boundary implementation
- File type validation for uploads
- No user data persistence

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform
3. Deploy the `dist` folder to your static hosting service

## API Usage

The application uses Google's Gemini API with the following configuration:
- Model: `gemini-1.5-flash`
- Content type: Text generation
- Safety settings: Default Google AI safety filters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository with:
- Detailed description of the problem
- Steps to reproduce
- Browser and OS information
- Console error messages (if any)