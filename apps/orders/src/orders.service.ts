import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(requset: CreateOrderRequest) {
    // return await this.ordersRepository.create(requset);
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(requset, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          requset,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
