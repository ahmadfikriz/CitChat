import { Message } from 'src/message/entities/message.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  @ManyToMany(
    () => {
      return User;
    },
    (user) => {
      return user.group;
    },
  )
  user: User[];

  @OneToMany(
    () => {
      return Message;
    },
    (message) => {
      return message.group;
    },
  )
  messages: Message[];
}
