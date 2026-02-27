import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from '../../core/database/entities/user-address.entity';
import { LoggerModule } from '@lumina/shared-logger';

@Module({
    imports: [TypeOrmModule.forFeature([UserAddressEntity]), LoggerModule],
    controllers: [UserAddressesController],
    providers: [UserAddressesService],
})
export class UserAddressesModule {}
