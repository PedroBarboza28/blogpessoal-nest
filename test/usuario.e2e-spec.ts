import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {

  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000); // Aumentado o timeout para 10 segundos

  afterAll(async () => {
    await app.close();
  }, 10000); // Aumentado o timeout para 10 segundos

  it("01 - Deve Cadastrar um novo Usuário", async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201)

    usuarioId = resposta.body.id;
  }, 10000); // Aumentado o timeout para 10 segundos

  it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400)
  }, 10000); // Aumentado o timeout para 10 segundos

  it("03 - Deve Autenticar o Usuário (Login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post("/usuarios/logar")
    .send({
      usuario: 'root@root.com',
      senha: 'rootroot',
    })
    .expect(200)

    token = resposta.body.token;
  }, 10000); // Aumentado o timeout para 10 segundos

  it("04 - Deve Listar todos os Usuários", async () => {
    return request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  }, 10000); // Aumentado o timeout para 10 segundos

  it("05 - Deve Atualizar um Usuário", async () => {
    return request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', `${token}`)
    .send({
      id: usuarioId,
      nome: 'Root Atualizado',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '-',
    })
    .expect(200)
    .then(resposta => {
      expect("Root Atualizado").toEqual(resposta.body.nome);
    })
  }, 10000); // Aumentado o timeout para 10 segundos

  it("06 - Deve Listar apenas um Usuário pelo id", async () => {
    return request(app.getHttpServer())
    .get(`/usuarios/${usuarioId}`)
    .set('Authorization', `${token}`)
    .send({})
    .expect(200)
  }, 10000); // Aumentado o timeout para 10 segundos

});
