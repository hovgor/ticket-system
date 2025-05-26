import { Test, TestingModule } from "@nestjs/testing";
import { RequestsController } from "../request.controller";
import { RequestsService } from "../request.service";
import { CreateRequestDto } from "../dto/create-request.dto";
import { CompleteRequestDto } from "../dto/complete-request.dto";
import { CancelRequestDto } from "../dto/cancel-request.dto";

describe('RequestController', () => {
  let controller: RequestsController;
  let service: RequestsService;

  const mockService = {
    create: jest.fn(),
    takeToWork: jest.fn(),
    complete: jest.fn(),
    cancel: jest.fn(),
    findAll: jest.fn(),
    cancelAllInProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
    service = module.get<RequestsService>(RequestsService);
  });

  it('should create request', async () => {
    const dto: CreateRequestDto = {
      subject: 'Test Subject',
      message: 'Test message',
    };
    const mockResult = { id: 1, ...dto, status: 'new' };

    mockService.create.mockResolvedValue(mockResult);

    const result = await controller.create(dto);
    expect(result).toEqual(mockResult);
    expect(mockService.create).toBeCalledWith(dto);
  });

  it('should take request into work', async () => {
    mockService.takeToWork.mockResolvedValue({ id: 1, status: 'in_progress' });
    const result = await controller.takeToWork(1);
    expect(result.status).toBe('in_progress');
    expect(mockService.takeToWork).toBeCalledWith(1);
  });

  it('should complete request', async () => {
    const dto: CompleteRequestDto = { resolution: 'Fixed it' };
    mockService.complete.mockResolvedValue({ id: 1, status: 'completed' });

    const result = await controller.complete(1, dto);
    expect(result.status).toBe('completed');
    expect(mockService.complete).toBeCalledWith(1, dto);
  });

  it('should cancel request', async () => {
    const dto: CancelRequestDto = { cancelReason: 'No longer needed' };
    mockService.cancel.mockResolvedValue({ id: 1, status: 'cancelled' });

    const result = await controller.cancel(1, dto);
    expect(result.status).toBe('cancelled');
    expect(mockService.cancel).toBeCalledWith(1, dto);
  });

  it('should get paginated list', async () => {
    const mockResponse = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };
    mockService.findAll.mockResolvedValue(mockResponse);

    const result = await controller.findAll('2025-01-01', '2025-12-31', '1', '10');
    expect(result).toEqual(mockResponse);
    expect(mockService.findAll).toBeCalledWith('2025-01-01', '2025-12-31', 1, 10);
  });

  it('should cancel all in-progress requests', async () => {
    mockService.cancelAllInProgress.mockResolvedValue({ affected: 3 });
    const result = await controller.cancelAllInProgress();
    expect(result).toEqual({ affected: 3 });
  });
});
