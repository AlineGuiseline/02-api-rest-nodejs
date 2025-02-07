import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.uuid('session_id').after('id').index()
        // o .after() informa que a coluna deve ficar depois da coluna "id"
        // o .index() cria um índice automático neste campo da tabela
        // o índice é uma forma de falarmos ao db que eu vou fazer muitas
        // buscas em transações específicas de um id de uma sessão
        // ou seja, o "session_id" vai ser muito utilizado dentro do WHERE
        // assim a nossa busca fica mais rápida, porque o db vai criar
        // uma espécie de cache de qual session id possui quais transações
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id')
        // dropa a coluna recém-criada
    })
}
