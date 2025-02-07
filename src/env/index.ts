import { config } from 'dotenv'
// lê o arquivo .env automaticamente e expõe todos os valores
// lá dentro em uma variável global chamada "process.env"

import { z } from 'zod'
// serve para criar schemas, que são formatos de dados

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config() // vai procurar as variáveis ambientes no .env
}



const envSchema = z.object({
// aqui dentro nós informamos qual é o formato que eu vou receber
// de dados das nossas variáveis ambiente e nós vamos fazer para
// todas as variáveis ambientes em um único schema
// como nós conseguimos acessar as propriedades de dentro de "process.env"
// nós podemos dizer que ele é um objeto, então nós utilizaremos z.object
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    // o NODE_ENV diz em qual ambiente a aplicação está rodando. Costuma ser
    // informado automaticamente pelas ferramentas que estamos utilizando
    // para executar a aplicação, mas em algumas dessas ferramentas essa
    // variável não é preenchida automaticamente. Temos 3 opções:
    // "development", "test" e "production"
    // enum() significa "uma entre algumas opções"
    // o "default" indica que, se essa variável não for informada no .env
    // a aplicação deve considerar como se fosse "production"
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)
// quando eu chamo o método "safeParse", é como se nós pegássemos esse schema,
// passássemos para ele os dados que estão vindo de "process.env"
// e o zod faz uma validação automática, analisando "ok, a DATABASE_URL
// é uma string e é obrigatória", então ele vai dentro do process.env
// para ver se tem uma DATABASE_URL, para ver se ela é uma string e se
// ela está sendo informada vazia ou com algum valor incorreto
// se alguma info der erro, nenhum erro será disparado automaticamente
// e isso nos permite personalizar o nosso próprio informe de erro
// o método safeParse é irmão do método parse, mas o parse dispara,
// automaticamente, um erro (similar ao throw new Error) e coloca um erro de validação
// mas não é tão intuitivo ou informativo

if(_env.success === false) {
    // isso significa que houve uma falha na verificação, ou seja, 
    // algo não foi informado corretamente
    console.error('⚠ Invalid enviroment variables!', _env.error.format())
    // _env.error.format() formata os erros que temos nas variáveis

    throw new Error('⚠ Invalid enviroment variables.')
    // isso impede que o código continue executando
}

export const env = _env.data
// se passar pelo if com sucesso, fazemos o export das variáveis
// ambientes em si