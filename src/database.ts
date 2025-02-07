// arquivo onde faremos a conexão com o banco de dados
import { knex as setupKnex, Knex } from 'knex'
// importar como "knex as setupKnex" nos permite criar uma variável com
// o nome "knex" sem sofrermos um conflito de nome duplicado
import { env } from './env'

export const config: Knex.Config = { // descrever as informações obrigatórias aqui dentro
    client: env.DATABASE_CLIENT, // qual banco de dados estamos usando
    connection: env.DATABASE_CLIENT === 'sqlite' 
    ? {
        filename: env.DATABASE_URL,
    } 
    : env.DATABASE_URL,
    useNullAsDefault: true,
    // por padrão, todos os campos do banco terão valor nulo
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    },
}
export const knex = setupKnex(config)