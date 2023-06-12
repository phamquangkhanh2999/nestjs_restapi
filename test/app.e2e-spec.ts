import { PrismaService } from './../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
/**
 *  npx dotenv -e .env.test -- prisma studio
 */
const PORT = 3000;
describe('App  EndTodo Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDataBase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });
  describe('Test Authentication', () => {
    describe('Register', () => {
      it('should show error with empty email', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: '',
            password: 'a123456',
          })
          .expectStatus(400);
      });
      it('should show error with invalid email format', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'quang@gmail',
            password: 'a123456',
          })
          .expectStatus(400);
      });
      it('should show error with empty password', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: 'quang@gmail',
            password: 'a123456',
          })
          .expectStatus(400);
      });

      it('Should Register', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'test@gmail.com',
            password: 'a123456',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
        // .inspect();
      });
    });
    describe('Login', () => {
      it('Should Login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: 'test@gmail.com',
            password: 'a123456',
          })
          .expectStatus(201);
        // .inspect();
      });
    });
    describe('User', () => {
      describe('Get Detail User', () => {
        it('Should get detail user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{accessToken}',
            })
            .expectStatus(200);
          // .inspect();
        });
      });
    });
  });

  afterAll(async () => {
    app.close();
  });
  it.todo('should Pass');
});
