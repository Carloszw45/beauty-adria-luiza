# Geovana Designer

Site público: https://carloszw45.github.io/beauty-adria-luiza/

Catálogo de cílios, sobrancelhas e buquês personalizados com visual vinho e creme, seis imagens ilustrativas diferentes, três itens por linha no celular e consultas pelo WhatsApp **(31) 99749-1835**. Todos os valores são sob consulta.

## Site atual e publicação

A pasta `docs/` é o código completo e pronto do site atual. É uma aplicação estática sem dependências de compilação. O GitHub Pages publica o branch `main`, pasta `/docs`. Enviar alterações nessa pasta atualiza o site.

- `docs/index.html`: conteúdo, catálogo, metadados e formulário de consulta.
- `docs/styles.css`: visual e layouts responsivos.
- `docs/catalog.mjs`: catálogo, contato e mensagens para o WhatsApp.
- `docs/app.mjs`: filtros, seleção de itens, quantidades e interações.
- `docs/assets/`: fotografias ilustrativas e fontes locais otimizadas.
- `design-assets.json`: prompts das oito imagens exclusivas, geradas com ImageGen.

A seleção é guardada no navegador. Nome, data e observações são enviados ao WhatsApp quando o visitante inicia a consulta. Valores, disponibilidade, pedidos e agendamentos são confirmados na conversa. A página não cobra pagamentos.

## Verificação

```sh
node --check docs/app.mjs
node --check docs/catalog.mjs
```

A animação respeita movimento reduzido e pode ser pausada no rodapé. Cada card tem uma imagem própria; o catálogo identifica as imagens como ilustrativas. As fontes e suas licenças estão hospedadas junto ao site.

## Histórico

O endereço original do repositório foi mantido para preservar o link da loja. Os diretórios `src/`, `public/` e `backend/` pertencem à versão anterior e permanecem preservados. Para atualizar o site atual, edite os arquivos em `docs/`.
