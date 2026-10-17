# WEATHER MAP

### Objetivo

O **Weather Map** é uma aplicação web de consulta e monitoramento de dados climáticos. O projeto foi estruturado com uma arquitetura em camadas e totalmente conteinerizada, integrando uma interface reativa em Vue.js, um servidor em Node.js e um banco de dados relacional PostgreSQL orquestrados via Docker Compose.

### Funcionalidades

* **Consulta Climática Interativa** - Interface desenvolvida em Vue.js para busca dinâmica e visualização de dados meteorológicos;

* **API de Processamento** - Servidor em Node.js responsável pelas regras de negócio, integrações e tratamento das requisições;

* **Persistência de Dados** - Armazenamento estruturado no PostgreSQL, com inicialização automatizada de schemas e tabelas via scripts SQL;

* **Ambiente Isolado e Reprodutível** - Configuração de containers independente de ambiente para todos os módulos da aplicação.

### Tecnologias Utilizadas

* **Front-end**: [Vue.js](https://vuejs.org/), JavaScript e [Vite](https://vitejs.dev/);

* **Back-end**: [Node.js](https://nodejs.org/) (JavaScript);

* **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/docs/);

* **Conteinerização**: [Docker](https://www.docker.com/) e Docker Compose;

* **Controle de Versões**: Git e GitHub.

### Como Executar?

**Pré-Requisitos:**
Certifique-se de ter instalado em sua máquina:

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Docker Desktop](https://docs.docker.com/get-started/get-docker/)

#### 1 - Clonar o Repositório
Abra o seu terminal e clone o projeto com o comando:

```bash
git clone https://github.com/HenriqueEnglert/weathermap
cd weathermap
```

#### 2 - Configuração das Variáveis de Ambiente
Na raiz do projeto (`weathermap/`), crie o arquivo `.env` com base no arquivo `.env.example`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` em um editor de texto e preencha com as suas configurações (portas da aplicação, credenciais do banco PostgreSQL, chaves de API, etc.).

#### 3 - Instalação de Dependências
Como as pastas `frontend/` e `backend/` possuem dependências específicas de pacotes gerenciados pelo npm, acesse cada um dos diretórios para realizar a instalação antes da primeira execução:

* **Instalar dependências do Back-end:**

  ```bash
  cd backend
  npm install
  cd ..
  ```

* **Instalar dependências do Front-end:**

  ```bash
  cd frontend
  npm install
  cd ..
  ```

#### 4 - Construção e Execução com Docker
Com os pacotes instalados e o arquivo `.env` configurado, utilize o Docker Compose no diretório raiz do projeto:

* **Construir as imagens dos containers:**

  ```bash
  docker compose build
  ```

* **Subir e iniciar a aplicação:**

  ```bash
  docker compose up -d
  ```

  *(A flag `-d` executa os containers em segundo plano. Para visualizar as mensagens de log no terminal em tempo real, rode apenas `docker compose up`).*

#### 5 - Encerrar a Aplicação e Limpar Registros
Caso precise interromper os serviços, remover os containers e resetar o banco de dados e os caches temporários criados nos containers, execute:

```bash
docker compose down -v
```

*Nota: O comando `docker compose down` encerra e remove os containers da aplicação, enquanto a opção `-v` garante a remoção dos volumes associados ao PostgreSQL, apagando os dados armazenados temporariamente na imagem do container.*

---

### Conceitos Utilizados

* **Divisão em Camadas (Separation of Concerns)**: Módulos independentes para front-end, back-end e banco de dados;

* **Orquestração de Containers**: Uso de Docker Compose para gerenciar e conectar as imagens das aplicações de forma isolada;

* **Inicialização Automatizada de Banco**: Script `init.sql` responsável pela preparação inicial das tabelas do SGBD PostgreSQL no primeiro boot do container.