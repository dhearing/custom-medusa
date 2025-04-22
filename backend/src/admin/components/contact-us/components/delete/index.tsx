import { Button } from "@medusajs/ui"

interface DeleteConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmation = ({ onConfirm, onCancel }: DeleteConfirmationProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-zinc-700 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-bold mb-4 text-white">Confirm Delete</h3>
      <p className="mb-6 text-white">
        Are you sure you want to delete this contact form submission? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-x-2">
        <Button
          variant="secondary"
          className="bg-zinc-800 hover:bg-zinc-900"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="bg-red-800 hover:bg-red-900"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
)

export default DeleteConfirmation 