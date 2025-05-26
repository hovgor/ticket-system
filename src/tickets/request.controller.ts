// src/requests/requests.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';
import { CompleteRequestDto } from './dto/complete-request.dto';
import { CancelRequestDto } from './dto/cancel-request.dto';
import { Request } from './entities/request.entity';
import { RequestsService } from './request.service';

@ApiTags('Обращения')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое обращение' })
  @ApiResponse({ status: 201, description: 'Обращение создано', type: Request })
  @ApiBody({ type: CreateRequestDto })
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Post(':id/work')
  @ApiOperation({ summary: 'Взять обращение в работу' })
  @ApiParam({ name: 'id', description: 'ID обращения', type: Number })
  @ApiResponse({ status: 200, description: 'Обращение взято в работу', type: Request })
  takeToWork(@Param('id', ParseIntPipe) id: number) {
    return this.requestsService.takeToWork(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Завершить обработку обращения' })
  @ApiParam({ name: 'id', description: 'ID обращения', type: Number })
  @ApiBody({ type: CompleteRequestDto })
  @ApiResponse({ status: 200, description: 'Обращение завершено', type: Request })
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteRequestDto,
  ) {
    return this.requestsService.complete(id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Отменить обращение' })
  @ApiParam({ name: 'id', description: 'ID обращения', type: Number })
  @ApiBody({ type: CancelRequestDto })
  @ApiResponse({ status: 200, description: 'Обращение отменено', type: Request })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelRequestDto,
  ) {
    return this.requestsService.cancel(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список обращений с фильтрацией по дате' })
  @ApiQuery({ name: 'date', required: false, description: 'Фильтр по конкретной дате (YYYY-MM-DD)' })
  @ApiQuery({ name: 'from', required: false, description: 'Начало диапазона дат (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'Конец диапазона дат (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Список обращений', type: [Request] })
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.requestsService.findAll(
      from,
      to,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Post('cancel-in-progress')
  @ApiOperation({ summary: 'Отменить все обращения со статусом "в работе"' })
  @ApiResponse({
    status: 200,
    description: 'Количество отменённых обращений',
    schema: {
      example: {
        count: 3,
      },
    },
  })
  cancelAllInProgress() {
    return this.requestsService.cancelAllInProgress();
  }
}
