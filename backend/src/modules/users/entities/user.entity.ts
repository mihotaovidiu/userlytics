import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Account } from '../../accounts';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => Account, (account) => account.user, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    account: Account;

}
