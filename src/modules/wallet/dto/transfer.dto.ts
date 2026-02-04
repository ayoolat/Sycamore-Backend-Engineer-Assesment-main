import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
    @ApiProperty({ description: 'Source wallet ID' })
    @IsUUID()
    @IsNotEmpty()
    fromWalletId!: string;

    @ApiProperty({ description: 'Destination wallet ID' })
    @IsUUID()
    @IsNotEmpty()
    toWalletId!: string;

    @ApiProperty({ description: 'Amount to transfer' })
    @IsNumber()
    @IsPositive()
    amount!: number;

    @ApiProperty({ description: 'Client-generated unique key to prevent duplicate processing' })
    @IsString()
    @IsNotEmpty()
    idempotencyKey!: string;
}
