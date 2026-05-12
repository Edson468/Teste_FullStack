import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_task():
    """Verifica se o endpoint de criação salva uma nova tarefa e retorna os dados corretos."""
    response = client.post(
        "/tasks",
        json={"title": "Tarefa de Teste", "description": "Descrição do teste automatizado"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Tarefa de Teste"
    assert "id" in data

def test_read_tasks_list():
    """Verifica se o endpoint de listagem retorna uma lista de tarefas."""
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_specific_task():
    """Verifica se é possível recuperar uma tarefa específica através do seu ID."""
    post_res = client.post("/tasks", json={"title": "Buscar por ID"})
    task_id = post_res.json()["id"]
    
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Buscar por ID"

def test_update_task_status():
    """Verifica se o endpoint de atualização modifica corretamente o status de uma tarefa."""
    post_res = client.post("/tasks", json={"title": "Tarefa para Atualizar"})
    task_id = post_res.json()["id"]
    
    response = client.put(f"/tasks/{task_id}", json={"status": True})
    assert response.status_code == 200
    assert response.json()["status"] is True

def test_delete_task():
    """Verifica se o endpoint de remoção deleta a tarefa e se ela deixa de existir no sistema."""
    post_res = client.post("/tasks", json={"title": "Tarefa para Deletar"})
    task_id = post_res.json()["id"]
    
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 204
    
    get_res = client.get(f"/tasks/{task_id}")
    assert get_res.status_code == 404