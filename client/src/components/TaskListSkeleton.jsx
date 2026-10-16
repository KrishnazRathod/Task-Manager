export default function TaskListSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-list" aria-label="Loading tasks" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-shimmer skeleton-circle" />
          <div className="skeleton-body">
            <div
              className="skeleton-shimmer skeleton-line skeleton-title"
              style={{ width: i % 2 === 0 ? "55%" : "70%" }}
            />
            <div
              className="skeleton-shimmer skeleton-line skeleton-desc"
              style={{ width: i % 2 === 0 ? "85%" : "65%" }}
            />
            <div className="skeleton-chips">
              <div className="skeleton-shimmer skeleton-chip" />
              <div className="skeleton-shimmer skeleton-chip" style={{ width: "80px" }} />
              {i % 2 === 0 && <div className="skeleton-shimmer skeleton-chip" style={{ width: "95px" }} />}
            </div>
          </div>
          <div className="skeleton-actions">
            <div className="skeleton-shimmer skeleton-btn" />
            <div className="skeleton-shimmer skeleton-btn-icon" />
          </div>
        </div>
      ))}
    </div>
  );
}
