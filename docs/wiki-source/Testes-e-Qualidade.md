# Testes e Qualidade

## Estratégia

O projeto possui cobertura em quatro frentes:

- testes unitários
- testes de integração/API
- testes de concorrência
- testes de performance

## Ferramentas

- `Mocha`
- `Chai`
- `Supertest`
- `Mochawesome`
- `k6`
- `GitHub Actions`

## Cobertura atual

- casos funcionais da API
- cenários negativos de segurança
- regras de hierarquia
- normalização e validação de domínio
- cenários concorrentes críticos
- cenários de performance `CPT-001` a `CPT-006`

## Pipelines

### CI

- instala dependências
- sobe MySQL
- cria `.env.test`
- inicializa o banco de teste
- executa testes unitários
- executa testes de API
- publica relatório do Mochawesome

### Performance

- instala dependências
- sobe MySQL
- cria `.env.test`
- inicializa o banco de teste
- instala `k6`
- executa a suíte de performance
- publica os sumários do `k6`

## Referências detalhadas

- [docs/testes/estrategia.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/testes/estrategia.md)
- [docs/testes/casos-de-teste.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/testes/casos-de-teste.md)
- [docs/testes/testes-automatizados.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/testes/testes-automatizados.md)
- [docs/testes/performance.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/testes/performance.md)
