import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order_ready')
  async handleDispatch(
    @Payload() data: { orderId: string; customerName: string; item: string },
  ) {
    console.log(`Event received from rider_queue : ${data.orderId}`);
    return await this.appService.dispatchOrder(data);
  }
}
