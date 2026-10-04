# API de agendamentos

Código da API usada pelo checkout, hospedada separadamente no site original com Cloudflare Workers e D1. Estes arquivos documentam a implementação do servidor; eles não são executados pelo GitHub Pages.

- Endpoint: `https://aria-luiza-studio.chcruz.chatgpt.site/api/bookings`
- `POST`: valida o formulário, consulta os preços do catálogo, grava a solicitação pendente no D1 e retorna o resumo. O identificador da solicitação evita duplicação em novas tentativas.
- `OPTIONS`: permite o checkout na origem `https://carloszw45.github.io` e no próprio domínio do servidor.
- Não existe endpoint público de listagem das solicitações.
- O pagamento ocorre no atendimento e o horário depende de confirmação.

O esquema e a migração da tabela estão incluídos. O binding de produção é `DB`. Os dados dos clientes e as credenciais ficam fora deste repositório.
