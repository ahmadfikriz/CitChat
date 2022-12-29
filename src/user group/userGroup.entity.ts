/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/role/entities/role.entity';

@Entity()
export class UserGroup {
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => {
    return User;
  })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @PrimaryColumn()
  groupId: string;

  @ManyToOne(() => {
    return Group;
  })
  group: Group;
}
