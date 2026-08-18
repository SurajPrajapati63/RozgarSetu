import { Modal } from './Modal'

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="mb-6 text-sm text-slate-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-outline">Cancel</button>
        <button onClick={onConfirm} className="btn-primary">Confirm</button>
      </div>
    </Modal>
  )
}
