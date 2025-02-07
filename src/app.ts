import fastify from "fastify";
import cookie from "@fastify/cookie";
import { transactionsRoutes } from "./routes/transactions";

export const app = fastify()
// cria a base da nossa aplicação

// a ordem que definimos o plugin é a ordem que o Fastify vai executar
// então se tem um plugin que modifica algo importante e precisa rodar antes
// dos outros plugins, precisamos tomar cuidado para que eles estejam na ordem correta
app.register(cookie);

app.register(transactionsRoutes, {
    prefix: 'transactions'
})
/* 
Todas as rotas dentro do nosso plugin "transactionsRoutes" utilizarão o prefixo "transaction",
então nós podemos importar o plugin em "server.ts" passando um segundo parâmetro, incluindo
algumas configurações. Nesse caso, será o "prefix", que é o prefixo da URL para que esse
plugin seja ativo
*/