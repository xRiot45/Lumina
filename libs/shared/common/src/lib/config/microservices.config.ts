import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const MICROSERVICES = {
    AUTH: 'AUTH_SERVICE',
    USERS: 'USERS_SERVICE',
    PRODUCTS: 'PRODUCTS_SERVICE',
    CARTS: 'CARTS_SERVICE',
    ORDERS: 'ORDERS_SERVICE',
    PAYMENTS: 'PAYMENTS_SERVICE',
} as const;

export const getMicroserviceConfig = (serviceName: string): ClientProviderOptions => ({
    name: serviceName,
    transport: Transport.TCP,
    options: {
        host: process.env[`${serviceName}_HOST`],
        port: Number(process.env[`${serviceName}_PORT`]),
    },
});
