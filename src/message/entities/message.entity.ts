import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Group } from 'src/group/entities/group.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;

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

  @ManyToOne(
    () => {
      return Conversation;
    },
    (conversation) => {
      return conversation.messages;
    },
  )
  conversation: Conversation;

  @ManyToOne(
    () => {
      return Group;
    },
    (group) => {
      return group.messages;
    },
  )
  group: Group;
}
