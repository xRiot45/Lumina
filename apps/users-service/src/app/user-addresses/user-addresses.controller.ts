import { Controller } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';

@Controller()
export class UserAddressesController {
    constructor(private readonly userAddressesService: UserAddressesService) {}
}
