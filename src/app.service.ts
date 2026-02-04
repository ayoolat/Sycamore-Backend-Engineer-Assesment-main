import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './modules/wallet/models/user.model';
import { Wallet } from './modules/wallet/models/wallet.model';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Wallet) private walletModel: typeof Wallet,
    ) { }

    async onApplicationBootstrap() {
        const userCount = await this.userModel.count();
        if (userCount === 0) {
            console.log('🌱 Seeding initial data...');
            const user1 = await this.userModel.create({
                name: 'Sycamore Pool',
                email: 'pool@sycamore.ng',
            });
            const user2 = await this.userModel.create({
                name: 'John Doe',
                email: 'john@example.com',
            });

            await this.walletModel.create({
                userId: user1.id,
                balance: '1000000',
                currency: 'NGN',
            });
            await this.walletModel.create({
                userId: user2.id,
                balance: '1000',
                currency: 'NGN',
            });
            console.log('✅ Seed completed.');
        }
    }

    getHello(): string {
        return 'Sycamore Backend Assessment API - Visit /api for documentation';
    }
}
