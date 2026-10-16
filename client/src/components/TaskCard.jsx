import { useState } from "react";
import Spinner from "./Spinner.jsx";

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
  const [busyAction, setBusyAction] = useState(null); // 'save' | 'start' | 'delete' | 'toggle' | null
  const [actionError, setActionError] = useState("");

  const isBusy = busyAction !== null;

  async function save(patch, actionType = "save") {
    setBusyAction(actionType);
    setActionError("");
    try {
      await onUpdate(task._id, patch);
      if (actionType === "save") {
        setEditing(false);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update task");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDelete() {
    setBusyAction("delete");
    setActionError("");
    try {
      await onDelete(task._id);
    } catch (err) {
      setActionError(err.message || "Failed to delete task");
      setBusyAction(null);
    }
  }

  async function toggleDone() {
    await save({ status: task.status === "done" ? "todo" : "done" }, "toggle");
  }

  if (editing) {
    return (
      <article className={`task task-editing ${isBusy ? "task-busy" : ""}`}>
        <span />
        <form
          className="edit-grid"
          onSubmit={(e) => {
            e.preventDefault();
            save(
              {
                title: draft.title.trim(),
                description: draft.description.trim(),
                status: draft.status,
                priority: draft.priority,
                dueDate: draft.dueDate || null,
              },
              "save"
            );
          }}
        >
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            disabled={isBusy}
            required
            autoFocus
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            disabled={isBusy}
          />
          <div className="row">
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              disabled={isBusy}
            >
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              disabled={isBusy}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              disabled={isBusy}
            />
            <button className="primary" disabled={isBusy} type="submit">
              {busyAction === "save" ? (
                <>
                  <Spinner size={14} />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
          {actionError && <p className="error error-compact">{actionError}</p>}
        </form>
        <div className="actions">
          <button
            className="ghost"
            type="button"
            disabled={isBusy}
            onClick={() => {
              setEditing(false);
              setActionError("");
              setDraft({
                title: task.title,
                description: task.description || "",
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
              });
            }}
          >
            Cancel
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`task ${task.status === "done" ? "done" : ""} ${
        busyAction === "delete" ? "task-deleting" : ""
      } ${isBusy ? "task-busy" : ""}`}
    >
      <div className="check-wrapper">
        <input
          className="check"
          type="checkbox"
          checked={task.status === "done"}
          disabled={isBusy}
          onChange={toggleDone}
          aria-label={`Mark ${task.title} done`}
        />
        {busyAction === "toggle" && <Spinner size={12} className="check-spinner" />}
      </div>
      <div>
        <p className="title">{task.title}</p>
        {task.description ? <p className="desc">{task.description}</p> : null}
        <div className="meta">
          <span className={`chip ${task.status}`}>{task.status.replace("_", " ")}</span>
          <span className={`chip ${task.priority}`}>{task.priority} priority</span>
          {task.dueDate && <span className="chip">due {formatDue(task.dueDate)}</span>}
        </div>
        {actionError && <p className="error error-compact">{actionError}</p>}
      </div>
      <div className="actions">
        {task.status === "todo" && (
          <button
            className="ghost start-btn"
            type="button"
            disabled={isBusy}
            onClick={() => save({ status: "in_progress" }, "start")}
          >
            {busyAction === "start" ? (
              <>
                <Spinner size={13} />
                <span>Starting…</span>
              </>
            ) : (
              <span>Start</span>
            )}
          </button>
        )}
        <button
          className="ghost edit-btn"
          type="button"
          disabled={isBusy}
          onClick={() => {
            setEditing(true);
            setActionError("");
          }}
        >
          Edit
        </button>
        <button
          className="icon-btn delete-btn"
          type="button"
          disabled={isBusy}
          onClick={handleDelete}
          aria-label="Delete task"
          title="Delete task"
        >
          {busyAction === "delete" ? <Spinner size={14} /> : "×"}
        </button>
      </div>
    </article>
  );
}
