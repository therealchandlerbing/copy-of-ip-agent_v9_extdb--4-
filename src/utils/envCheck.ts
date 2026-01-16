/**
 * Utility functions for checking environment configuration
 */

export interface EnvCheckResult {
  isConfigured: boolean;
  apiKey?: string;
  error?: string;
}

/**
 * Check if Google API key is properly configured
 * @returns EnvCheckResult with configuration status
 */
export function checkGoogleApiKey(): EnvCheckResult {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      return {
        isConfigured: false,
        error: 'VITE_GOOGLE_API_KEY environment variable is not set'
      };
    }

    if (apiKey === 'your_google_gemini_api_key_here' || apiKey === 'your_api_key_here') {
      return {
        isConfigured: false,
        error: 'VITE_GOOGLE_API_KEY contains placeholder value'
      };
    }

    // Basic validation - Google API keys are 39 characters and start with "AIza"
    if (!apiKey.startsWith('AIza') || apiKey.length !== 39) {
      return {
        isConfigured: false,
        error: 'VITE_GOOGLE_API_KEY appears to be invalid (incorrect format or length)'
      };
    }

    return {
      isConfigured: true,
      apiKey: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    };
  } catch (e) {
    return {
      isConfigured: false,
      error: 'Failed to check API key configuration'
    };
  }
}

/**
 * Get setup instructions for missing API key
 */
export function getApiKeySetupInstructions(): string {
  return `⚠️ Configuration Required

The Google API key is not configured correctly. To fix this:

1. Create a .env file in the project root (if it doesn't exist).
2. Add the following line:
   VITE_GOOGLE_API_KEY=your_api_key_here
3. Get your API key from: https://aistudio.google.com/app/apikey
4. Restart the development server (e.g., 'npm run dev').

Note: In Vite, environment variables are embedded at build time. You must restart the server after changing .env files.`;
}
