/**
 * Structured logging utility for consistent logging across the application.
 * In production, this could be extended to send logs to a monitoring service.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

const isDevelopment = process.env.NODE_ENV === "development";
const minLogLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || (isDevelopment ? "debug" : "info");

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[minLogLevel];
}

function formatEntry(entry: LogEntry): string {
    if (isDevelopment) {
        const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}:`;
        const context = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
        const error = entry.error ? `\n  Error: ${entry.error.message}\n  ${entry.error.stack}` : "";
        return `${prefix} ${entry.message}${context}${error}`;
    }
    return JSON.stringify(entry);
}

function createEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        error: error
            ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack
              }
            : undefined
    };
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!shouldLog(level)) return;

    const entry = createEntry(level, message, context, error);
    const formatted = formatEntry(entry);

    switch (level) {
        case "debug":
        case "info":
            console.log(formatted);
            break;
        case "warn":
            console.warn(formatted);
            break;
        case "error":
            console.error(formatted);
            break;
    }
}

export const logger = {
    debug: (message: string, context?: Record<string, unknown>) => log("debug", message, context),
    info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
    warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
    error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
        const err = error instanceof Error ? error : undefined;
        log("error", message, context, err);
    }
};

/**
 * Create a child logger with persistent context
 */
export function createLogger(context: Record<string, unknown>) {
    return {
        debug: (message: string, additionalContext?: Record<string, unknown>) =>
            log("debug", message, { ...context, ...additionalContext }),
        info: (message: string, additionalContext?: Record<string, unknown>) =>
            log("info", message, { ...context, ...additionalContext }),
        warn: (message: string, additionalContext?: Record<string, unknown>) =>
            log("warn", message, { ...context, ...additionalContext }),
        error: (message: string, error?: Error | unknown, additionalContext?: Record<string, unknown>) => {
            const err = error instanceof Error ? error : undefined;
            log("error", message, { ...context, ...additionalContext }, err);
        }
    };
}
