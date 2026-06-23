const UserDetails = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  return (
    <div className="mt-6 rounded-xl bg-[var(--surface)] p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">User Details</h2>
        <button onClick={onClose} className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <p><span className="font-semibold">Name:</span> {user.firstName} {user.lastName}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        <p><span className="font-semibold">School:</span> {user.school}</p>
        <p><span className="font-semibold">Status:</span> {user.status}</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={() => onEdit(user)} className="rounded-lg bg-[var(--btn-primary)] px-4 py-2 text-sm font-semibold text-white">
          Edit
        </button>
        <button onClick={() => onDelete(user)} className="rounded-lg bg-[var(--error)] px-4 py-2 text-sm font-semibold text-white">
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserDetails;