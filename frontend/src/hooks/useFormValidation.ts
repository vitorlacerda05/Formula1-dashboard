
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: string, rules: ValidationRules): string => {
    if (rules.required && !value.trim()) {
      return 'Este campo é obrigatório';
    }

    if (value && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return `Mínimo ${rules.minLength} caracteres`;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return `Máximo ${rules.maxLength} caracteres`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (value && rules.custom && !rules.custom(value)) {
      return 'Valor inválido';
    }

    return '';
  };

  const validate = (name: string, value: string, rules: ValidationRules) => {
    const error = validateField(name, value, rules);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return !error;
  };

  const clearError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
    hasErrors
  };
};
