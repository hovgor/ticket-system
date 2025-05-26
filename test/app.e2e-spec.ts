import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Requests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/*.entity.ts'],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/requests (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/requests')
      .send({ subject: 'Test', message: 'Test message' })
      .expect(201);

    expect(res.body.subject).toBe('Test');
    expect(res.body.status).toBe('new');
  });

  afterAll(async () => {
    await app.close();
  });
});
