import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request, RequestStatus } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { CompleteRequestDto } from './dto/complete-request.dto';
import { CancelRequestDto } from './dto/cancel-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
  ) {}

  async create(dto: CreateRequestDto): Promise<Request> {
    const request = this.requestRepo.create({
      subject: dto.subject,
      message: dto.message,
      status: RequestStatus.NEW,
    });
    return this.requestRepo.save(request);
  }

  async takeToWork(id: number): Promise<Request> {
    const request = await this.requestRepo.findOneBy({ id });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== RequestStatus.NEW)
      throw new BadRequestException('Only new requests can be taken to work');
    request.status = RequestStatus.IN_PROGRESS;
    return this.requestRepo.save(request);
  }

  async complete(id: number, dto: CompleteRequestDto): Promise<Request> {
    const request = await this.requestRepo.findOneBy({ id });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status !== RequestStatus.IN_PROGRESS)
      throw new BadRequestException('Only in-progress requests can be completed');
    request.status = RequestStatus.COMPLETED;
    request.resolution = dto.resolution;
    return this.requestRepo.save(request);
  }

  async cancel(id: number, dto: CancelRequestDto): Promise<Request> {
    const request = await this.requestRepo.findOneBy({ id });
    if (!request) throw new NotFoundException('Request not found');
    if (request.status === RequestStatus.CANCELED || request.status === RequestStatus.COMPLETED)
      throw new BadRequestException('Cannot cancel completed or already canceled requests');
    request.status = RequestStatus.CANCELED;
    request.cancelReason = dto.cancelReason;
    return this.requestRepo.save(request);
  }

  async findAll(
    from?: string,
    to?: string,
    page = 1,
    limit = 10
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
  
    const query = this.requestRepo.createQueryBuilder('request');
  
    if (from) {
      query.andWhere('request.createdAt >= :from', { from });
    }
    if (to) {
      query.andWhere('request.createdAt <= :to', { to });
    }
  
    query.orderBy('request.createdAt', 'DESC');
    query.skip(skip).take(limit);
  
    const [data, total] = await query.getManyAndCount();
  
    const statusMap = {
      new: 'Новый',
      in_progress: 'В работе',
      completed: 'Завершено',
      cancelled: 'Отменено',
    };
  
    const formattedData = data.map((item) => ({
      ...item,
      statusText: statusMap[item.status],
      createdAt: new Date(item.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  
    return {
      data: formattedData,
      total,
      page,
      limit,
    };
  }
  

  async cancelAllInProgress(): Promise<{ count: number }> {
    const updateResult = await this.requestRepo
      .createQueryBuilder()
      .update(Request)
      .set({ status: RequestStatus.CANCELED, cancelReason: 'Отменено системой' })
      .where('status = :status', { status: RequestStatus.IN_PROGRESS })
      .execute();
    return { count: updateResult.affected || 0 };
  }
}
