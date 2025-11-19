interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ show, onClose, onConfirm }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[380px]">

        <h2 className="text-xl font-bold text-red-600 mb-4">Delete Patient?</h2>
        <p className="text-gray-700 mb-6">This action cannot be undone.</p>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
