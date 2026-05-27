/**
 * Email Service - Extensible architecture for multiple form types
 *
 * This service handles communication with the Cloudflare Worker email API.
 * Designed to support multiple email types (quotation, job-application, contact-inquiry, etc.)
 *
 * Architecture:
 * - Generic sendEmail() handles all communication with Worker
 * - Type-specific functions (sendQuotationRequest, etc.) format data and call sendEmail()
 * - Worker routes based on emailType to use correct template and recipient
 */

// ============================================================================
// Types
// ============================================================================

export type EmailType = 'quotation' | 'job-application' | 'contact-inquiry' | 'technical-support';

export interface EmailResponse {
  details: {};
  success: boolean;
  message?: string;
  error?: string;
}

export interface QuotationFormData {
  serviceType: string[];
  projectName: string;
  location: string;
  timeline: string;
  description: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
}

// Future: Job Application Form Data
// export interface JobApplicationFormData {
//   position: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   resume: File;
//   coverLetter: string;
// }

// ============================================================================
// Configuration
// ============================================================================

const getWorkerUrl = (): string => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : undefined;

  if (hostname === 'stage.nsengineering.com.np') {
    return (
      process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE ||
      'https://email-worker-stage.emailapi-nsengineering.workers.dev'
    );
  }

  if (hostname === 'dev.nsengineering.com.np') {
    return (
      process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_DEV ||
      'https://email-worker-dev.emailapi-nsengineering.workers.dev'
    );
  }

  const url = process.env.NEXT_PUBLIC_EMAIL_WORKER_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_EMAIL_WORKER_URL is not configured');
  }

  return url;
};

// ============================================================================
// Core Email Sender (Generic)
// ============================================================================

/**
 * Generic email sender - handles communication with Cloudflare Worker
 * Used by all type-specific email functions
 */
async function sendEmail(
  emailType: EmailType,
  data: Record<string, any>,
  turnstileToken?: string
): Promise<EmailResponse> {
  try {
    const workerUrl = getWorkerUrl();

    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailType,
        data,
        turnstileToken, // For future Turnstile integration
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        details: {},
        error: `Failed to send email: ${errorText}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      details: result.details || {},
      message: result.message || 'Email sent successfully',
    };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      details: {},
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// ============================================================================
// Type-Specific Email Functions
// ============================================================================

/**
 * Send a quotation request email
 * Used by: /contact page (Request a Quote form)
 */
export async function sendQuotationRequest(
  formData: QuotationFormData,
  turnstileToken?: string
): Promise<EmailResponse> {
  // Format the data for the email template
  const emailData = {
    serviceType: formData.serviceType,
    projectName: formData.projectName,
    location: formData.location,
    timeline: formData.timeline,
    description: formData.description,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    submittedAt: new Date().toISOString(),
  };

  return sendEmail('quotation', emailData, turnstileToken);
}

/**
 * Send a job application email (Future implementation)
 * Used by: /careers page (Job Application form)
 */
// export async function sendJobApplication(
//   formData: JobApplicationFormData,
//   turnstileToken?: string
// ): Promise<EmailResponse> {
//   const emailData = {
//     position: formData.position,
//     fullName: formData.fullName,
//     email: formData.email,
//     phone: formData.phone,
//     coverLetter: formData.coverLetter,
//     submittedAt: new Date().toISOString(),
//   };
//
//   return sendEmail('job-application', emailData, turnstileToken);
// }

/**
 * Send a general contact inquiry email (Future implementation)
 * Used by: General contact forms
 */
// export async function sendContactInquiry(
//   formData: ContactInquiryFormData,
//   turnstileToken?: string
// ): Promise<EmailResponse> {
//   const emailData = {
//     name: formData.name,
//     email: formData.email,
//     subject: formData.subject,
//     message: formData.message,
//     submittedAt: new Date().toISOString(),
//   };
//
//   return sendEmail('contact-inquiry', emailData, turnstileToken);
// }

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Check if it's at least 10 digits and contains only numbers and +
  return /^[\d+]{10,15}$/.test(cleaned);
}

/**
 * Client-side validation for quotation form
 */
export function validateQuotationForm(formData: QuotationFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Service type validation
  if (!formData.serviceType || formData.serviceType.length === 0) {
    errors.push('Please select at least one service');
  }

  // Project details validation
  if (!formData.projectName?.trim()) {
    errors.push('Project name is required');
  }
  if (!formData.location?.trim()) {
    errors.push('Location is required');
  }
  if (!formData.timeline) {
    errors.push('Timeline is required');
  }

  // Contact information validation
  if (!formData.fullName?.trim()) {
    errors.push('Full name is required');
  }
  if (!formData.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }
  if (!formData.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!isValidPhone(formData.phone)) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
