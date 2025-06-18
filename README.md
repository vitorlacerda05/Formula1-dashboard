# F1 Dashboard

Um sistema interativo para análise e visualização de dados da Fórmula 1, desenvolvido como projeto final para a disciplina SCC-541 - Laboratório de Bases de Dados do ICMC-USP.

## 🚀 Funcionalidades

- **Autenticação Segura**
  - Sistema de login com três perfis: Administrador, Escuderia e Piloto
  - Criptografia de senhas usando SCRAM-SHA-256
  - Registro de logs de acesso

- **Dashboards Personalizados**
  - Interface específica para cada tipo de usuário
  - Visualização de estatísticas relevantes
  - Gráficos e métricas em tempo real

- **Relatórios Dinâmicos**
  - Análise de resultados por status de corrida
  - Mapeamento de aeroportos próximos às cidades-sede
  - Exportação de dados em diferentes formatos

## 🛠️ Tecnologias Utilizadas

### Backend
- PostgreSQL com extensões criptográficas
- Fastify para API REST
- PL/pgSQL para funções e triggers
- Sistema de autenticação baseado em cookies HTTP-Only

### Frontend
- React
- TypeScript
- Context API para gerenciamento de estado
- Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js (versão LTS)
- PostgreSQL 12+
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Gabriel-Fachini/f1-dashboard.git
cd f1-dashboard
```

2. Configure o banco de dados:
- Execute os scripts SQL na ordem correta
- Configure as variáveis de ambiente no arquivo `.env`

3. Instale as dependências do backend:
```bash
cd backend
npm install
```

4. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

## 🚀 Executando o Projeto

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Inicie o frontend:
```bash
cd frontend
npm start
```

## 👥 Autores

- Bruno Garcia de Oliveira Breda
- Gabriel Fernando Machado Fachini
- Isabela Oliveira Costa
- Vitor Antonio de Almeida Lacerda

## 📝 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina SCC-541 do ICMC-USP.

## 🙏 Agradecimentos

- Prof. Dr. Caetano Traina Jr.
- PAE: Êrica Peters do Carmo
- Instituto de Ciências Matemáticas e de Computação - USP
