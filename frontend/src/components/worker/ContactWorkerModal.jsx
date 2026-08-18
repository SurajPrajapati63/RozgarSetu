import { Modal } from '../common/Modal'

export function ContactWorkerModal({ open, onClose, worker }) {
  return (
    <Modal open={open} onClose={onClose} title={`Contact ${worker?.name || 'worker'}`}>
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Reach out directly using the details below.</p>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Phone</div>
          <div>+91 98765 43210</div>
          <div className="mt-3 font-semibold text-slate-900">WhatsApp</div>
          <div>+91 98765 43210</div>
        </div>
      </div>
    </Modal>
  )
}
