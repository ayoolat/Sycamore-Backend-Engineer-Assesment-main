import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ServiceResponse } from '../types/service-response.type';

/**
 * Maps generic service errors to HTTP exceptions.
 * @param result The failed ServiceResponse object
 * @throws HttpException
 */
export const mapDomainErrorToHttp = (result: ServiceResponse<any>): void => {
    if (result.success) {
        return;
    }

    const { message, statusCode, error } = result;

    if (error) {
        Logger.error(`Domain Error: ${message}`, error, 'DomainErrorMapper');
    }

    throw new HttpException(
        {
            success: false,
            message,
            statusCode,
            error: error || message,
            timestamp: new Date().toISOString(),
        },
        statusCode
    );
};
