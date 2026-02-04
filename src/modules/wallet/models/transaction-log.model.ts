import {
    Column,
    DataType,
    Model,
    Table,
    Index,
} from 'sequelize-typescript';

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

@Table({ tableName: 'transaction_logs', timestamps: true })
export class TransactionLog extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id!: string;

    @Index({ unique: true, name: 'idx_idempotency_key' })
    @Column({ type: DataType.STRING, allowNull: false })
    idempotencyKey!: string;

    @Column({ type: DataType.UUID, allowNull: true })
    fromWalletId?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    toWalletId?: string;

    @Column({ type: DataType.DECIMAL(20, 8), allowNull: false })
    amount!: string;

    @Column({
        type: DataType.ENUM(...Object.values(TransactionStatus)),
        defaultValue: TransactionStatus.PENDING,
    })
    status!: TransactionStatus;

    @Column({ type: DataType.STRING, allowNull: true })
    metadata?: string;
}
