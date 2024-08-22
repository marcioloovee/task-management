# Sistema de Gerenciamento de Tarefas

Este é um Sistema de Gerenciamento de Tarefas construído com NestJS, TypeORM e PostgreSQL. O projeto está containerizado usando Docker e pode ser facilmente configurado usando `docker-compose`.

## Funcionalidades

- Criar, atualizar, excluir e gerenciar tarefas.
- Filtrar tarefas por vários critérios.
- Exclusão lógica de tarefas.
- Integração com projetos e usuários.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pnpm](https://pnpm.io/) Obs.: Pode usar npm

## Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/marcioloovee/task-management.git
    cd task-management
    ```

2. **Instale as dependências:**

    Se você ainda não tem o `pnpm` instalado, você pode instalá-lo globalmente com:

    ```bash
    npm install -g pnpm
    ```

    Em seguida, instale as dependências do projeto usando:

    ```bash
    pnpm install
    ```

3. **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` no diretório raiz e configure suas variáveis de ambiente:

    ```bash
    NODE_ENV=DEV

    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=task_management

    JWT_SECRET_TOKEN="secret_token"
    ```

4. **Construa e inicie os contêineres Docker:**

    Use `docker-compose` para construir e executar a aplicação:

    ```bash
    docker-compose up
    ```

5. **Acesse a aplicação:**

    Uma vez que os contêineres estejam em execução, você pode acessar a aplicação em:

    ```
    http://localhost:3000
    ```

6. **Execute as migrações do banco de dados:**

    Para aplicar as migrações, conecte-se ao contêiner em execução:

    ```bash
    docker exec -it nome-do-seu-serviço bash
    ```

    Então execute o seguinte comando dentro do contêiner:

    ```bash
    pnpm run migration:run
    ```

## Executando Testes

Para executar os testes, use o seguinte comando:

```bash
pnpm test
```

## Documentação da API

A documentação da API está disponível em:

```
http://localhost:3000/api
```

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)