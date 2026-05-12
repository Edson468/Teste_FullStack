from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional

DATABASE_URL = "sqlite:///./tasks.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TaskTable(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: bool
    class Config:
        from_attributes = True

app = FastAPI(title="API de Gerenciamento de Tarefas", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    """Provê uma sessão do banco de dados para as rotas e garante o fechamento após o uso."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", tags=["Root"])
def read_root():
    """Retorna uma mensagem de boas-vindas e indica o caminho da documentação."""
    return {"message": "API Online - Acesse /docs para a documentação"}

@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Recebe dados de uma nova tarefa, salva no banco de dados e retorna o registro criado."""
    new_task = TaskTable(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks", response_model=List[TaskResponse], tags=["Tasks"])
def list_tasks(db: Session = Depends(get_db)):
    """Consulta e retorna todas as tarefas cadastradas no banco de dados."""
    return db.query(TaskTable).all()

@app.get("/tasks/{task_id}", response_model=TaskResponse, tags=["Tasks"])
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Busca uma tarefa específica pelo ID e retorna seus detalhes ou erro 404."""
    task = db.query(TaskTable).filter(TaskTable.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@app.put("/tasks/{task_id}", response_model=TaskResponse, tags=["Tasks"])
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    """Atualiza os campos informados de uma tarefa existente com base no ID."""
    task_query = db.query(TaskTable).filter(TaskTable.id == task_id)
    task = task_query.first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    update_data = task_data.model_dump(exclude_unset=True)
    task_query.update(update_data)
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Remove permanentemente uma tarefa do banco de dados através do seu ID."""
    task = db.query(TaskTable).filter(TaskTable.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(task)
    db.commit()
    return None