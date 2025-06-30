## Padrão de Commits

Este projeto utiliza o padrão **Conventional Commits** para manter um histórico de versões claro e organizado.

### Estrutura

<tipo>(escopo opcional): <mensagem curta>


**Exemplos:**

feat: adiciona formulário de cadastro de usuários
fix: corrige bug na validação de email
docs(readme): atualiza instruções de instalação
style: remove console.log e ajusta identação
refactor: reorganiza funções do controller


### Tipos aceitos

| Tipo       | Uso previsto                                     |
|------------|--------------------------------------------------|
| `feat`     | Adição de nova funcionalidade                    |
| `fix`      | Correção de bugs                                 |
| `docs`     | Alterações na documentação                       |
| `style`    | Mudanças que não afetam lógica (espaços, formatação) |
| `refactor` | Refatorações sem alterar funcionalidades         |
| `test`     | Inclusão ou alteração de testes                  |
| `chore`    | Tarefas auxiliares (build, configs, etc.)        |
| `perf`     | Melhorias de desempenho                          |
| `ci`       | Mudanças em integração contínua                  |
| `build`    | Mudanças que afetam o processo de build          |

### Boas práticas

- Use verbos no **imperativo** na mensagem:  
  Exemplo: `cria`, `adiciona`, `remove`, `altera`, e não `criado`, `adicionado`.
- Seja direto e claro na descrição da mudança.
- Use o campo de escopo opcional para especificar o módulo, componente ou arquivo alterado.

### Mensagens com descrição complementar (opcional)

Caso necessário, você pode adicionar um corpo à mensagem do commit para dar mais contexto:

feat: adiciona autenticação por token JWT

Implementa verificação de token nas rotas protegidas.
Adiciona middleware de autenticação no backend.

---

Seguindo esse padrão, todo o time mantém consistência e facilita a leitura e manutenção do projeto.
