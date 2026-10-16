import { useCallback, useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask } from "./api.js";
import TaskForm from "./components/TaskForm.jsx";
import TaskCard from "./components/TaskCard.jsx";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchTasks({
        status: filter === "all" ? "" : filter,
        q: query.trim(),
      });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    const t = setTimeout(load, query ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, query]);

  const counts = useMemo(() => {
    const all = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const open = all - done;
    return { all, done, open };
  }, [tasks]);

  async function handleCreate(payload) {
    const created = await createTask(payload);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleUpdate(id, payload) {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>Task Manager</h1>
          <p className="lede">
            A small task manager: create work, move it through
            status, and keep the list.
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <b>{counts.all}</b>
            <span>on this view</span>
          </div>
          <div className="stat">
            <b>{counts.open}</b>
            <span>still open</span>
          </div>
          <div className="stat">
            <b>{counts.done}</b>
            <span>finished</span>
          </div>
        </div>
      </header>

      <section className="panel">
        <TaskForm onCreate={handleCreate} />
      </section>

      <div className="toolbar">
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? "active" : ""}
              onClick={() => setFilter(f.id)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or notes"
        />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Loading tasks…</p>}
      {!loading && !error && tasks.length === 0 && (
        <p className="empty">No tasks here yet. Add one above.</p>
      )}

      <div className="list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
