import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './modules/wallet/wallet.module';
import { InterestModule } from './modules/interest/interest.module';
import { Wallet } from './modules/wallet/models/wallet.model';
import { TransactionLog } from './modules/wallet/models/transaction-log.model';
import { User } from './modules/wallet/models/user.model';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'sycamore_wallet',
            autoLoadModels: true,
            synchronize: true, // For assessment purposes only
            models: [User, Wallet, TransactionLog],
        }),
        WalletModule,
        InterestModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
