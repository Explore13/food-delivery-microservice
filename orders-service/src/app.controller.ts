import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('orders')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.appService.createOrder(dto);
  }
}
