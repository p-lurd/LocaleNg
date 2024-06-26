export class HttpError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.code = code;
    }
}