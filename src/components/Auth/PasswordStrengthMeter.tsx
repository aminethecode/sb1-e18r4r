import React from 'react';
import { getPasswordStrength } from '../../utils/passwordValidation';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  const maxScore = 6;
  
  return (
    <div className="mt-1">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
      <p className={`text-xs mt-1 ${score <= 1 ? 'text-red-500' : 'text-gray-500'}`}>
        Password strength: {label}
      </p>
    </div>
  );
};