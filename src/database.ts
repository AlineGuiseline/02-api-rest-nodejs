// arquivo onde faremos a conexão com o banco de dados
import { knex as setupKnex, Knex } from 'knex'
// importar como "knex as setupKnex" nos permite criar uma variável com
// o nome "knex" sem sofrermos um conflito de nome duplicado
import { env } from './env'

export const config: Knex.Config = { // descrever as informações obrigatórias aqui dentro
    client: 'sqlite', // qual banco de dados estamos usando
    connection: { // precisa ter informações sobre a nossa conexão, 
    // como host, endereço, porta etc. No caso do sqlite, só precisamos informar o nome do arquiv
    // onde vamos salvar o banco de dados
        filename: env.DATABASE_URL,
        // o caminho sempre vai ser relativo à posição em que estou executando o código
        // então eu sempre vou partir da raiz ./ eu estou pegando a raiz 
        // e dentro eu espero que tenha uma pasta 'temp' (que nós já podemos
        // criar junto com o arquivo 'database.ts', mas na raiz do projeto).
        // "temp" vem de "temporário" e a ideia é usarmos o sqlite só em desenvolvimento
        // então as infos serão temporárias
    },
    useNullAsDefault: true,
    // por padrão, todos os campos do banco terão valor nulo
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    },
}
export const knex = setupKnex(config)