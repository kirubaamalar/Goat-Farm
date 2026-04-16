import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { Table } from '../components/ui/Table'
import { useToast } from '../context/ToastContext'
import { goatApi, healthApi } from '../services/api'
import type { Goat, HealthRecord } from '../services/api'

type HealthForm = {
  goat_id: string
  issue: string
  medicine: string
  vaccination_date: string
  next_due_date: string
  notes: string
}

const initialForm: HealthForm = {
  goat_id: '',
  issue: '',
  medicine: '',
  vaccination_date: '',
  next_due_date: '',
  notes: '',
}

export const HealthPage = () => {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [dueAlerts, setDueAlerts] = useState<HealthRecord[]>([])
  const [goats, setGoats] = useState<Goat[]>([])
  const [form, setForm] = useState<HealthForm>(initialForm)
  const [editing, setEditing] = useState<HealthRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<HealthRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const goatMap = useMemo(
    () => Object.fromEntries(goats.map((goat) => [goat.id, goat.name])),
    [goats],
  )

  const loadData = async () => {
    setLoading(true)
    try {
      const [healthList, dueList, goatList] = await Promise.all([
        healthApi.list(),
        healthApi.due(),
        goatApi.list(),
      ])
      setRecords(healthList)
      setDueAlerts(dueList)
      setGoats(goatList)
    } catch {
      showToast('Failed to load health records', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditing(null)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.goat_id || !form.issue || !form.medicine || !form.vaccination_date || !form.next_due_date) {
      showToast('Please complete all required health fields', 'error')
      return
    }

    const payload = {
      goat_id: Number(form.goat_id),
      issue: form.issue,
      medicine: form.medicine,
      vaccination_date: form.vaccination_date,
      next_due_date: form.next_due_date,
      notes: form.notes,
    }

    setSaving(true)
    try {
      const response = editing
        ? await healthApi.update(editing.id, payload)
        : await healthApi.add(payload)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Health record saved', 'success')
      resetForm()
      await loadData()
    } catch {
      showToast('Failed to save health record', 'error')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (record: HealthRecord) => {
    setEditing(record)
    setForm({
      goat_id: String(record.goat_id),
      issue: record.issue,
      medicine: record.medicine,
      vaccination_date: record.vaccination_date,
      next_due_date: record.next_due_date,
      notes: record.notes ?? '',
    })
  }

  const deleteRecord = async () => {
    if (!deleteTarget) return
    setSaving(true)
    try {
      const response = await healthApi.delete(deleteTarget.id)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Health record deleted', 'success')
      setDeleteTarget(null)
      await loadData()
    } catch {
      showToast('Failed to delete health record', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Health Management</h1>
          <p className="text-sm text-gray-500">Track issues, medicines, vaccinations, and due reminders.</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          {dueAlerts.length} vaccination alerts
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Update Health Record' : 'Add Health Record'}</h2>
              {editing && (
                <Button variant="ghost" onClick={resetForm}>
                  Cancel edit
                </Button>
              )}
            </div>

            <form className="grid gap-4" onSubmit={submit}>
              <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                <span>Goat</span>
                <select
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  value={form.goat_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, goat_id: event.target.value }))}
                >
                  <option value="">Select goat</option>
                  {goats.map((goat) => (
                    <option key={goat.id} value={goat.id}>
                      {goat.goat_code} - {goat.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Issue"
                value={form.issue}
                onChange={(event) => setForm((prev) => ({ ...prev, issue: event.target.value }))}
                required
              />
              <Input
                label="Medicine"
                value={form.medicine}
                onChange={(event) => setForm((prev) => ({ ...prev, medicine: event.target.value }))}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Vaccination date"
                  type="date"
                  value={form.vaccination_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, vaccination_date: event.target.value }))}
                  required
                />
                <Input
                  label="Next due date"
                  type="date"
                  value={form.next_due_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, next_due_date: event.target.value }))}
                  required
                />
              </div>
              <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
                <span>Notes</span>
                <textarea
                  className="min-h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </label>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update Record' : 'Add Record'}
              </Button>
            </form>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Vaccination Due Alerts</h2>
            </div>
            <div className="space-y-3">
              {dueAlerts.length > 0 ? (
                dueAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20"
                  >
                    <p className="font-medium text-amber-800 dark:text-amber-300">
                      {goatMap[alert.goat_id] ?? `Goat #${alert.goat_id}`}
                    </p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                      {alert.issue} due on {alert.next_due_date}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No active vaccination alerts.</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          {loading ? (
            <Spinner label="Loading health records..." />
          ) : (
            <Table headers={['Goat', 'Issue', 'Medicine', 'Next Due', 'Actions']}>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {goatMap[record.goat_id] ?? `Goat #${record.goat_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{record.issue}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{record.medicine}</td>
                    <td className="px-4 py-3 text-amber-600 dark:text-amber-300">{record.next_due_date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => startEdit(record)}>
                          Edit
                        </Button>
                        <Button variant="secondary" onClick={() => setDeleteTarget(record)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No health records found.
                  </td>
                </tr>
              )}
            </Table>
          )}
        </Card>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Health Record"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button onClick={deleteRecord} disabled={saving}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Delete this health record for {deleteTarget ? goatMap[deleteTarget.goat_id] ?? `Goat #${deleteTarget.goat_id}` : ''}?
        </p>
      </Modal>
    </div>
  )
}

