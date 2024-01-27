export class AutoSQLNoBindingError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AutoSQLUnsupportedDatabaseError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AutoSQLTableNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AutoSQLColumnNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}