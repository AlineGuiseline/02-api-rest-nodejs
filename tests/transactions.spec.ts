import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { execSync } from 'child_process';

describe('Transactions routes', () => {
    // executa algum código apenas uma vez antes que todos os testes executem
    beforeAll(async () => {
        await app.ready()
        // a função ready vai automaticamente devolver um valor válido (porque é uma promise)
        // quando o fastify terminar de cadastrar os plugins
    })

    // após todos os testes serem executados, fecha a aplicação (ou seja, remove a aplicação
    // da memória)
    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npx knex migrate:rollback --all')
        execSync('npx knex migrate:latest')
    })
    

    it('should be able to create a new transaction', async () => {
        await request(app.server) // esse ".server" é o servidor do Node
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
        })
        .expect(201)
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie') || []

        const listTransactionsResponse = await request(app.server) // faz uma requisição para o servidor
            .get('/transactions') // para a rota GET /transactions
            .set('Cookie', cookies) // envia os cookies
            .expect(200) // retorna 200

        // espero que o corpo da requisição seja igual ao que está descrito
        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
            // não é o objeto exatamente igual ao que eu estou passando
            // no topo do código; mas sim um objeto que contém essas informações:
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })

    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
          .post('/transactions')
          .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit',
          })

        const cookies = createTransactionResponse.get('Set-Cookie') || []

        const listTransactionsResponse = await request(app.server)
          .get('/transactions')
          .set('Cookie', cookies)
          .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionResponse = await request(app.server)
          .get(`/transactions/${transactionId}`)
          .set('Cookie', cookies)
          .expect(200)
        expect(getTransactionResponse.body.transaction).toEqual(
          expect.objectContaining({
            title: 'New transaction',
            amount: 5000,
          }),
        )
      })
      
      it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(app.server)
          .post('/transactions')
          .send({
            title: 'Credit transaction',
            amount: 5000,
            type: 'credit',
          })

        const cookies = createTransactionResponse.get('Set-Cookie') || []

        await request(app.server)
          .post('/transactions')
          .set('Cookie', cookies)
          .send({
            title: 'Debit transaction',
            amount: 2000,
            type: 'debit',
          })

        const summaryResponse = await request(app.server)
          .get('/transactions/summary')
          .set('Cookie', cookies)
          .expect(200)
        expect(summaryResponse.body.summary).toEqual({
          amount: 3000,
        })
      })
})



/* o teste é composto por 3 variaveis importantes:
1. enunciado: o que o teste está proposto a fazer. Ex.:
'o usuário consegue criar uma nova transação'

2. operação: qual será a lógica desse teste

3. validação: como será validado que o teste foi bem-sucedido. Ex.:
    const responseStatusCode = 201
    
    expect(responseStatusCode).toEqual(201)
*/