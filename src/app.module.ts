import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USER', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', 'postgres'),
                database: configService.get<string>('DB_NAME', 'sycamore_wallet'),
                autoLoadModels: true,
                synchronize: true, // For assessment purposes only
                models: [User, Wallet, TransactionLog],
            }),
            inject: [ConfigService],
        }),
        WalletModule,
        InterestModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
