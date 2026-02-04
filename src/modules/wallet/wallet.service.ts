import {
    Injectable,
    HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Wallet } from './models/wallet.model';
import {
    TransactionLog,
    TransactionStatus,
} from './models/transaction-log.model';
import { TransferDto } from './dto/transfer.dto';
import { Decimal } from 'decimal.js';
import { Transaction } from 'sequelize';
import { formatAmount } from '../../common/utils/shared.utils';
import { ServiceResponse } from '../../common/types/service-response.type';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet)
        private readonly walletModel: typeof Wallet,
        @InjectModel(TransactionLog)
        private readonly transactionLogModel: typeof TransactionLog,
        private readonly sequelize: Sequelize,
    ) { }

    public async transfer(transferDto: TransferDto): Promise<ServiceResponse<TransactionLog>> {
        const { fromWalletId, toWalletId, amount, idempotencyKey } = transferDto;

        // 1. Check Idempotency
        const existingLog = await this.transactionLogModel.findOne({
            where: { idempotencyKey },
        });

        if (existingLog) {
            if (existingLog.status === TransactionStatus.SUCCESS) {
                return ServiceResponse.success('Transfer already processed', existingLog);
            }
            if (existingLog.status === TransactionStatus.PENDING) {
                return ServiceResponse.error(
                    'Transaction is currently being processed',
                    HttpStatus.CONFLICT,
                );
            }
        }

        // 2. Create PENDING log entry
        const log = await this.transactionLogModel.create({
            idempotencyKey,
            fromWalletId,
            toWalletId,
            amount: formatAmount(new Decimal(amount)),
            status: TransactionStatus.PENDING,
        });

        const transactionResult = new Promise<ServiceResponse<TransactionLog>>(async (resolve, reject) => {
            try {
                await this.sequelize.transaction(async (t: Transaction) => {
                    // 4. Handle Race Conditions
                    const fromWallet = await this.walletModel.findByPk(fromWalletId, {
                        transaction: t,
                        lock: t.LOCK.UPDATE,
                    });
                    const toWallet = await this.walletModel.findByPk(toWalletId, {
                        transaction: t,
                        lock: t.LOCK.UPDATE,
                    });

                    if (!fromWallet || !toWallet) {
                        return resolve(ServiceResponse.error('One or both wallets not found', HttpStatus.NOT_FOUND));
                    }

                    if (fromWalletId === toWalletId) {
                        return resolve(ServiceResponse.error('Cannot transfer to the same wallet', HttpStatus.BAD_REQUEST));
                    }

                    // 5. Precision Math
                    const fromBalance = new Decimal(fromWallet.balance);
                    const transferAmount = new Decimal(amount);

                    if (fromBalance.lessThan(transferAmount)) {
                        return resolve(ServiceResponse.error('Insufficient funds', HttpStatus.BAD_REQUEST));
                    }

                    // 6. Execute Transfer
                    const newFromBalance = fromBalance.minus(transferAmount);
                    const newToBalance = new Decimal(toWallet.balance).plus(transferAmount);

                    await fromWallet.update(
                        { balance: formatAmount(newFromBalance) },
                        { transaction: t },
                    );
                    await toWallet.update(
                        { balance: formatAmount(newToBalance) },
                        { transaction: t },
                    );

                    await log.update(
                        { status: TransactionStatus.SUCCESS },
                        { transaction: t },
                    );

                    resolve(ServiceResponse.success('Transfer successful', log, HttpStatus.OK));
                });
            } catch (error) {
                reject(error);
            }
        });

        try {
            return await transactionResult;
        } catch (error) {
            // 8. Update log to FAILED if critical error occurred
            await log.update({
                status: TransactionStatus.FAILED,
                metadata: error instanceof Error ? error.message : String(error),
            });
            return ServiceResponse.error('Transfer failed', HttpStatus.INTERNAL_SERVER_ERROR, String(error));
        }
    }

    // Utility to get wallet balance
    public async getWallet(id: string): Promise<ServiceResponse<Wallet>> {
        try {
            const wallet = await this.walletModel.findByPk(id);
            if (!wallet) {
                return ServiceResponse.error('Wallet not found', HttpStatus.NOT_FOUND);
            }
            return ServiceResponse.success('Wallet retrieved successfully', wallet, HttpStatus.OK);
        } catch (error) {
            return ServiceResponse.error('Error retrieving wallet', HttpStatus.INTERNAL_SERVER_ERROR, String(error));
        }
    }
}
