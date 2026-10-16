import { useState } from "react";

function formatDue(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString();
}

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  });
  const [busy, setBusy] = useState(false);

  async function save(patch) {
    setBusy(true);
    try {
      await onUpdate(task._id, patch);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function toggleDone() {
    await save({ status: task.status === "done" ? "todo" : "done" });
  }

  if (editing) {
    return (
      <article className="task">
        <span />
        <form
          className="edit-grid"
          onSubmit={(e) => {
            e.preventDefault();
            save({
              title: draft.title.trim(),
              description: draft.description.trim(),
              status: draft.status,
              priority: draft.priority,
              dueDate: draft.dueDate || null,
            });
          }}
        >
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            required
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <div className="row">
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
            />
            <button className="primary" disabled={busy} type="submit">
              Save
            </button>
          </div>
        </form>
        <div className="actions">
          <button className="ghost" type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`task ${task.status === "done" ? "done" : ""}`}>
      <input
        className="check"
        type="checkbox"
        checked={task.status === "done"}
        onChange={toggleDone}
        aria-label={`Mark ${task.title} done`}
      />
      <div>
        <p className="title">{task.title}</p>
        {task.description ? <p className="desc">{task.description}</p> : null}
        <div className="meta">
          <span className={`chip ${task.status}`}>{task.status.replace("_", " ")}</span>
          <span className={`chip ${task.priority}`}>{task.priority} priority</span>
          {task.dueDate && <span className="chip">due {formatDue(task.dueDate)}</span>}
        </div>
      </div>
      <div className="actions">
        {task.status === "todo" && (
          <button
            className="ghost"
            type="button"
            onClick={() => save({ status: "in_progress" })}
          >
            Start
          </button>
        )}
        <button className="ghost" type="button" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          className="icon-btn"
          type="button"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
    </article>
  );
}
