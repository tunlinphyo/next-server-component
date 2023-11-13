
export interface AlertConfig {
  buttonText?: string;
  theme?: 'device' | 'light' | 'dark';
  waitAnimation?: boolean;
}

export interface ConfirmConfig {
  cancelText?: string;
  confirmText?: string;
  theme?: string;
  waitAnimation?: boolean;
}

export interface PromptConfig {
  name?: string;
  placeholder?: string;
  regx?: RegExp | null;
  error?: string;
  required?: boolean;
  cancelText?: string;
  confirmText?: string;
  theme?: string;
  waitAnimation?: boolean;
}
