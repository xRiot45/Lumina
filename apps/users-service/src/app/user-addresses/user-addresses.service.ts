import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddressEntity } from '../../core/database/entities/user-address.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { CreateUserAddressDto, UserAddressResponseDto } from '@lumina/shared-dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserAddressesService {
    private readonly context = `[SERVICE] ${UserAddressesService.name}`;

    constructor(
        @InjectRepository(UserAddressEntity)
        private readonly userAddressRepository: Repository<UserAddressEntity>,
        private readonly logger: LoggerService,
    ) {}

    async create(userId: string, data: CreateUserAddressDto): Promise<UserAddressResponseDto> {
        this.logger.log(`Creating user address for user ${userId}`, this.context);

        try {
            const existingAddressUserCount = await this.userAddressRepository.count({
                where: {
                    userId,
                },
            });

            if (existingAddressUserCount > 10) {
                this.logger.warn(`User ${userId} has reached the maximum number of addresses (10)`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `You can only have up to 10 saved addresses`,
                    error: 'Bad Request',
                });
            }

            let isDefaultAddress = data?.isDefault ?? false;
            if (existingAddressUserCount === 0) {
                isDefaultAddress = true;
            } else if (isDefaultAddress) {
                await this.userAddressRepository.update({ userId, isDefault: true }, { isDefault: false });
            }

            const newAddress = this.userAddressRepository.create({
                ...data,
                userId,
                isDefault: isDefaultAddress,
            });

            const savedAddress = await this.userAddressRepository.save(newAddress);
            this.logger.log(`[UsersService] Successfully created address ${savedAddress.id} for user ${userId}`);
            return savedAddress;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to create user address: ${errorMessage}`, errorStack, 'UserAddressesService');

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while creating the user address',
                error: 'Internal Server Error',
            });
        }
    }

    async findAll(userId: string): Promise<UserAddressResponseDto[]> {
        this.logger.log(`Finding all user addresses for user ${userId}`, this.context);

        try {
            const userAddresses = await this.userAddressRepository.find({
                where: {
                    userId,
                },
            });

            if (!userAddresses) {
                this.logger.log(`No user addresses found for user ${userId}`, this.context);
                return [];
            }

            this.logger.log(`Found ${userAddresses.length} user addresses for user ${userId}`, this.context);
            return userAddresses;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Error finding user addresses', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to find user addresses',
                error: 'Internal Server Error',
            });
        }
    }
}
