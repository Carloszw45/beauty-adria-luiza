# Sindy_Designer · Lash Designer

Site responsivo com catálogo de cílios, sobrancelhas e buquês personalizados e flor animada ao fundo. Todas as opções exibem "Sob consulta" e abrem o WhatsApp para pedir valores e disponibilidade.

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

## Consultas pelo WhatsApp

Todos os cards mostram **Sob consulta**. O botão **Consultar valor** abre o WhatsApp com uma mensagem sobre a opção escolhida. A visitante pode revisar a mensagem e enviá-la no próprio WhatsApp.

O site não utiliza mais o checkout nem envia solicitações para a API de agendamentos. O código anterior em `backend/` permanece como referência histórica.

## Arquivos

- `src/App.tsx`: catálogo e links de consulta pelo WhatsApp.
- `src/lib/catalog.ts`: procedimentos, descrições e durações.
- `src/styles.css`: layout, animação e acessibilidade.
- `public/assets/`: fotos de referência e flor.
- `docs/`: versão compilada para o GitHub Pages.
- `licenses/`: licenças das fontes.

A animação respeita a preferência de movimento reduzido e pode ser pausada no rodapé. As imagens dos procedimentos foram fornecidas pelo usuário. A flor foi criada para este site. As fontes Cormorant, Italianno e Manrope são distribuídas sob a SIL Open Font License.
