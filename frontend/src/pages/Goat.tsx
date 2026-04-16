import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { Table } from '../components/ui/Table'
import { useToast } from '../context/ToastContext'
import { getAssetUrl, goatApi } from '../services/api'
import type { Goat } from '../services/api'

type GoatFormState = {
  name: string
  breed: string
  age: string
  weight: string
  gender: string
  status: string
  photo: File | null
}

const initialForm: GoatFormState = {
  name: '',
  breed: '',
  age: '',
  weight: '',
  gender: 'Female',
  status: 'Healthy',
  photo: null,
}

export const GoatPage = () => {
  const [goats, setGoats] = useState<Goat[]>([])
  const [form, setForm] = useState<GoatFormState>(initialForm)
  const [editing, setEditing] = useState<Goat | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Goat | null>(null)
  const { showToast } = useToast()

  const activeCount = useMemo(
    () => goats.filter((goat) => goat.status !== 'Sold').length,
    [goats],
  )

  const loadGoats = async () => {
    setLoading(true)
    try {
      const data = await goatApi.list()
      setGoats(data)
    } catch {
      showToast('Failed to load goats', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadGoats()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditing(null)
  }

  const validate = () => {
    if (!form.name || !form.breed || !form.age || !form.weight) {
      showToast('Please complete all required goat fields', 'error')
      return false
    }
    if (Number(form.age) < 0 || Number(form.weight) <= 0) {
      showToast('Age and weight must be valid numbers', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      if (editing) {
        const response = await goatApi.update(editing.id, {
          name: form.name,
          breed: form.breed,
          age: Number(form.age),
          weight: Number(form.weight),
          gender: form.gender,
          status: form.status,
        })
        if (response.error) throw new Error(response.error)
        showToast(response.message ?? 'Goat updated', 'success')
      } else {
        const payload = new FormData()
        payload.append('name', form.name)
        payload.append('breed', form.breed)
        payload.append('age', form.age)
        payload.append('weight', form.weight)
        payload.append('gender', form.gender)
        payload.append('status', form.status)
        if (form.photo) payload.append('photo', form.photo)

        const response = await goatApi.add(payload)
        if (response.error) throw new Error(response.error)
        showToast(response.message ?? 'Goat added', 'success')
      }

      resetForm()
      await loadGoats()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save goat', 'error')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (goat: Goat) => {
    setEditing(goat)
    setForm({
      name: goat.name,
      breed: goat.breed,
      age: String(goat.age),
      weight: String(goat.weight),
      gender: goat.gender,
      status: goat.status,
      photo: null,
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    try {
      const response = await goatApi.delete(deleteTarget.id)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Goat deleted', 'success')
      setDeleteTarget(null)
      await loadGoats()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete goat', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Goat Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage goat profiles, status, and photo records.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {goats.length} total records, {activeCount} active goats
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Goat' : 'Add Goat'}</h2>
            {editing && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel edit
              </Button>
            )}
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              label="Breed"
              value={form.breed}
              onChange={(event) => setForm((prev) => ({ ...prev, breed: event.target.value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Age"
                type="number"
                min="0"
                value={form.age}
                onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
                required
              />
              <Input
                label="Weight"
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
                required
              />
            </div>

            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
              <span>Gender</span>
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                value={form.gender}
                onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
              <span>Status</span>
              <select
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option>Healthy</option>
                <option>Sick</option>
                <option>Pregnant</option>
                <option>Sold</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
              <span>Photo upload</span>
              <input
                type="file"
                accept="image/*"
                className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm dark:border-gray-700"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    photo: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </label>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Goat' : 'Add Goat'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Goat List</h2>
          </div>

          {loading ? (
            <Spinner label="Loading goats..." />
          ) : (
            <Table headers={['Goat', 'Profile', 'Status', 'Photo', 'Actions']}>
              {goats.length > 0 ? (
                goats.map((goat) => (
                  <tr key={goat.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{goat.name}</div>
                      <div className="text-xs text-gray-500">{goat.goat_code}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {goat.breed}, {goat.age} yrs, {goat.weight} kg
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {goat.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {goat.photo_url ? (
                        <img
                          src={getAssetUrl(goat.photo_url)}
                          alt={goat.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => startEdit(goat)}>
                          Edit
                        </Button>
                        <Button variant="secondary" onClick={() => setDeleteTarget(goat)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No goats found.
                  </td>
                </tr>
              )}
            </Table>
          )}
        </Card>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Goat"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={saving}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Delete <span className="font-semibold">{deleteTarget?.name}</span>? This action will hide the record from active lists.
        </p>
      </Modal>
    </div>
  )
}

