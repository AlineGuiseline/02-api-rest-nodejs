import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // o que a migration vai fazer no banco de dados
    // ex.: criar uma tabela, adicionar um campo em uma tabela existente
    // remover tabela, etc
    await knex.schema.createTable('transactions', (table) => {
        // 'transactions' é o primeiro parâmetro; o nome da tabela
        // a função é o segundo parâmetro; vai receber um parâmetro
        // responsável por criar os campos da tabela
        table.uuid('id').primary() // sinaliza que é a chave primária
        table.text('title').notNullable() // .notNullable() sinaliza que o campo não pode ficar vazio
        table.decimal('amout', 10, 2).notNullable() // o 10 é o tamanho do número que eu quero armazenar e o 2 é o número de casas decimais
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // anota a daat que cada registro foi criado (o ideal é ter em todas as tabelas)
    })
}


export async function down(knex: Knex): Promise<void> {
    // o método a ser chamado se der BO;
    // ele "desfaz" o que o método "up" faz, ou seja,
    // se no up eu criei uma tabela, no down eu removo
    // se no up eu alterei uma tabela, no down eu desfaço a alteração
    await knex.schema.dropTable('transactions')
}
