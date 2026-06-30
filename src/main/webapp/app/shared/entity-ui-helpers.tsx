import React from 'react';

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  // Generic positive/active
  ACTIVE: { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  AVAILABLE: { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  APPROVED: { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  OPEN: { bg: '#dcfce7', text: '#166534', dot: '#16a34a' },
  COMPLETED: { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb' },
  DELIVERED: { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb' },
  SHIPPED: { bg: '#e0e7ff', text: '#3730a3', dot: '#4f46e5' },
  PAID: { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb' },
  // Warning / pending
  PENDING: { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
  WAITING: { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
  PROCESSING: { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
  REVIEWING: { bg: '#fef9c3', text: '#854d0e', dot: '#ca8a04' },
  // Danger / inactive
  INACTIVE: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  BANNED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  CLOSED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  DELETED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  EXPIRED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  FAILED: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
  // Neutral / info
  DRAFT: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' },
  HIDDEN: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' },
  SOLD: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' },
  TRADED: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' },
};

const DEFAULT_COLOR = { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };

interface StatusBadgeProps {
  status?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return <span style={{ color: '#9ca3af' }}>—</span>;
  const key = status.toUpperCase().trim();
  const color = STATUS_COLORS[key] ?? DEFAULT_COLOR;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        backgroundColor: color.bg,
        color: color.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
};

// ─── Image Cell ──────────────────────────────────────────────────────────────

interface ImageCellProps {
  src?: string | null;
  alt?: string;
  size?: number;
}

export const ImageCell: React.FC<ImageCellProps> = ({ src, alt = 'image', size = 40 }) => {
  const [error, setError] = React.useState(false);

  if (!src) return <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>;

  if (error) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '6px',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          fontSize: '18px',
        }}
        title={src}
      >
        🖼️
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
      }}
      title={src}
    />
  );
};

// ─── Icon Cell ───────────────────────────────────────────────────────────────

interface IconCellProps {
  src?: string | null;
  alt?: string;
}

export const IconCell: React.FC<IconCellProps> = ({ src, alt = 'icon' }) => {
  const [error, setError] = React.useState(false);

  if (!src) return <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>;

  // If it looks like an emoji or short text (<=4 chars), render as text
  if (src.length <= 4 && !/^https?:\/\//.test(src)) {
    return (
      <span style={{ fontSize: '22px' }} title={src}>
        {src}
      </span>
    );
  }

  if (error) {
    return (
      <span style={{ fontSize: '20px' }} title={src}>
        🏷️
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        width: 28,
        height: 28,
        objectFit: 'contain',
        borderRadius: '4px',
      }}
      title={src}
    />
  );
};

// ─── Truncated Text ──────────────────────────────────────────────────────────

interface TruncatedTextProps {
  text?: string | null;
  maxLength?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength = 60 }) => {
  if (!text) return <span style={{ color: '#9ca3af' }}>—</span>;
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <span title={text} style={{ cursor: 'help' }}>
      {text.slice(0, maxLength)}…
    </span>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  show: boolean;
  entityName: string;
  entityId?: number | string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ show, entityName, entityId, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Overlay */}
      <div
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
        }}
      />
      {/* Dialog */}
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '12px',
          padding: '28px 32px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          zIndex: 1,
          animation: 'entityModalIn 0.18s ease',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 26,
          }}
        >
          🗑️
        </div>
        <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#111827' }}>Confirm Delete</h3>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{entityName}</strong>
          {entityId ? ` #${entityId}` : ''}? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
