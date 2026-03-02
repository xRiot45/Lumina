import { ChargePaymentResponseDto, OrderResponseDto, UpdatePaymentInfoDto } from '@lumina/shared-dto';
import {
    IPaymentActionInfo,
    IQrisActionInfo,
    IVirtualAccountActionInfo,
    IXenditPaymentMethodParam,
    OrderStatus,
    PaymentMethod,
} from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Xendit } from 'xendit-node';
import { getXenditBankCode } from '@lumina/shared-utils';

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

        this.xenditClient = new Xendit({ secretKey });
    }

    async chargePayment(userId: string, orderId: string): Promise<ChargePaymentResponseDto> {
        this.logger.log({ message: 'Processing payment charge', userId, orderId }, this.context);

        try {
            // Step 1: Fetch & Validate Order
            const orderDetail = await firstValueFrom<OrderResponseDto>(
                this.ordersClient.send({ cmd: 'find_order_by_id' }, orderId),
            );

            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order not found.`,
                    error: 'Not Found',
                });
            }

            // Validasi Kepemilikan (Mencegah IDOR)
            if (orderDetail.userId !== userId) {
                this.logger.warn(`Unauthorized payment attempt by user ${userId} for order ${orderId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.FORBIDDEN,
                    message: `You do not have permission to pay for this order.`,
                    error: 'Forbidden',
                });
            }

            // Validasi Status Pesanan
            if (orderDetail.status !== OrderStatus.PENDING_PAYMENT) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Order cannot be paid. Current status is ${orderDetail.status}`,
                    error: 'Bad Request',
                });
            }

            // STEP 2 ORKESTRASI XENDIT (PAYMENT REQUEST API)
            let paymentGatewayId = '';
            let paymentActionInfo: IPaymentActionInfo;

            const selectedMethod = orderDetail?.paymentMethod as PaymentMethod;
            const customerName = orderDetail.shippingAddress?.recipientName || 'Lumina Customer';

            let xenditPaymentMethodParam: IXenditPaymentMethodParam;

            switch (selectedMethod) {
                case PaymentMethod.BCA_VA:
                case PaymentMethod.MANDIRI_VA:
                case PaymentMethod.BRIVA:
                case PaymentMethod.BNI_VA:
                case PaymentMethod.PERMATA_VA:
                case PaymentMethod.CIMB_VA:
                case PaymentMethod.BSI_VA:
                case PaymentMethod.BJB_VA:
                case PaymentMethod.SAHABAT_SAMPOERNA_VA: {
                    const bankCode = getXenditBankCode(selectedMethod);
                    xenditPaymentMethodParam = {
                        type: 'VIRTUAL_ACCOUNT',
                        reusability: 'ONE_TIME_USE',
                        virtualAccount: {
                            channelCode: bankCode,
                            channelProperties: {
                                customerName: customerName,
                            },
                        },
                    };
                    break;
                }
                case PaymentMethod.QRIS: {
                    xenditPaymentMethodParam = {
                        type: 'QR_CODE',
                        reusability: 'ONE_TIME_USE',
                        qrCode: {
                            channelCode: 'QRIS',
                        },
                    };
                    break;
                }
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
                    paymentMethod: xenditPaymentMethodParam,
                },
            });

            paymentGatewayId = paymentRequestResponse?.id;

            // STEP 3: MAPPING HASIL KE INTERFACE KITA
            if (paymentRequestResponse.paymentMethod?.type === 'VIRTUAL_ACCOUNT') {
                const vaData = paymentRequestResponse.paymentMethod.virtualAccount;
                const vaInfo: IVirtualAccountActionInfo = {
                    accountNumber: vaData?.channelProperties?.virtualAccountNumber || '',
                    bankCode: vaData?.channelCode || '',
                    expirationDate: vaData?.channelProperties?.expiresAt || new Date().toISOString(),
                };
                paymentActionInfo = vaInfo;
            } else if (paymentRequestResponse.paymentMethod?.type === 'QR_CODE') {
                const qrData = paymentRequestResponse.paymentMethod.qrCode;
                const qrInfo: IQrisActionInfo = {
                    qrString: qrData?.channelProperties?.qrString || '',
                    expirationDate: qrData?.channelProperties?.expiresAt || new Date().toISOString(),
                };
                paymentActionInfo = qrInfo;
            } else {
                throw new Error('Failed to parse Xendit response type');
            }

            // STEP 4: SYNC STATE (UPDATE KE ORDERS SERVICE)
            const updatePayload: UpdatePaymentInfoDto = {
                orderId: orderId,
                paymentGatewayId: paymentGatewayId,
                paymentActionInfo: paymentActionInfo,
            };

            await firstValueFrom(this.ordersClient.send({ cmd: 'update_payment_info' }, updatePayload));
            const response: ChargePaymentResponseDto = {
                orderId: orderId,
                paymentGatewayId: paymentGatewayId,
                paymentMethod: orderDetail.paymentMethod,
                totalAmount: orderDetail.totalAmount,
                status: orderDetail.status,
                paymentActionInfo: paymentActionInfo,
            };

            return response;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to process payment charge via Xendit: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while creating the order',
                error: 'Internal Server Error',
            });
        }
    }
}
