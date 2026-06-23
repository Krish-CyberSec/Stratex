const DeleteUserModal = ({ user, onClose, onDelete }) => {
  if (!user) return null;

  const handleDelete = () => {
  onDelete(user._id);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Delete User</h2>

        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Delete {user.firstName} {user.lastName}?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2 font-semibold">
            Cancel
          </button>
          <button onClick={handleDelete} className="rounded-lg bg-[var(--error)] px-4 py-2 font-semibold text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;