# Desafio Fullstack - Gerenciador de Tarefas

Projeto desenvolvido para teste técnico, utilizando Python (FastAPI) no backend e React no frontend.

## 🚀 Tecnologias
- **Backend:** Python 3, FastAPI, SQLAlchemy, SQLite.
- **Frontend:** React, Vite, Tailwind CSS, Axios.
- **Testes:** Pytest.

## 🛠️ Como rodar o projeto

### Backend
1. Entre na pasta `backend`: `cd backend`
2. Ative o ambiente virtual: `.\venv\Scripts\activate`
3. Instale as dependências: `pip install -r requirements.txt` (ou instale manualmente: fastapi, uvicorn, sqlalchemy)
4. Rode o servidor: `uvicorn main:app --reload`
5. Acesse a documentação em: `http://127.0.0.1:8000/docs`

### Frontend
1. Entre na pasta `frontend`: `cd frontend`
2. Instale as dependências: `npm install`
3. Rode o projeto: `npm run dev`

### Testes
1. Na pasta `backend`, rode: `pytest`