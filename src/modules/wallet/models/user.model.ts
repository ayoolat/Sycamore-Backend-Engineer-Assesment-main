import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Wallet } from './wallet.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @HasMany(() => Wallet)
    wallets?: Wallet[];
}
