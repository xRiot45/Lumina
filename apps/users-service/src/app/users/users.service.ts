import { RegisterDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly logger: LoggerService,
    ) {}

    async create(data: RegisterDto) {
        try {
            const user = this.usersRepository.create(data);
            return await this.usersRepository.save(user);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                this.logger.warn(`Duplicate entry attempt for email: ${data.email}`);
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Email already exists',
                    error: 'Conflict',
                });
            }

            this.logger.error(`Database Error: ${error.message}`, error.stack);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create user in database',
                error: 'Internal Server Error',
            });
        }
    }

    async findUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'fullName', 'password', 'createdAt', 'updatedAt'],
        });

        return user;
    }
}
