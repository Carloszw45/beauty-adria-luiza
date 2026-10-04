# Beauty Adria Luíza · Lash Designer

Site responsivo com catálogo de cílios e sobrancelhas, flor animada ao fundo e checkout de solicitação de atendimento. Os valores são os fornecidos nas imagens de referência.

## Publicação no GitHub Pages

A pasta `docs/` contém a versão pronta para publicar. Em **Settings → Pages**, use **Deploy from a branch**, selecione **main** e a pasta **/docs**, e clique em **Save**. Os arquivos usam caminhos relativos para funcionar no endereço do repositório.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```sh
npm ci
npm run dev
```

Para atualizar a versão publicada:

```sh
npm run build
```

Envie as alterações em `src/` e `docs/` ao repositório. A publicação pelo branch será atualizada pelo GitHub Pages.

## Checkout

A cliente escolhe um procedimento, informa nome, WhatsApp, data e horário, revisa os valores e envia a solicitação. O pedido é registrado como pendente na API do site original. Ela pode salvar o resumo em texto. Não há cobrança online nem confirmação automática de horário.

O GitHub Pages hospeda o frontend estático; a API e o banco de agendamentos permanecem no servidor original. O código de referência da API está em `backend/`. Nenhum dado de clientes ou credencial é incluído aqui.

## Arquivos

- `src/App.tsx`: catálogo e checkout.
- `src/lib/catalog.ts`: procedimentos e preços em centavos.
- `src/styles.css`: layout, animação e acessibilidade.
- `public/assets/`: fotos de referência e flor.
- `docs/`: versão compilada para o GitHub Pages.
- `licenses/`: licenças das fontes.

A animação respeita a preferência de movimento reduzido e pode ser pausada no rodapé. As imagens dos procedimentos foram fornecidas pelo usuário. A flor foi criada para este site. As fontes Cormorant, Italianno e Manrope são distribuídas sob a SIL Open Font License.
