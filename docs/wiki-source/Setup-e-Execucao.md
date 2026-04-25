# Setup e Execução

## Pré-requisitos

- Node.js LTS
- npm
- MySQL local
- k6 instalado para a suíte de performance

## Variáveis de ambiente

Arquivos de exemplo versionados:

- `.env.example`
- `.env.test.example`

Arquivos locais:

- `.env`
- `.env.test`

## Comandos principais

Instalar dependências:

```bash
npm install
```

Inicializar banco principal:

```bash
npm run db:init
```

Inicializar banco de teste:

```bash
npm run db:init:test
```

Subir a API:

```bash
npm run dev
```

ou

```bash
npm start
```

## Testes

Testes unitários:

```bash
npm run test:unit
```

Testes de API:

```bash
npm test
```

Relatório HTML dos testes de API:

```bash
npm run test:html
```

Testes de performance:

```bash
npm run test:performance
```

## Referências detalhadas

- [README.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/README.md)
- [docs/tecnico/setup.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/tecnico/setup.md)
