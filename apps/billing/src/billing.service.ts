import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly looger = new Logger(BillingService.name);

  bill(data: any) {
    this.looger.log('BIlling the order...', data);
  }
}
