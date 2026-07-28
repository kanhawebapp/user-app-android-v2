import {ReactNode} from 'react';

export interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

export interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: unknown[];
}

export interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}
