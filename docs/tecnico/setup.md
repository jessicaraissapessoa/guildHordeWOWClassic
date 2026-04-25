# Setup

## Premissas

- O projeto sera executado inicialmente em ambiente local.
- A API rodara localmente com Node.js e Express.
- O banco sera um MySQL local.

## Requisitos

- Node.js LTS instalado
- npm instalado
- MySQL instalado e em execucao
- k6 instalado para execucao de testes de performance

## Instalacao

```bash
npm install
```

## Variaveis de ambiente esperadas

Documentar em `.env` quando a implementacao existir:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=guild_horde_wow_classic
DB_USER=root
DB_PASSWORD=changeme
JWT_SECRET=changeme
JWT_EXPIRES_IN=1h
```

## Execucao local

Comandos exatos dependerao dos scripts reais do projeto. A expectativa e ter algo equivalente a:

```bash
npm run dev
```

## Banco de dados local

Passos esperados:

1. Criar o schema MySQL local.
2. Configurar as variaveis de ambiente.
3. Executar scripts SQL de criacao de tabelas e indices.

## Swagger local

O contrato OpenAPI fica em `docs/api/swagger/openapi.yaml` e deve apontar para `http://localhost:3000`.

## Performance local

Os testes de performance devem ser executados com k6 em suite separada da suite funcional.
