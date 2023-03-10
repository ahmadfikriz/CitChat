/* eslint-disable @typescript-eslint/no-explicit-any */
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Group } from 'src/group/entities/group.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

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

  @OneToMany(
    () => {
      return Conversation;
    },
    (conversation) => {
      return conversation.users;
    },
  )
  conversations: Conversation[];

  @ManyToMany(
    () => {
      return Group;
    },
    (group) => {
      return group.user;
    },
  )
  @JoinTable({ name: 'user_group' })
  group: Group[];

  static password: any;

  static id: any;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
