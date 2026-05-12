import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus, Edit3, X, Save, Filter } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000/tasks";

/**
 * Componente principal que gerencia o estado das tarefas, filtros e a interface geral da aplicação.
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, []);

  /**
   * Obtém a lista atualizada de tarefas através de uma requisição GET para a API.
   */
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) { console.error("Erro ao buscar:", error); }
  };

  /**
   * Realiza o envio de uma nova tarefa para o backend e limpa os campos do formulário após o sucesso.
   */
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, description });
      setTitle(''); setDescription(''); fetchTasks();
    } catch (error) { console.error("Erro ao adicionar:", error); }
  };

  /**
   * Atualiza o status de conclusão de uma tarefa específica no servidor.
   */
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: !currentStatus });
      fetchTasks();
    } catch (error) { console.error("Erro ao atualizar status:", error); }
  };

  /**
   * Remove permanentemente uma tarefa do sistema enviando uma solicitação DELETE para a API.
   */
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) { console.error("Erro ao deletar:", error); }
  };

  /**
   * Inicia o modo de edição para uma tarefa, preenchendo os estados auxiliares com os dados atuais.
   */
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  /**
   * Persiste as alterações feitas no título ou na descrição de uma tarefa no banco de dados.
   */
  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, { title: editTitle, description: editDescription });
      setEditingId(null);
      fetchTasks();
    } catch (error) { console.error("Erro ao salvar edição:", error); }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.status;
    if (filter === 'completed') return task.status;
    return true; 
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center uppercase tracking-wider">
          Gerenciador de Tarefas
        </h1>
        
        <form onSubmit={addTask} className="bg-white p-6 rounded-lg shadow-md mb-6 border-t-4 border-blue-500">
          <div className="flex flex-col gap-4">
            <input 
              type="text" placeholder="Título da tarefa" 
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
            <input 
              type="text" placeholder="Descrição (opcional)" 
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition font-bold">
              <Plus size={20} /> ADICIONAR TAREFA
            </button>
          </div>
        </form>

        <div className="flex justify-center items-center gap-2 mb-8 bg-white p-2 rounded-full shadow-sm">
          <Filter size={16} className="text-gray-400 ml-2" />
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'completed', label: 'Concluídas' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === f.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 border-transparent hover:border-blue-400 transition group">
              <div className="flex items-center gap-4 flex-1">
                <button onClick={() => toggleStatus(task.id, task.status)}>
                  {task.status ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-300" />}
                </button>
                
                {editingId === task.id ? (
                  <div className="flex flex-col gap-2 w-full mr-4">
                    <input 
                      className="border p-1 rounded text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                      value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input 
                      className="border p-1 rounded text-xs focus:ring-1 focus:ring-blue-400 outline-none"
                      value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className={`font-semibold ${task.status ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editingId === task.id ? (
                  <>
                    <button onClick={() => saveEdit(task.id)} className="text-green-600 hover:bg-green-50 p-1 rounded transition">
                      <Save size={20} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-50 p-1 rounded transition">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(task)} className="text-blue-400 hover:text-blue-600 p-1 transition">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600 p-1 transition">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow-inner border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">Nenhuma tarefa encontrada neste filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;