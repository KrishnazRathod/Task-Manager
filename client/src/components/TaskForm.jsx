import { useState } from "react";

const empty = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
        status: "todo",
      });
      setForm(empty);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <input
        value={form.title}
        onChange={(e) => setField("title", e.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        autoFocus
      />
      <textarea
        value={form.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Notes (optional)"
        maxLength={2000}
      />
      <div className="row">
        <select
          value={form.priority}
          onChange={(e) => setField("priority", e.target.value)}
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setField("dueDate", e.target.value)}
        />
        <span />
        <button className="primary" type="submit" disabled={saving}>
          {saving ? "Adding…" : "Add task"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
