import { z } from 'zod';

// Enhanced password schema with stronger requirements
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least two numbers')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine(
    (password) => {
      // Check for at least two numbers
      const numbers = password.match(/[0-9]/g);
      return numbers && numbers.length >= 2;
    },
    'Password must contain at least two numbers'
  )
  .refine(
    (password) => {
      // Check for sequential characters
      return !/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(password);
    },
    'Password cannot contain sequential numbers'
  )
  .refine(
    (password) => {
      // Check for common words
      const commonWords = ['password', 'admin', '123456', 'qwerty'];
      return !commonWords.some(word => password.toLowerCase().includes(word));
    },
    'Password cannot contain common words'
  );

export function validatePassword(password: string): string[] {
  const result = passwordSchema.safeParse(password);
  
  if (!result.success) {
    return result.error.errors.map(error => error.message);
  }
  
  return [];
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // Length checks
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  
  // Character type checks
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if ((/[0-9]/g).test(password) && (password.match(/[0-9]/g) || []).length >= 2) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Additional complexity checks
  if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score++; // Multiple special chars
  if (!/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(password)) score++;
  
  const strengthMap = {
    0: { label: 'Very Weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-red-400' },
    2: { label: 'Fair', color: 'bg-yellow-500' },
    3: { label: 'Moderate', color: 'bg-yellow-400' },
    4: { label: 'Good', color: 'bg-blue-500' },
    5: { label: 'Strong', color: 'bg-green-500' },
    6: { label: 'Very Strong', color: 'bg-green-600' },
    7: { label: 'Excellent', color: 'bg-green-700' },
    8: { label: 'Exceptional', color: 'bg-green-800' },
  };
  
  return {
    score,
    ...strengthMap[score as keyof typeof strengthMap],
  };
}