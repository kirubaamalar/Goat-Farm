import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Spinner } from '../components/ui/Spinner'
import { Table } from '../components/ui/Table'
import { useToast } from '../context/ToastContext'
import { goatApi, salesApi } from '../services/api'
import type { Goat, SalesRecord } from '../services/api'

type SalesForm = {
  goat_id: string
  price: string
  buyer_name: string
  date: string
  notes: string
}

const initialForm: SalesForm = {
  goat_id: '',
  price: '',
  buyer_name: '',
  date: '',
  notes: '',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const SalesPage = () => {
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [goats, setGoats] = useState<Goat[]>([])
  const [form, setForm] = useState<SalesForm>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const goatMap = useMemo(
    () => Object.fromEntries(goats.map((goat) => [goat.id, goat.name])),
    [goats],
  )

  const totalSales = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.price), 0),
    [sales],
  )

  const loadData = async () => {
    setLoading(true)
    try {
      const [salesList, goatList] = await Promise.all([salesApi.list(), goatApi.list()])
      setSales(salesList)
      setGoats(goatList)
    } catch {
      showToast('Failed to load sales data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.goat_id || !form.price || !form.buyer_name || !form.date) {
      showToast('Please complete all required sale fields', 'error')
      return
    }
    if (Number(form.price) <= 0) {
      showToast('Sale price must be greater than zero', 'error')
      return
    }

    setSaving(true)
    try {
      const response = await salesApi.add({
        goat_id: Number(form.goat_id),
        price: Number(form.price),
        buyer_name: form.buyer_name,
        date: form.date,
        notes: form.notes,
      })
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Sale recorded', 'success')
      setForm(initialForm)
      await loadData()
    } catch {
      showToast('Failed to save sale', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sales Management</h1>
          <p className="text-sm text-gray-500">Record goat sales and buyer details.</p>
        </div>
        <div className="text-sm text-gray-500">
          Total revenue: <span className="font-semibold text-emerald-600">{currency.format(totalSales)}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Add Sale</h2>
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
              label="Buyer name"
              value={form.buyer_name}
              onChange={(event) => setForm((prev) => ({ ...prev, buyer_name: event.target.value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Sale price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                required
              />
              <Input
                label="Sale date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
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
              {saving ? 'Saving...' : 'Record Sale'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          {loading ? (
            <Spinner label="Loading sales..." />
          ) : (
            <Table headers={['Goat', 'Buyer', 'Price', 'Date', 'Notes']}>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {goatMap[sale.goat_id] ?? `Goat #${sale.goat_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{sale.buyer_name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{currency.format(sale.price)}</td>
                    <td className="px-4 py-3 text-gray-500">{sale.date}</td>
                    <td className="px-4 py-3 text-gray-500">{sale.notes || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No sales found.
                  </td>
                </tr>
              )}
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
}

