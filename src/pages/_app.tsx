import '@/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import CookieConsent from 'react-cookie-consent'
import { AuthProvider } from '@/contexts/AuthContext'
import { initGA, trackPageView, trackPageVisit } from '@/lib/analytics'
import { logger } from '@/lib/logger'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Initialize Google Analytics and track page visits
  useEffect(() => {
    initGA()
    
    // Track initial page view (Google Analytics)
    trackPageView(router.pathname)
    
    // Track initial page visit (Database)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      trackPageVisit(router.pathname, document.title)
    }

    // Track page changes
    const handleRouteChange = (url: string) => {
      trackPageView(url)
      if (typeof document !== 'undefined') {
        trackPageVisit(url, document.title)
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, router.pathname])

  // Global error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error({
        type: 'unhandled_error',
        error: event.error?.message || event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error({
        type: 'unhandled_rejection',
        reason: event.reason,
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  return (
    <AuthProvider>
      <Component {...pageProps} />
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#002B5C',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="delawareZoningConsent"
        expires={365}
        overlay={false}
        buttonStyle={{
          background: '#F2AF29',
          color: '#002B5C',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          padding: '10px 24px',
        }}
        declineButtonStyle={{
          background: 'transparent',
          border: '2px solid #E5E7EB',
          color: '#6B7280',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          padding: '8px 22px',
        }}
        style={{
          background: '#1F2937',
          padding: '20px',
          alignItems: 'center',
        }}
        contentStyle={{
          flex: '1 0 auto',
          margin: '0 20px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#F3F4F6' }}>
          We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
          By clicking &quot;Accept All,&quot; you consent to our use of cookies.{' '}
          <a 
            href="/privacy" 
            style={{ color: '#F2AF29', textDecoration: 'underline' }}
          >
            Learn more
          </a>
        </span>
      </CookieConsent>
    </AuthProvider>
  )
}

