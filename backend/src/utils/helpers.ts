// Simple ID generator for D1 (crypto.randomUUID alternative)
export function generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return prefix ? `${prefix}-${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

// Format date for SQLite
export function formatDate(date: Date = new Date()): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
}

// Parse SQLite date to Date object
export function parseDate(dateStr: string): Date {
    return new Date(dateStr.replace(' ', 'T') + 'Z');
}
