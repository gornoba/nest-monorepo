import { Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(requset: CreateOrderRequest) {
    return await this.ordersRepository.create(requset);
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
