import { mapToDto } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddressEntity } from '../../core/database/entities/user-address.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { CreateUserAddressDto, UpdateUserAddressDto, UserAddressResponseDto } from '@lumina/shared-dto';
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

    async findOne(userId: string, addressId: string): Promise<UserAddressResponseDto> {
        this.logger.log(`Finding user address ${addressId} for user ${userId}`, this.context);

        try {
            const userAddress = await this.userAddressRepository.findOne({
                where: {
                    userId,
                    id: addressId,
                },
            });

            if (!userAddress) {
                this.logger.log(`User address ${addressId} not found for user ${userId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User address not found',
                    error: 'Not Found',
                });
            }

            this.logger.log(`Found user address ${addressId} for user ${userId}`, this.context);
            return userAddress;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Error finding user address', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to find user address',
                error: 'Internal Server Error',
            });
        }
    }

    async update(userId: string, addressId: string, data: UpdateUserAddressDto): Promise<UserAddressResponseDto> {
        this.logger.log(`Updating user address ${addressId} for user ${userId}`, this.context);

        try {
            const userAddress = await this.userAddressRepository.findOne({
                where: {
                    userId,
                    id: addressId,
                },
            });

            if (!userAddress) {
                this.logger.log(`User address ${addressId} not found for user ${userId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User address not found',
                    error: 'Not Found',
                });
            }

            const updatedUserAddress = this.userAddressRepository.merge(userAddress, data);
            const savedUserAddress = await this.userAddressRepository.save(updatedUserAddress);

            this.logger.log(`Updated user address ${addressId} for user ${userId}`, this.context);
            return savedUserAddress;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Error updating user address', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update user address',
                error: 'Internal Server Error',
            });
        }
    }

    async setDefault(userId: string, addressId: string): Promise<UserAddressResponseDto> {
        this.logger.log(`Setting user address ${addressId} as default for user ${userId}`, this.context);

        try {
            const userAddress = await this.userAddressRepository.findOne({
                where: {
                    userId,
                    id: addressId,
                },
            });

            if (!userAddress) {
                this.logger.warn(`User address ${addressId} not found for user ${userId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User address not found',
                    error: 'Not Found',
                });
            }

            if (userAddress.isDefault) {
                this.logger.log(`Address ${addressId} is already the default for user ${userId}`, this.context);
                return mapToDto(UserAddressResponseDto, userAddress);
            }

            await this.userAddressRepository.update({ userId, isDefault: true }, { isDefault: false });

            userAddress.isDefault = true;
            const savedUserAddress = await this.userAddressRepository.save(userAddress);

            this.logger.log(`Successfully set user address ${addressId} as default for user ${userId}`, this.context);
            return mapToDto(UserAddressResponseDto, savedUserAddress);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Error setting user address as default', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to set user address as default',
                error: 'Internal Server Error',
            });
        }
    }

    async remove(userId: string, addressId: string): Promise<{ success: boolean }> {
        this.logger.log(`Removing user address ${addressId} for user ${userId}`, this.context);

        try {
            const userAddress = await this.userAddressRepository.findOne({
                where: {
                    userId,
                    id: addressId,
                },
            });

            if (!userAddress) {
                this.logger.warn(`User address ${addressId} not found for user ${userId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'User address not found',
                    error: 'Not Found',
                });
            }

            await this.userAddressRepository.remove(userAddress);

            this.logger.log(`Successfully removed user address ${addressId} for user ${userId}`, this.context);
            return {
                success: true,
            };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Error removing user address', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to remove user address',
                error: 'Internal Server Error',
            });
        }
    }
}
