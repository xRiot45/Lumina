import {
    ChargePaymentResponseDto,
    GetPaymentInfoResponseDto,
    OrderResponseDto,
    PayOrderResponseDto,
    UpdateOrderStatusDto,
    UpdatePaymentInfoDto,
} from '@lumina/shared-dto';
import {
    IEWalletActionInfo,
    IPaymentActionInfo,
    IQrisActionInfo,
    IVirtualAccountActionInfo,
    IXenditPaymentMethodParam,
    OrderStatus,
    PaymentMethod,
} from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { getXenditBankCode, getXenditEwalletCode, mapToDto } from '@lumina/shared-utils';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Xendit } from 'xendit-node';
import { PaymentMethodParameters } from 'xendit-node/payment_request/models';
import axios from 'axios';

@Injectable()
export class PaymentsService {
    private readonly context = `[SERVICE] ${PaymentsService.name}`;
    private readonly xenditClient: Xendit;

    constructor(
        @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {
        const secretKey = process.env.XENDIT_SECRET_KEY || '';
        if (!secretKey) {
            this.logger.error('XENDIT_SECRET_KEY is not defined in environment variables!', '', this.context);
        }

        this.xenditClient = new Xendit({
            secretKey,
        });
    }

    async chargePayment(userId: string, orderId: string): Promise<ChargePaymentResponseDto> {
        this.logger.log({ message: 'Processing payment charge', userId, orderId }, this.context);

        try {
            const orderDetail = await firstValueFrom<OrderResponseDto>(
                this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId),
            );

            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.userId !== userId) {
                this.logger.warn(`Unauthorized payment attempt by user ${userId} for order ${orderId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: `You do not have permission to pay for this order.`,
                    error: 'Forbidden',
                });
            }

            if (orderDetail.status !== OrderStatus.PENDING_PAYMENT) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Order cannot be paid. Current status is ${orderDetail.status}`,
                    error: 'Bad Request',
                });
            }

            const selectedMethod = orderDetail.paymentMethod as PaymentMethod;
            const customerName = orderDetail.shippingAddress?.recipientName ?? 'Lumina Customer';

            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1);

            let xenditPaymentMethodParam: IXenditPaymentMethodParam;

            switch (selectedMethod) {
                case PaymentMethod.BCA_VA:
                case PaymentMethod.MANDIRI_VA:
                case PaymentMethod.BRIVA:
                case PaymentMethod.BNI_VA:
                case PaymentMethod.BJB_VA:
                case PaymentMethod.BNC_VA:
                case PaymentMethod.BSI_VA:
                case PaymentMethod.BSS_VA:
                case PaymentMethod.CIMB_VA:
                case PaymentMethod.PERMATA_VA:
                case PaymentMethod.MUAMALAT_VA:
                    xenditPaymentMethodParam = {
                        type: 'VIRTUAL_ACCOUNT',
                        reusability: 'ONE_TIME_USE',
                        virtualAccount: {
                            channelCode: getXenditBankCode(selectedMethod),
                            channelProperties: {
                                customerName,
                                expiresAt: expirationDate,
                            },
                        },
                    };
                    break;

                case PaymentMethod.GOPAY:
                case PaymentMethod.OVO:
                case PaymentMethod.DANA:
                case PaymentMethod.SHOPEEPAY:
                case PaymentMethod.LINKAJA:
                case PaymentMethod.ASTRAPAY: {
                    const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
                    xenditPaymentMethodParam = {
                        type: 'EWALLET',
                        reusability: 'ONE_TIME_USE',
                        ewallet: {
                            channelCode: getXenditEwalletCode(selectedMethod),
                            channelProperties: {
                                successReturnUrl: `${baseUrl}/payment/success?orderId=${orderId}`,
                                failureReturnUrl: `${baseUrl}/payment/failed?orderId=${orderId}`,
                            },
                        },
                    };
                    break;
                }

                case PaymentMethod.QRIS:
                    xenditPaymentMethodParam = {
                        type: 'QR_CODE',
                        reusability: 'ONE_TIME_USE',
                        qrCode: {
                            channelCode: 'QRIS',
                            channelProperties: {
                                expiresAt: expirationDate,
                            },
                        },
                    };
                    break;

                default:
                    throw new RpcException({
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: `Unsupported or unrecognized payment method: ${selectedMethod}`,
                        error: 'Bad Request',
                    });
            }

            this.logger.log(`Executing Xendit PaymentRequest for ${selectedMethod}`, this.context);
            const paymentRequestResponse = await this.xenditClient.PaymentRequest.createPaymentRequest({
                data: {
                    referenceId: orderDetail.orderNumber,
                    currency: 'IDR',
                    amount: orderDetail.totalAmount,
                    paymentMethod: xenditPaymentMethodParam as PaymentMethodParameters,
                },
            });

            if (!paymentRequestResponse || !paymentRequestResponse.id) {
                throw new Error('Received malformed or empty response from Xendit Gateway');
            }

            const paymentGatewayId = paymentRequestResponse.id;
            const responseType = paymentRequestResponse.paymentMethod?.type;
            let paymentActionInfo: IPaymentActionInfo;

            if (responseType === 'VIRTUAL_ACCOUNT') {
                const vaData = paymentRequestResponse.paymentMethod?.virtualAccount;
                paymentActionInfo = {
                    accountNumber: vaData?.channelProperties?.virtualAccountNumber ?? '',
                    bankCode: vaData?.channelCode ?? '',
                    expiresAt: vaData?.channelProperties?.expiresAt?.toISOString() ?? new Date().toISOString(),
                } as IVirtualAccountActionInfo;
            } else if (responseType === 'QR_CODE') {
                const qrData = paymentRequestResponse.paymentMethod?.qrCode;
                paymentActionInfo = {
                    qrString: qrData?.channelProperties?.qrString ?? '',
                    expiresAt: qrData?.channelProperties?.expiresAt?.toISOString() ?? new Date().toISOString(),
                } as IQrisActionInfo;
            } else if (responseType === 'EWALLET') {
                const actions = paymentRequestResponse.actions ?? [];
                const webAction = actions.find(
                    (a) => (a.urlType as string) === 'WEB' || (a.action as string) === 'AUTH',
                );

                const mobileAction = actions.find((a) => {
                    const type = a.urlType as string;
                    return type === 'MOBILE' || type === 'DEEPLINK' || type === 'DEEP_LINK';
                });

                paymentActionInfo = {
                    checkoutUrl: webAction?.url ?? '',
                    mobileDeepLink: mobileAction?.url ?? '',
                    qrCheckoutString: '',
                } as IEWalletActionInfo;
            } else {
                throw new Error(`Failed to parse unrecognized Xendit response type: ${responseType}`);
            }

            const updatePayload: UpdatePaymentInfoDto = {
                orderId: orderId,
                paymentGatewayId: paymentGatewayId,
                paymentActionInfo: paymentActionInfo,
            };

            await firstValueFrom(this.ordersClient.send({ cmd: 'update_payment_info' }, updatePayload));
            return mapToDto(ChargePaymentResponseDto, updatePayload);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to process payment charge via Xendit: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while communicating with the payment gateway',
                error: 'Internal Server Error',
            });
        }
    }

    async getPaymentInfo(userId: string, orderId: string): Promise<GetPaymentInfoResponseDto> {
        this.logger.log({ message: 'Fetching payment info', userId, orderId }, this.context);

        try {
            const orderDetail = await firstValueFrom(this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId));
            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found for payment info', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.userId !== userId) {
                this.logger.warn(`Unauthorized view attempt by user ${userId} for order ${orderId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: `You do not have permission to view this payment information.`,
                    error: 'Forbidden',
                });
            }

            const response: GetPaymentInfoResponseDto = {
                orderId: orderDetail.id,
                orderNumber: orderDetail.orderNumber,
                status: orderDetail.status,
                totalAmount: orderDetail.totalAmount,
                paymentMethod: orderDetail.paymentMethod,
                paymentActionInfo: orderDetail.paymentActionInfo ?? null,
                createdAt: orderDetail.createdAt,
                paidAt: orderDetail.paidAt ?? null,
                canceledAt: orderDetail.canceledAt ?? null,
                canceledReason: orderDetail.canceledReason ?? null,
            };

            return mapToDto(GetPaymentInfoResponseDto, response);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch payment info: ${errorMessage}`, '', this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while retrieving payment information.',
                error: 'Internal Server Error',
            });
        }
    }

    async payOrder(userId: string, orderId: string): Promise<PayOrderResponseDto> {
        this.logger.log({ message: 'Paying order', userId, orderId }, this.context);

        try {
            const orderDetail = await firstValueFrom(this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId));
            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found for payment', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.userId !== userId) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: `You do not have permission to pay for this order.`,
                    error: 'Forbidden',
                });
            }

            if (orderDetail.status !== OrderStatus.PENDING_PAYMENT) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Order cannot be paid. Current status is ${orderDetail.status}`,
                    error: 'Bad Request',
                });
            }

            if (!orderDetail.paymentGatewayId) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `This order has not been charged to Xendit yet.`,
                    error: 'Bad Request',
                });
            }

            this.logger.log(`Triggering Manual Simulation via Axios for ID: ${orderDetail.paymentGatewayId}`);

            try {
                const xenditKey = process.env.XENDIT_SECRET_KEY;
                const authHeader = Buffer.from(`${xenditKey}:`).toString('base64');

                await axios.post(
                    `https://api.xendit.co/v3/payment_requests/${orderDetail.paymentGatewayId}/simulate`,
                    { amount: orderDetail.totalAmount },
                    {
                        headers: {
                            Authorization: `Basic ${authHeader}`,
                            'Content-Type': 'application/json',
                            'api-version': '2024-11-11',
                        },
                    },
                );

                this.logger.log(`Simulation successful for ID: ${orderDetail.paymentGatewayId}`);
            } catch (simError: any) {
                const xenditErrorMessage = simError.response?.data?.message || simError.message;
                this.logger.error(`Axios Simulation Error: ${xenditErrorMessage}`, '', this.context);

                throw new RpcException({
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: `Failed to simulate payment: ${xenditErrorMessage}`,
                    error: 'Bad Gateway',
                });
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
            const xenditStatus = await this.xenditClient.PaymentRequest.getPaymentRequestByID({
                paymentRequestId: orderDetail.paymentGatewayId,
            });

            if (xenditStatus.status !== 'SUCCEEDED') {
                throw new RpcException({
                    statusCode: HttpStatus.PAYMENT_REQUIRED,
                    message: `Payment not completed. Status: ${xenditStatus.status}`,
                });
            }

            const currentTime = new Date().toISOString();
            const updatePayload: UpdateOrderStatusDto = {
                orderId,
                status: OrderStatus.PAID,
                paidAt: currentTime,
            };

            const updatedOrder = await firstValueFrom(
                this.ordersClient.send({ cmd: 'update_order_status' }, updatePayload),
            );

            this.logger.log(`Order ${orderId} successfully marked as PAID.`);

            return mapToDto(PayOrderResponseDto, updatedOrder);
        } catch (error: unknown) {
            if (error instanceof RpcException) throw error;
            this.logger.error(`Failed to process payOrder: ${error instanceof Error ? error.message : String(error)}`);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finalizing the payment.',
            });
        }
    }
}
