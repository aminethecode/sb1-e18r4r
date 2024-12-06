import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = [
    {
      label: 'At least 12 characters',
      met: password.length >= 12,
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains at least two numbers',
      met: (password.match(/[0-9]/g) || []).length >= 2,
    },
    {
      label: 'Contains special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      label: 'No sequential numbers',
      met: !/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(password),
    },
    {
      label: 'No common words',
      met: !['password', 'admin', '123456', 'qwerty'].some(word => 
        password.toLowerCase().includes(word)
      ),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Password requirements:
      </p>
      <ul className="text-xs space-y-1">
        {requirements.map(({ label, met }) => (
          <li
            key={label}
            className={`flex items-center gap-1 ${
              met ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};