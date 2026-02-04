import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wallet } from './models/wallet.model';
import { TransactionLog } from './models/transaction-log.model';
import { User } from './models/user.model';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
    imports: [SequelizeModule.forFeature([User, Wallet, TransactionLog])],
    providers: [WalletService],
    controllers: [WalletController],
    exports: [WalletService],
})
export class WalletModule { }
