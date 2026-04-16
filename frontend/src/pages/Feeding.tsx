import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { Table } from '../components/ui/Table'
import { useToast } from '../context/ToastContext'
import { feedingApi, goatApi } from '../services/api'
import type { FeedingRecord, Goat } from '../services/api'

type FeedingForm = {
  goat_id: string
  food_type: string
  quantity: string
  feeding_date: string
  notes: string
}

const initialForm: FeedingForm = {
  goat_id: '',
  food_type: '',
  quantity: '',
  feeding_date: '',
  notes: '',
}

export const FeedingPage = () => {
  const [records, setRecords] = useState<FeedingRecord[]>([])
  const [goats, setGoats] = useState<Goat[]>([])
  const [form, setForm] = useState<FeedingForm>(initialForm)
  const [editing, setEditing] = useState<FeedingRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FeedingRecord | null>(null)
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
      const [feeding, goatList] = await Promise.all([feedingApi.list(), goatApi.list()])
      setRecords(feeding)
      setGoats(goatList)
    } catch {
      showToast('Failed to load feeding records', 'error')
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

  const validate = () => {
    if (!form.goat_id || !form.food_type || !form.quantity || !form.feeding_date) {
      showToast('Please complete all required feeding fields', 'error')
      return false
    }
    if (Number(form.quantity) <= 0) {
      showToast('Quantity must be greater than zero', 'error')
      return false
    }
    return true
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    const payload = {
      goat_id: Number(form.goat_id),
      food_type: form.food_type,
      quantity: Number(form.quantity),
      feeding_date: form.feeding_date,
      notes: form.notes,
    }

    setSaving(true)
    try {
      const response = editing
        ? await feedingApi.update(editing.id, payload)
        : await feedingApi.add(payload)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Feeding saved', 'success')
      resetForm()
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save feeding record', 'error')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (record: FeedingRecord) => {
    setEditing(record)
    setForm({
      goat_id: String(record.goat_id),
      food_type: record.food_type,
      quantity: String(record.quantity),
      feeding_date: record.feeding_date,
      notes: record.notes ?? '',
    })
  }

  const deleteRecord = async () => {
    if (!deleteTarget) return
    setSaving(true)
    try {
      const response = await feedingApi.delete(deleteTarget.id)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Feeding deleted', 'success')
      setDeleteTarget(null)
      await loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete feeding record', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feeding Management</h1>
        <p className="text-sm text-gray-500">Track feed type, quantity, and schedule by goat.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? 'Update Feeding' : 'Add Feeding'}</h2>
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
              label="Food type"
              value={form.food_type}
              onChange={(event) => setForm((prev) => ({ ...prev, food_type: event.target.value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Quantity"
                type="number"
                min="0"
                step="0.1"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                required
              />
              <Input
                label="Feeding date"
                type="date"
                value={form.feeding_date}
                onChange={(event) => setForm((prev) => ({ ...prev, feeding_date: event.target.value }))}
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
          {loading ? (
            <Spinner label="Loading feeding records..." />
          ) : (
            <Table headers={['Goat', 'Food Type', 'Quantity', 'Date', 'Actions']}>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {goatMap[record.goat_id] ?? `Goat #${record.goat_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{record.food_type}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{record.quantity}</td>
                    <td className="px-4 py-3 text-gray-500">{record.feeding_date}</td>
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
                    No feeding records found.
                  </td>
                </tr>
              )}
            </Table>
          )}
        </Card>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Feeding Record"
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
          Delete this feeding record for goat {deleteTarget ? goatMap[deleteTarget.goat_id] ?? deleteTarget.goat_id : ''}?
        </p>
      </Modal>
    </div>
  )
}

