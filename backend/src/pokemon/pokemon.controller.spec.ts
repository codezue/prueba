import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pokemon/types (GET) should return types', async () => {
    const res = await request(app.getHttpServer()).get('/pokemon/types');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('fire');
  });

  it('/pokemon/search (GET) with query should return paginated results', async () => {
    const res = await request(app.getHttpServer()).get('/pokemon/search?query=char');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/pokemon/search (GET) with typeFilter should return filtered results', async () => {
    const res = await request(app.getHttpServer()).get('/pokemon/search?typeFilter=fire');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
