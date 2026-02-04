import { Test, TestingModule } from '@nestjs/testing';
import { InterestService } from './interest.service';
import { Decimal } from 'decimal.js';

describe('InterestService', () => {
    let service: InterestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InterestService],
        }).compile();

        service = module.get<InterestService>(InterestService);
    });

    describe('calculateDailyInterest', () => {
        it('should calculate interest correctly for a non-leap year (2023)', () => {
            const principal = 100000; // 100k
            const date = new Date('2023-01-01');
            const result = service.calculateDailyInterest(principal, date);

            expect(result.success).toBe(true);
            const interest = new Decimal(result.data!);

            // Expected = 100000 * (0.275 / 365) = 75.34246575
            const expected = new Decimal(principal).times(new Decimal(0.275).div(365));
            expect(interest.toFixed(8)).toBe(expected.toFixed(8));
        });

        it('should calculate interest correctly for a leap year (2024)', () => {
            const principal = 100000;
            const date = new Date('2024-01-01');
            const result = service.calculateDailyInterest(principal, date);

            expect(result.success).toBe(true);
            const interest = new Decimal(result.data!);

            // Expected = 100000 * (0.275 / 366) = 75.13661202
            const expected = new Decimal(principal).times(new Decimal(0.275).div(366));
            expect(interest.toFixed(8)).toBe(expected.toFixed(8));
        });

        it('should return error for invalid principal', () => {
            const principal = 'invalid';
            const date = new Date('2023-01-01');
            const result = service.calculateDailyInterest(principal, date);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Calculation error');
        });
    });

    describe('isLeapYear (private, via calculateDailyInterest logic)', () => {
        it('should identify leap years correctly', () => {
            // 2000 was a leap year (divisible by 400)
            const result2000 = service.calculateDailyInterest(100, new Date('2000-01-01'));
            const expected2000 = new Decimal(100).times(new Decimal(0.275).div(366));
            expect(result2000.data).toBe(expected2000.toFixed(8));

            // 1900 was NOT a leap year (divisible by 100 but not 400)
            const result1900 = service.calculateDailyInterest(100, new Date('1900-01-01'));
            const expected1900 = new Decimal(100).times(new Decimal(0.275).div(365));
            expect(result1900.data).toBe(expected1900.toFixed(8));
        });
    });
});
