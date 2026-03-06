import {
    ChargePaymentResponseDto,
    GetPaymentInfoResponseDto,
    OrderResponseDto,
    PayOrderResponseDto,
    ReduceStockEventDto,
    StockReductionItemDto,
    SyncPaymentStatusResponseDto,
    UpdateOrderStatusToPaidDto,
    UpdatePaymentInfoDto,
    XenditWebhookDto,
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
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentsService {
    private readonly context = `[SERVICE] ${PaymentsService.name}`;
    private readonly xenditClient: Xendit;

    constructor(
        @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
        private readonly logger: LoggerService,
        private readonly httpService: HttpService,
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

            const expirationDate = new Date(orderDetail?.paymentExpiresAt ?? new Date());
            const now = new Date();

            if (expirationDate.getTime() - now.getTime() < 60 * 1000) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'The payment period for this order has expired. Please create a new order.',
                    error: 'Bad Request',
                });
            }

            const selectedMethod = orderDetail.paymentMethod as PaymentMethod;
            const customerName = orderDetail.shippingAddress?.recipientName ?? 'Lumina Customer';

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
                    amount: Number(orderDetail.totalAmount),
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
        if (process.env.NODE_ENV === 'production') {
            throw new RpcException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'Simulasi pembayaran dinonaktifkan di lingkungan Production.',
                error: 'Forbidden',
            });
        }

        this.logger.log(`[PAYMENT] Initiating simulated payOrder: ${orderId} for User: ${userId}`);

        try {
            const orderDetail = await firstValueFrom(this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId));

            if (!orderDetail) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Order not found.',
                    error: 'Not Found',
                });
            }

            if (orderDetail.userId !== userId) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'Unauthorized access to this order.',
                    error: 'Forbidden',
                });
            }

            if (orderDetail.status !== OrderStatus.PENDING_PAYMENT || !orderDetail.paymentGatewayId) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Order is not in a payable state or missing Payment Gateway ID.',
                    error: 'Bad Request',
                });
            }

            const authHeader = Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64');
            const simulationUrl = `${process.env.XENDIT_URL}/v3/payment_requests/${orderDetail.paymentGatewayId}/simulate`;

            this.logger.log(`[XENDIT] Triggering simulation for: ${orderDetail.paymentGatewayId}`);

            try {
                await this.httpService.axiosRef.post(
                    simulationUrl,
                    { amount: orderDetail.totalAmount },
                    {
                        headers: {
                            Authorization: `Basic ${authHeader}`,
                            'Content-Type': 'application/json',
                            'api-version': process.env.XENDIT_API_VERSION,
                        },
                    },
                );
            } catch (err) {
                const axiosError = err as AxiosError<{ message?: string }>;
                throw new RpcException({
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: `Xendit Simulation Failed: ${axiosError.response?.data?.message || axiosError.message}`,
                    error: 'Bad Gateway',
                });
            }

            this.logger.log(`Simulation triggered for Order ${orderId}. Waiting for webhook...`);

            const responsePayload: PayOrderResponseDto = {
                orderId: orderId,
                paymentGatewayId: orderDetail.paymentGatewayId,
                expectedStatus: OrderStatus.PAID,
            };

            return mapToDto(PayOrderResponseDto, responsePayload);
        } catch (error: unknown) {
            if (error instanceof RpcException) throw error;

            this.logger.error(`Error in payOrder: ${error instanceof Error ? error.message : String(error)}`);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred during payment processing.',
            });
        }
    }

    async handleXenditWebhook(callbackToken: string, payload: XenditWebhookDto) {
        const { event, data, external_id, reference_id, id, payment_request_id } = payload;

        try {
            const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;
            if (callbackToken !== expectedToken) {
                this.logger.error('Invalid Callback Token. Possible unauthorized access!');
                return;
            }

            const allowedEvents = ['payment_request.succeeded', 'payment.succeeded'];

            if (!allowedEvents.includes(event)) {
                this.logger.log(`Ignoring unsupported event type: ${event}`);
                return;
            }

            const orderNumber = (data && data.reference_id) || external_id || reference_id;
            const gatewayId = (data && data.payment_request_id) || payment_request_id || (data && data.id) || id;

            this.logger.log(`Processing event [${event}] for Order Number: ${orderNumber}`);

            if (!orderNumber) {
                this.logger.error('Failed to extract Order Number from webhook payload.');
                return;
            }

            const orderDetail = await firstValueFrom(
                this.ordersClient.send({ cmd: 'find_order_by_number' }, orderNumber),
            );

            if (!orderDetail) {
                this.logger.error(`Order [${orderNumber}] not found in the database.`);
                return;
            }

            if (orderDetail.status === OrderStatus.PAID) {
                this.logger.log(`Order [${orderNumber}] is already PAID. Webhook ignored.`);
                return;
            }

            if (orderDetail.paymentGatewayId && orderDetail.paymentGatewayId !== gatewayId) {
                this.logger.warn(
                    `Minor Gateway ID mismatch for [${orderNumber}]. DB: ${orderDetail.paymentGatewayId}, Webhook: ${gatewayId}`,
                );
            }

            this.logger.log(`Verification successful. Updating Order: ${orderNumber} (Internal ID: ${orderDetail.id})`);

            const updatePayload: UpdateOrderStatusToPaidDto = {
                orderId: orderDetail.id,
                status: OrderStatus.PAID,
                paidAt: new Date().toISOString(),
            };

            await firstValueFrom(this.ordersClient.send({ cmd: 'update_order_status_to_paid' }, updatePayload));
            this.logger.log(`Database Order [${orderNumber}] successfully updated to PAID.`);

            const orderItems = orderDetail.items || [];
            if (orderItems.length > 0) {
                const stockPayload: ReduceStockEventDto = {
                    orderId: orderDetail.id,
                    items: orderItems.map((item: StockReductionItemDto) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    })),
                };

                this.productsClient.emit('reduce_product_variant_stock', stockPayload);
                this.logger.log(`Stock reduction event dispatched for Order [${orderNumber}].`);
            }

            this.logger.log(`COMPLETED: Payment for Order [${orderNumber}] has been fully processed.`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Webhook processing failed: ${errorMessage}`, errorStack);
        }
    }

    async syncPaymentStatus(userId: string, orderId: string): Promise<SyncPaymentStatusResponseDto> {
        this.logger.log(`Starting manual sync for Order ID: ${orderId}`);

        try {
            const orderDetail = await firstValueFrom(this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId));
            if (!orderDetail) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Order not found in database',
                });
            }

            if (orderDetail.userId !== userId) {
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: 'Unauthorized access to this order',
                });
            }

            if (!orderDetail.paymentGatewayId) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'This order does not have an active payment request yet',
                });
            }

            if (orderDetail.status === OrderStatus.PAID) {
                this.logger.log(`Order [${orderId}] is already PAID in database. Sync bypassed.`);
                return {
                    status: OrderStatus.PAID,
                    isChanged: false,
                };
            }

            this.logger.log(`Fetching status from Xendit API for Gateway ID: ${orderDetail.paymentGatewayId}`);

            const paymentRequestResponse = await this.xenditClient.PaymentRequest.getPaymentRequestByID({
                paymentRequestId: orderDetail.paymentGatewayId,
            });

            const xenditStatus = paymentRequestResponse.status;
            this.logger.log(`Received Xendit status for [${orderId}]: ${xenditStatus}`);
            this.logger.log(`Received Xendit status for [${orderId}]: ${xenditStatus}`);

            let isChanged = false;
            let finalStatus = orderDetail.status;

            if (xenditStatus === 'SUCCEEDED') {
                finalStatus = OrderStatus.PAID;
                isChanged = true;

                await firstValueFrom(
                    this.ordersClient.send(
                        { cmd: 'update_order_status_to_paid' },
                        {
                            orderId: orderDetail.id,
                            status: finalStatus,
                            paidAt: new Date().toISOString(),
                        },
                    ),
                );

                const orderItems = orderDetail.items || [];
                if (orderItems.length > 0) {
                    const stockPayload: ReduceStockEventDto = {
                        orderId: orderDetail.id,
                        items: orderItems.map((item: StockReductionItemDto) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                        })),
                    };
                    this.productsClient.emit('reduce_product_variant_stock', stockPayload);
                    this.logger.log(`Stock reduction event dispatched during manual sync for [${orderId}]`);
                }
            } else if (xenditStatus === 'FAILED' || xenditStatus === 'EXPIRED') {
                finalStatus = OrderStatus.CANCELED;
                isChanged = true;

                await firstValueFrom(
                    this.ordersClient.send(
                        { cmd: 'update_order_status_to_paid' },
                        {
                            orderId: orderDetail.id,
                            status: finalStatus,
                            canceledReason: `Auto-canceled via Sync. Xendit status: ${xenditStatus}`,
                            canceledAt: new Date().toISOString(),
                        },
                    ),
                );
            }

            this.logger.log(`Sync completed for [${orderId}]. Final status: ${finalStatus}`);
            return { status: finalStatus, isChanged };
        } catch (error: unknown) {
            if (error instanceof RpcException) throw error;

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Sync payment failed: ${errorMessage}`, errorStack);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred during payment synchronization',
            });
        }
    }
}
