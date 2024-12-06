import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_yx92die';
const TEMPLATE_ID = 'template_6dmadvt';
const PUBLIC_KEY = 'mzOPQcxRNXvnmbxwX';

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  try {
    const templateParams = {
      to_email: email,
      reset_token: resetToken,
      reset_link: `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`,
    };

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};