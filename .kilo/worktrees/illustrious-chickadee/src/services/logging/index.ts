// ============================================
// DhwaniAstro - Logging Service
// ============================================

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log entry interface
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logging service for enterprise-grade logging
 */
class LoggingService {
  private logQueue: LogEntry[] = [];
  private isInitialized = false;
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Initialize logging service
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Set up periodic flush in production
    if (!__DEV__) {
      this.flushInterval = setInterval(() => {
        this.flushLogs();
      }, 30000);
    }

    this.isInitialized = true;
    this.info('[LoggingService] Initialized');
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Console output in development
    if (__DEV__) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : level;
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, context || {}, error);
    }

    // Add to queue for batch processing
    this.logQueue.push(entry);

    // Flush immediately for errors in production
    if (level === LogLevel.ERROR) {
      this.flushLogs();
    }
  }

  /**
   * Flush logs to remote service
   */
  private flushLogs(): void {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    // In production, send to remote logging service
    if (!__DEV__) {
      // TODO: Send to remote logging service (e.g., Sentry, LogRocket)
      this.sendLogsToRemote(logsToSend);
    }
  }

  /**
   * Send logs to remote service
   */
  private async sendLogsToRemote(logs: LogEntry[]): Promise<void> {
    try {
      // Placeholder for remote logging integration
      // await analyticsService.logEvents('batch_logs', { logs });
      console.log(`[LoggingService] Sending ${logs.length} logs to remote`);
    } catch (error) {
      console.log('[LoggingService] Failed to send logs:', error);
    }
  }

  /**
   * Create a breadcrumb for crash reporting
   */
  addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    this.info(`[Breadcrumb] ${category}: ${message}`, data);

    // In production, send to crash reporting service
    if (!__DEV__) {
      // TODO: Add to Sentry/ Crashlytics breadcrumbs
    }
  }

  /**
   * Log performance metric
   */
  logPerformance(name: string, duration: number, metadata?: Record<string, unknown>): void {
    this.info(`[Performance] ${name} took ${duration}ms`, {
      duration,
      ...metadata,
    });
  }

  /**
   * Log API request
   */
  logApiRequest(
    method: string,
    url: string,
    status: number,
    duration: number,
    error?: string
  ): void {
    this.info(`[API] ${method} ${url} - ${status} (${duration}ms)`, {
      method,
      url,
      status,
      duration,
      error,
    });
  }

  /**
   * Log user action for analytics
   */
  logUserAction(action: string, properties?: Record<string, unknown>): void {
    this.info(`[UserAction] ${action}`, properties);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logQueue = [];
  }

  /**
   * Shutdown logging service
   */
  shutdown(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushLogs();
    this.isInitialized = false;
  }
}

export const loggingService = new LoggingService();
export default loggingService;

