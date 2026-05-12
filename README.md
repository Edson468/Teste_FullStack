# 🚀 Task Manager - Fullstack Challenge

Este projeto é uma aplicação completa de gerenciamento de tarefas (To-Do List), desenvolvida para demonstrar competências em desenvolvimento Fullstack. A solução conta com um backend robusto em Python, uma interface moderna e responsiva em React e uma suite de testes automatizados.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.12+**
- **FastAPI**: Framework web de alta performance.
- **SQLAlchemy**: ORM para persistência de dados.
- **SQLite**: Banco de dados relacional leve.
- **Pytest**: Framework para testes automatizados.
- **Pydantic**: Validação de dados e tipos.

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**: Estilização baseada em utilitários.
- **Lucide React**: Biblioteca de ícones.
- **Axios**: Cliente HTTP para consumo da API.

---

## ✨ Funcionalidades

- **CRUD Completo**: Criar, visualizar, editar e excluir tarefas.
- **Gestão de Status**: Marcar tarefas como concluídas ou pendentes com um clique.
- **Filtros Dinâmicos**: Filtrar visualização por "Todas", "Pendentes" ou "Concluídas".
- **Persistência de Dados**: Todas as tarefas são salvas em banco de dados SQLite.
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela.

---

## 🏗️ Estrutura do Projeto


desafio_fullstack/
├── backend/            # API FastAPI, Banco de Dados e Testes
│   ├── main.py
│   ├── test_main.py
│   ├── requirements.txt
│   └── tasks.db
└── frontend/           # Aplicação React + Tailwind
    ├── src/
    ├── tailwind.config.js
    └── package.json
🚀 Como Executar o Projeto
1. Backend
Navegue até a pasta do backend e configure o ambiente:

Bash
cd backend
# Criar e ativar ambiente virtual
python -m venv venv
.\venv\Scripts\activate  # No Windows
source venv/bin/activate # No Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor
uvicorn main:app --reload
A API estará disponível em http://127.0.0.1:8000. Acesse /docs para a documentação interativa (Swagger).

2. Frontend
Em um novo terminal, navegue até a pasta do frontend:

Bash
cd frontend
npm install
npm run dev
Acesse http://localhost:5173 no seu navegador.

🧪 Executando os Testes
Para garantir a integridade da API, rode os testes unitários:

Bash
cd backend
.\venv\Scripts\python.exe -m pytest
## ✒️ Autor

**Edson Carvalho** - *Desenvolvedor em Transição de Carreira | Estudante de ADS*
- [LinkedIn](https://www.linkedin.com/in/edson-carvalho-213b051b1/)
- [GitHub](https://github.com/Edson468)
