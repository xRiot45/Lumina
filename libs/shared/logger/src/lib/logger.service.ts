import { Inject, Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface LogMetadata {
    context?: string;
    correlationId?: string;
    userId?: string;
    [key: string]: unknown;
}

type LogMessage = string | LogMetadata;

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) {}

    /**
     * Format a log message with additional metadata.
     * @param {LogMessage} message - The log message to format.
     * @param {string} [context] - The context of the log message.
     * @returns {LogMetadata} The formatted log message with additional metadata.
     */
    private formatMessage(message: LogMessage, context?: string): LogMetadata {
        const timestamp = new Date().toISOString();

        if (typeof message === 'object') {
            return {
                ...message,
                context: context ?? (message['context'] as string),
                timestamp,
            };
        }

        return { message, context, timestamp };
    }

    /**
     * Log a message with optional additional metadata.
     * @param {LogMessage} message - The message to log.
     * @param {string} [context] - The context of the log message.
     */
    log(message: LogMessage, context?: string): void {
        const formatted = this.formatMessage(message, context);
        const logHeadline = typeof message === 'string' ? message : ((message['message'] as string) ?? 'Log Entry');
        this.logger.info(logHeadline, formatted);
    }

    /**
     * Log an error with optional additional metadata.
     * @param {LogMessage | Error} message - The error message to log.
     * @param {string} [trace] - The stack trace of the error.
     * @param {string} [context] - The context of the log message.
     */
    error(message: LogMessage | Error, trace?: string, context?: string): void {
        const isErrorInstance = message instanceof Error;

        const errorData: Record<string, unknown> = {
            context,
            trace: trace ?? (isErrorInstance ? message.stack : undefined),
            timestamp: new Date().toISOString(),
            message: isErrorInstance ? message.message : typeof message === 'object' ? message['message'] : message,
        };

        this.logger.error(isErrorInstance ? message.message : String(message), errorData);
    }

    /**
     * Log a warning with optional additional metadata.
     * @param {LogMessage} message - The message to log.
     * @param {string} [context] - The context of the log message.
     */
    warn(message: LogMessage, context?: string): void {
        const formatted = this.formatMessage(message, context);
        this.logger.warn(typeof message === 'string' ? message : 'Warning', formatted);
    }

    /**
     * Log a debug message with optional additional metadata.
     * Only logs messages when the Node environment is not set to 'production'.
     * @param {LogMessage} message - The message to log.
     * @param {string} [context] - The context of the log message.
     */
    debug(message: LogMessage, context?: string): void {
        if (process.env['NODE_ENV'] !== 'production') {
            const formatted = this.formatMessage(message, context);
            this.logger.debug(typeof message === 'string' ? message : 'Debug', formatted);
        }
    }

    /**
     * Logs a trace message with a correlation ID and optional additional metadata.
     * @param {string} correlationId - The correlation ID of the trace message.
     * @param {string} message - The message to log.
     * @param {Record<string, unknown>} [metadata] - Optional additional metadata to log.
     */
    trace(correlationId: string, message: string, metadata?: Record<string, unknown>): void {
        this.logger.info(`[TRACE-ID: ${correlationId}] ${message}`, {
            correlationId,
            ...metadata,
            level: 'trace',
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Log a verbose message with optional additional metadata.
     * @param {LogMessage} message - The message to log.
     * @param {string} [context] - The context of the log message.
     */
    verbose(message: LogMessage, context?: string): void {
        const formatted = this.formatMessage(message, context);
        this.logger.verbose(typeof message === 'string' ? message : 'Verbose', formatted);
    }
}
