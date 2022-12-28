import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToMany(
    () => {
      return Message;
    },
    (message) => {
      return message.conversation;
    },
  )
  messages: Message[];

  @ManyToOne(
    () => {
      return User;
    },
    (users) => {
      return users.conversations;
    },
  )
  users: User[];
}
