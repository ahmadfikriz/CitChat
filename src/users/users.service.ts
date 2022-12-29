/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EditPasswordDto } from './dto/edit-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();

    newUser.email = createUserDto.email;
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;

    const result = await this.usersRepository.insert(newUser);

    return this.usersRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  findAll() {
    return this.usersRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async updatePassword(id: string, editPasswordDto: EditPasswordDto) {
    await this.usersRepository.findOneOrFail({
      where: {
        id: id,
      },
    });

    if (editPasswordDto.password === editPasswordDto.confirm_password) {
      const salt = await bcrypt.genSalt();
      const passwordBaru = await bcrypt.hash(editPasswordDto.password, salt);
      const data = await this.usersRepository.findOneOrFail({
        where: {
          id: id,
        },
      });

      data.password = passwordBaru;

      await this.usersRepository.update({ id }, data);

      return await this.usersRepository.findOneOrFail({ where: { id } });
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Password Harus Sama',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.delete(id);
  }

  hash(plainPassword) {
    const hash = bcrypt.hashSync(plainPassword, 20);

    return hash;
  }

  compare(plainPassword, hash) {
    const valid = bcrypt.compare(plainPassword, hash);

    return valid;
  }

  async findByUsername(username: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          username,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async validateUser(username) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('username = :username', { username: username })
      .getOne();
  }
}
