import ReactGA from 'react-ga4';
import { logger } from './logger';

let initialized = false;

/**
 * Initialize Google Analytics 4
 */
export const initGA = () => {
  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  if (!trackingId) {
    logger.warn({
      type: 'analytics_disabled',
      message: 'Google Analytics tracking ID not configured',
    });
    return;
  }

  if (typeof window !== 'undefined' && !initialized) {
    ReactGA.initialize(trackingId, {
      gaOptions: {
        anonymizeIp: true,
      },
    });
    initialized = true;
    logger.info({ type: 'analytics_initialized' });
  }
};

/**
 * Track page view
 */
export const trackPageView = (path: string) => {
  if (initialized) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

/**
 * Track custom event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (initialized) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    logger.info({
      type: 'analytics_event',
      category,
      action,
      label,
    });
  }
};

// Predefined event tracking functions for common actions

export const trackSignup = (method: string) => {
  trackEvent('User', 'Signup', method);
};

export const trackLogin = (method: string) => {
  trackEvent('User', 'Login', method);
};

export const trackSearch = (tier: string, hasResults: boolean) => {
  trackEvent('Search', 'Perform Search', tier, hasResults ? 1 : 0);
};

export const trackPropertySaved = (tier: string) => {
  trackEvent('Property', 'Save Property', tier);
};

export const trackCheckoutInitiated = (tier: string, price: number) => {
  trackEvent('Subscription', 'Checkout Initiated', tier, price);
};

export const trackSubscriptionPurchased = (tier: string, price: number) => {
  trackEvent('Subscription', 'Purchase Completed', tier, price);
};

export const trackSubscriptionCancelled = (tier: string) => {
  trackEvent('Subscription', 'Cancelled', tier);
};

export const trackUpgradeClicked = (fromTier: string, toTier: string) => {
  trackEvent('Subscription', 'Upgrade Clicked', `${fromTier} to ${toTier}`);
};

export const trackExportPDF = (tier: string) => {
  trackEvent('Export', 'PDF Export', tier);
};

export const trackFeatureViewed = (featureName: string, tier: string) => {
  trackEvent('Feature', 'View', `${featureName} - ${tier}`);
};

export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('Error', errorType, errorMessage);
};

export const trackContactFormSubmitted = () => {
  trackEvent('Contact', 'Form Submitted', 'Contact Page');
};

/**
 * Track page visit to database
 */
export const trackPageVisit = async (pagePath: string, pageTitle?: string) => {
  try {
    // Get session ID from localStorage or create new one
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('session_id') || '';
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('session_id', sessionId);
      }
    }

    // Get device info
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 
                       /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'desktop';

    const visitData = {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      session_id: sessionId,
      user_agent: userAgent,
      device_type: deviceType,
      visited_at: new Date().toISOString(),
    };

    // Send to API endpoint
    await fetch('/api/analytics/track-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData),
    });
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
};
