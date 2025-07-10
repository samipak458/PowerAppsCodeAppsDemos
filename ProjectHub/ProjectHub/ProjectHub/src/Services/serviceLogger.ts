import { DEFAULT_LOG_CONFIG } from '../config/serviceConfig';

/**
 * Generic service logging configuration
 * Controls whether service operations are logged to the console
 * 
 * Logging is configured via the CONFIG constant in serviceConfig.ts
 */

interface ServiceLogConfig {
  enabled: boolean;
  logLevel: 'basic' | 'detailed';
  services: Record<string, boolean>;
}

class ServiceLogger {
  private static _instance: ServiceLogger;
  private _config: ServiceLogConfig;

  private constructor() {
    // Use the configuration from serviceConfig.ts
    this._config = { ...DEFAULT_LOG_CONFIG };
  }

  public static getInstance(): ServiceLogger {
    if (!ServiceLogger._instance) {
      ServiceLogger._instance = new ServiceLogger();
    }
    return ServiceLogger._instance;
  }

  public configure(config: Partial<ServiceLogConfig>): void {
    this._config = { ...this._config, ...config };
  }

  public shouldLog(service: string): boolean {
    return this._config.enabled && (this._config.services[service] !== false);
  }

  public log(service: string, operation: string, data: unknown, result?: unknown): void {
    if (!this.shouldLog(service)) {
      return;
    }

    if (this._config.logLevel === 'basic') {
      console.log(`[${service}] ${operation}`);
    } else {
      const logData: Record<string, unknown> = {
        service,
        operation,
        input: data,
      };
      
      if (result !== undefined) {
        logData.result = result;
      }
      
      console.log(`[${service}] ${operation}:`, logData);
    }
  }

  public getConfig(): ServiceLogConfig {
    return { ...this._config };
  }
}

// Export singleton instance and convenience functions
export const serviceLogger = ServiceLogger.getInstance();

export const logServiceOperation = (
  service: string, 
  operation: string, 
  data: unknown, 
  result?: unknown
) => {
  serviceLogger.log(service, operation, data, result);
};

export const configureServiceLogging = (config: Partial<ServiceLogConfig>) => {
  serviceLogger.configure(config);
};

/**
 * Usage examples:
 * 
 * // Basic logging - service provides its own name and operation
 * logServiceOperation('ClientService', 'SEARCH_CLIENTS', params, result);
 * logServiceOperation('ProjectService', 'CREATE_PROJECT', project, newProject);
 * logServiceOperation('AuthService', 'LOGIN_USER', credentials, token);
 * logServiceOperation('APIService', 'FETCH_DATA', requestData, response);
 * 
 * // Configure logging at runtime (if needed)
 * configureServiceLogging({ 
 *   enabled: true, 
 *   logLevel: 'detailed',
 *   services: { 
 *     ClientService: true, 
 *     ProjectService: false, 
 *     AuthService: true, 
 *     APIService: true
 *   }
 * });
 * 
 * // To configure logging, modify the CONFIG.logging constant in serviceConfig.ts
 * // All configuration is code-based and centralized in one place
 * 
 * // The logger is now completely generic:
 * // - Services provide their own names
 * // - No hardcoded emojis or service mappings
 * // - Simple, flexible configuration
 * // - Clean console output with just the information that matters
 */
