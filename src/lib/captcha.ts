/**
 * hCaptcha Server-Side Verification
 * 
 * Verifies hCaptcha tokens on the server to prevent bot signups and brute-force attacks.
 */

interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Verify hCaptcha token with hCaptcha API
 * @param token - The hCaptcha response token from the client
 * @returns Promise<boolean> - True if verification succeeded
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('HCAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data: HCaptchaVerifyResponse = await response.json();
    
    if (!data.success) {
      console.error('hCaptcha verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying hCaptcha:', error);
    return false;
  }
}
