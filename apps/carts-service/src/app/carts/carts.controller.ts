import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller()
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}
}
