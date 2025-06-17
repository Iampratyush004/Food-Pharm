import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const RateLimitWarning = () => {
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updateRateLimitStatus = () => {
      const status = api.getRateLimitStatus();
      setRateLimitStatus(status);
      
      // Show warning if approaching limits or if rate limited
      const searchCount = parseInt(status.search.split('/')[0]);
      const productCount = parseInt(status.product.split('/')[0]);
      
      if (status.isRateLimited || searchCount >= 6 || productCount >= 70) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Update immediately
    updateRateLimitStatus();
    
    // Update every second for countdown
    const interval = setInterval(updateRateLimitStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showWarning || !rateLimitStatus) {
    return null;
  }

  const getWarningColor = () => {
    if (rateLimitStatus.isRateLimited) {
      return 'bg-red-50 border-red-400 text-red-700';
    }
    return 'bg-yellow-50 border-yellow-400 text-yellow-700';
  };

  const getWarningIcon = () => {
    if (rateLimitStatus.isRateLimited) {
      return (
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${getWarningColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getWarningIcon()}
        </div>
        <div className="ml-3">
          {rateLimitStatus.isRateLimited ? (
            <div>
              <p className="text-sm font-semibold">
                API Rate Limit Active
              </p>
              <p className="text-sm">
                Please wait <strong>{rateLimitStatus.timeRemaining} seconds</strong> before making new requests.
              </p>
              <p className="text-xs mt-1">
                Current usage: Search {rateLimitStatus.search}, Products {rateLimitStatus.product}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold">
                Approaching API Rate Limits
              </p>
              <p className="text-sm">
                Current usage: Search {rateLimitStatus.search}, Products {rateLimitStatus.product}
              </p>
              <p className="text-xs mt-1">
                Limits: Search 8/10, Products 80/100 per minute
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateLimitWarning; 