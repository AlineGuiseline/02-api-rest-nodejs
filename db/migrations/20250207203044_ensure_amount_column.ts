import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transactions", function (table) {
        table.renameColumn("amout", "amount");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transactions", function (table) {
        table.renameColumn("amount", "amout"); // Volta para "amout" se precisar reverter
    });
}