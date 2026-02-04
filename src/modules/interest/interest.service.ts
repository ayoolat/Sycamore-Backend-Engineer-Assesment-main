import { Injectable, HttpStatus } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { isLeapYear } from '../../common/utils/shared.utils';
import { ServiceResponse } from '../../common/types/service-response.type';

@Injectable()
export class InterestService {
    private readonly ANNUAL_RATE = new Decimal(0.275); // 27.5%

    /**
     * Calculates interest for a single day
     * @param principal The amount to calculate interest on
     * @param date The specific date (to check for leap year)
     * @returns Daily interest amount
     */
    calculateDailyInterest(principal: string | number, date: Date = new Date()): ServiceResponse<string> {
        try {
            const p = new Decimal(principal);
            if (p.isNaN() || p.isNegative()) {
                return ServiceResponse.error('Invalid principal amount', HttpStatus.BAD_REQUEST);
            }

            const year = date.getFullYear();
            const daysInYear = isLeapYear(year) ? 366 : 365;

            // Daily Interest = Principal * (Annual Rate / Days in Year)
            const dailyRate = this.ANNUAL_RATE.dividedBy(daysInYear);
            const interest = p.times(dailyRate);

            return ServiceResponse.success('Interest calculated', interest.toFixed(8), HttpStatus.OK);
        } catch (error) {
            return ServiceResponse.error('Calculation error', HttpStatus.INTERNAL_SERVER_ERROR, String(error));
        }
    }
}
