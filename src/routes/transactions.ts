import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

// Cookies são formas de mantermos contexto entre requisições

// todo plugin precisa ser uma função assíncrona. É a lógica que o Fastify usa para 
// conseguir aguardar todo o código do plugin carregar
export async function transactionsRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [checkSessionIdExists],
        // "preHandler": "pre" vem de "Previous", ou seja, ele "executa antes"
        // antes de quê? Antes do "Handler". Já o Handler é toda a função que vem logo abaixo,
        // pois ela lida com o funcionamento dessa rota
        // Então antes do Handler eu quero executar a função que criei no middleware
    }, async (request) => {
        // lembrando que eu só preciso colocar '/' porque já está prefixado que após a /
        // virá o "transactions"
        // lembrando também que só precisamos colocar "request, reply" se for necessário

        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
        // se colocar apenas .select() ele já seleciona todos os campos

        return { transactions }
        // é recomendado sempre retornar como um objeto, porque isso facilita na exibição dos
        // dados e, principalmente, no chamamento pelo front-end, porque se eu quiser adicionar
        // novos elementos a serem retornados, o front-end vai conseguir especificar quais
        // informações ele vai exibir apenas chamando-as pelo nome
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists],
    }, async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
        .where({
            id,
            session_id:  sessionId
        })
        .first()
        // eu espero que tenha só um retorno com esse id, então eu indico isso com .first()
        // sem o .first() será retornado um array

        return { transaction }
    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists],
    }, async (request) => {
        const { sessionId } = request.cookies

        const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amout', { as: 'amount' })
        .first()
        // o .first() é para garantir que o retorno NÃO seja um array e sim um elemento só

        return { summary }
    })

    app.post('/', async (request, reply) => {
        // req.body: de onde vêm as informações incriptadas que nós usaremos para
        // criar ou editar um recurso
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amout: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        
        const { title, amout, type } = createTransactionBodySchema.parse(
            request.body
        )
        // estou validando os dados do req.body (os dados vindos da requisição) para ver se
        // eles batem com o schema de validação que eu defini
        // se o parse verificar se tem algum erro, ele vai dar um throw e não vai executar 
        // nada que está nas linhas de baixo

        let sessionId = request.cookies.sessionId
        // procura dentro dos cookies da aplicação (os nossos "metadados invisíveis") se já
        // existe uma sessionId. Se já existir, é só eu passar na hora de criar a transação;
        // se não existir uma sessão (ou seja, se o usuário não tem nos cookies dele um id
        // de sessão), eu irei criar uma para ele

        console.log(request.body)
        console.log(request.cookies)

        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                // em quais endereços esse cookie vai estar disponível (ou seja, quais rotas do
                // back-end vão poder acessá-lo). Se eu coloco '/', eu estou falando que qualquer
                // rota do back-end pode acessar esses cookies (se eu colocasse "/transactions"
                // apenas as rotas iniciadas com "/transactions" poderiam acessar e por aí vai)
                maxAge: 60 * 60 * 24 * 7 // 7 dias
                // expiração do cookie (todo cookie que nós salvamos no navegador da pessoa
                // precisa expirar em algum momento). Podemos passar essa informação de duas formas:
                // se eu passar o expire date eu vou precisar pasasr um objeto Date com a data/hora
                // exata que o cookie vai expirar, mas isso é muito maçante e geralmente trabalhamos
                // com o maxAge, onde passamos em segundos quanto tempo que esse cookie deve
                // durar no navegador do usuário
                // se eu quero 1 minuto, preciso multiplicar por 60
                // se eu quero 1 hora, preciso pegar esse valor e multiplicar por mais 60
                // se eu quero 1 dia, multiplico esse valor por 24
                // se eu quero 7 dias, multiplico esse valor por 7
                // uma dica é sempre comentar do lado o que significa esse número para que a próxima
                // pessoa a pegar o código entenda imediatamente o tempo que você passou
            })

            // cria um novo id de sessão e salva nos cookies a informação "sessionId"
            // junto com esse valor de id recém-criado
        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amout: type === 'credit' ? amout : amout * -1,
            /* nós não criamos uma coluna com o tipo da transação (se é crédito ou débito),
            por isso nós vamos utilizar apenas o amout e colocar a seguinte verificação:
            se for do tipo "crédito", vou utilizar o amout do jeito que ele está
            se for do tipo "débito", vou pegar o amout e multiplicar por -1
            ou seja, quando eu cadastrar uma transação do tipo "débito", eu vou cadastrar
            o amout como um valor negativo. Assim, depois quando eu for fazer o resumo e
            somar todos os valores do banco de dados, porque eu somo os valores positivos
            com negativos e vai dar o valor total
            */
           session_id: sessionId,
        })
        

        // geralmente em rotas de criação dentro da API nós não fazemos retornos de variáveis
        // ou coisas do tipo. Nós só retornamos a resposta com o status code e enviamos a resposta
        // com o .send()
        return reply.status(201).send()
    })
}

/* 

*/