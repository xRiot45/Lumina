import { LoggerService } from '@lumina/shared-logger';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../core/database/entities/user.entity';
import { RegisterRequestDto } from '@lumina/shared-dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly logger: LoggerService,
    ) {}

    async createUser(payload: RegisterRequestDto) {
        try {
            const user = this.usersRepository.create(payload);
            return await this.usersRepository.save(user);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to create user in database', error: errorMessage, stack: errorStack });
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
            select: ['id', 'email', 'fullName', 'password', 'role', 'createdAt', 'updatedAt'],
        });

        return user;
    }
}
