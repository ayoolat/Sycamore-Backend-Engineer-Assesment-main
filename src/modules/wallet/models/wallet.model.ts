import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'wallets', timestamps: true })
export class Wallet extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId!: string;

    @BelongsTo(() => User)
    user!: User;

    @Column({
        type: DataType.DECIMAL(20, 8),
        allowNull: false,
        defaultValue: 0,
        get() {
            // Return as string/number to avoid floating point issues in JS
            const value = this.getDataValue('balance');
            return value ? value.toString() : '0';
        },
    })
    balance!: string;

    @Column({ type: DataType.STRING, defaultValue: 'NGN' })
    currency!: string;
}
