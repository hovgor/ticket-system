import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestsService } from '../request.service';

const mockRequestRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('RequestService', () => {
  let service: RequestsService;
  let repo: Repository<Request>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: getRepositoryToken(Request),
          useFactory: mockRequestRepository,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    repo = module.get(getRepositoryToken(Request));
  });

  it('should create a new request', async () => {
    const dto = { subject: 'Test', message: 'Hello' };
    const created = { id: 1, ...dto, status: 'new' };
    (repo.create as jest.Mock).mockReturnValue(created);
    (repo.save as jest.Mock).mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
    expect(repo.create).toBeCalledWith({ ...dto, status: 'new' });
  });
});
