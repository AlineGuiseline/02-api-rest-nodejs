
/* 
    Atualmente, o Knex não sabe quais campos existem na nossa tabela e isso pode ser muito
    contraproducente, porque ele nunca vai sugerir campos a serem usados e todo esse processo
    nós teremos que fazer manualmente. Para evitar isso, nós podemos sobrescrever tipagens, ou
    seja, informações de tipos (e os tipos são, basicamente, o que adicionam essa inteligência ao
    nosso código).

    Para fazer isso, nós vamos primeiro criar uma pasta "@types" dentro da pasta "src" (usamos o 
    @ apenas para que a pasta fique no topo) e, dentro dessa pasta, vamos criar o arquivo 
    "knex.d.ts". Essa extensão .d.ts vem de "definição de tipos" (o arquivo .d.ts não vai ter 
    código js dentro dele, somente ts, ou seja, somente código que o próprio ts vai entender).

    Dentro desse arquivo nós vamos importar a bilioteca (afinal, se eu quero sobrescrever um tipo
    que vem de dentro de uma biblioteca eu preciso, primeiramente, importá-la):

    import { Knex } from 'knex';

    Nesse caso, estamos importanto o tipo global do Knex, mas o eslint vai acusar o erro de 
    "defined but never used" (e, de fato, nós não vamos usar em lugar nenhum, porque nós só
    estamos querendo informar que nós vamos reaproveitar todos os tipos que já existem dentro
    do Knex). Para contornar esse erro, acima da importação nós usaremos:

    // eslint-disable-next-line

    Isso vai fazer o eslint desconsiderar a linha de baixo (da importação)

    Depois disso, nós vamos adicionar alguns tipos novos
*/

// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amout: number
            created_at: string
            session_id?: string
        }
    }
}

/* 
Usamos 'knex/types/tables' para indicar o caminho que o nosso novo tipo vai seguir. Nesse caso,
estamos indicando que dentro da pasta 'knex' existe o 'types' e dentro do 'types' existe o 'tables';
nós estamos querendo sobrescrever essa interface "Tables" (tudo isso é explicado na Documentação do Knex)
*/