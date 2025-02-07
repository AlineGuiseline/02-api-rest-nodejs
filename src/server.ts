import { app } from "./app"
import { env } from "./env"

app.listen({
    // faz a aplicação ouvir uma porta (precisa ser um objeto)
    port: env.PORT,
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
}).then(() => {
    console.log('HTTP Server Running')
    // o listen retorna uma promise, então eu quero saber quando a promise
    // terminou de ser executada para eu dar um console.log
})

/* 
Uma das funcionalidades mais importantes do Fastify é a funcionalidade dos plugins.
Os plugins nada mais são do que uma forma de separarmos pequenos pedaços da aplicação em mais
arquivos. 
*/