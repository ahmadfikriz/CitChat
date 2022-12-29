import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from 'src/user group/userGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserGroup])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
