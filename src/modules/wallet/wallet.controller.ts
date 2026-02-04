import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { WalletService } from './wallet.service';
import { TransferDto } from './dto/transfer.dto';
import { TransactionLog } from './models/transaction-log.model';
import { Wallet } from './models/wallet.model';
import { ServiceResponse } from '../../common/types/service-response.type';
import { mapDomainErrorToHttp } from '../../common/utils/error.mapper';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('transfer')
    @ApiOperation({ summary: 'Transfer funds between wallets with idempotency' })
    @ApiResponse({ status: 201, description: 'Transfer successful', type: TransactionLog })
    @ApiResponse({ status: 400, description: 'Invalid request or insufficient funds' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @ApiResponse({ status: 409, description: 'Duplicate transaction (idempotency key match)' })
    async transfer(@Body() transferDto: TransferDto, @Res() res: Response): Promise<void> {
        const result = await this.walletService.transfer(transferDto);
        if (!result.success) {
            mapDomainErrorToHttp(result);
        }
        res.status(result.statusCode).json(result);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get wallet details' })
    @ApiResponse({ status: 200, type: Wallet })
    async getWallet(@Param('id') id: string, @Res() res: Response): Promise<void> {
        const result = await this.walletService.getWallet(id);
        if (!result.success) {
            mapDomainErrorToHttp(result);
        }
        res.status(result.statusCode).json(result);
    }
}
