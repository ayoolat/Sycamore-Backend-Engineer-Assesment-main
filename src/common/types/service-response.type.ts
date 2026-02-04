import { HttpStatus } from '@nestjs/common';

export class ServiceResponse<T> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly statusCode: HttpStatus;
    public readonly data?: T;
    public readonly error?: string;

    private constructor(success: boolean, message: string, statusCode: HttpStatus, data?: T, error?: string) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
    }

    static success<T>(message: string, data: T, statusCode: HttpStatus = HttpStatus.OK): ServiceResponse<T> {
        return new ServiceResponse<T>(true, message, statusCode, data);
    }

    static error<T>(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST, error?: string): ServiceResponse<T> {
        return new ServiceResponse<T>(false, message, statusCode, undefined, error);
    }
}
