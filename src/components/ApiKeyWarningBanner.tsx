import React, { useState } from 'react';
import { checkGoogleApiKey, getApiKeySetupInstructions } from '../utils/envCheck';

const ApiKeyWarningBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const apiKeyStatus = checkGoogleApiKey();

  // Don't show if API key is configured or banner is dismissed
  if (apiKeyStatus.isConfigured || isDismissed) {
    return null;
  }

  const handleShowInstructions = () => {
    alert(getApiKeySetupInstructions());
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0">
            <i className="fa-solid fa-exclamation-triangle text-amber-600 text-lg"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">
              API Configuration Required
            </p>
            <p className="text-xs text-amber-800">
              {apiKeyStatus.error}. The application won't be able to generate reports until configured.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShowInstructions}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Setup Instructions
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="px-2 py-1.5 text-amber-600 hover:text-amber-800 text-xs"
            aria-label="Dismiss"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarningBanner;
