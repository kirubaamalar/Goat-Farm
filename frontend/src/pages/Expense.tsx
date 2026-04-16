import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { Table } from '../components/ui/Table'
import { useToast } from '../context/ToastContext'
import { expenseApi } from '../services/api'
import type { ExpenseRecord } from '../services/api'

type ExpenseForm = {
  expense_type: string
  amount: string
  date: string
  notes: string
}

const initialForm: ExpenseForm = {
  expense_type: '',
  amount: '',
  date: '',
  notes: '',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const ExpensePage = () => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [form, setForm] = useState<ExpenseForm>(initialForm)
  const [editing, setEditing] = useState<ExpenseRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExpenseRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const totalExpense = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses],
  )

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const data = await expenseApi.list()
      setExpenses(data)
    } catch {
      showToast('Failed to load expenses', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExpenses()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditing(null)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.expense_type || !form.amount || !form.date) {
      showToast('Please complete all required expense fields', 'error')
      return
    }
    if (Number(form.amount) <= 0) {
      showToast('Expense amount must be greater than zero', 'error')
      return
    }

    const payload = {
      expense_type: form.expense_type,
      amount: Number(form.amount),
      date: form.date,
      notes: form.notes,
    }

    setSaving(true)
    try {
      const response = editing
        ? await expenseApi.update(editing.id, payload)
        : await expenseApi.add(payload)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Expense saved', 'success')
      resetForm()
      await loadExpenses()
    } catch {
      showToast('Failed to save expense', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteRecord = async () => {
    if (!deleteTarget) return
    setSaving(true)
    try {
      const response = await expenseApi.delete(deleteTarget.id)
      if (response.error) throw new Error(response.error)
      showToast(response.message ?? 'Expense deleted', 'success')
      setDeleteTarget(null)
      await loadExpenses()
    } catch {
      showToast('Failed to delete expense', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense Management</h1>
          <p className="text-sm text-gray-500">Track farm spending and expense categories.</p>
        </div>
        <div className="text-sm text-gray-500">
          Total expense: <span className="font-semibold text-rose-600">{currency.format(totalExpense)}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editing ? 'Update Expense' : 'Add Expense'}</h2>
            {editing && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel edit
              </Button>
            )}
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <Input
              label="Expense type"
              value={form.expense_type}
              onChange={(event) => setForm((prev) => ({ ...prev, expense_type: event.target.value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                required
              />
              <Input
                label="Date"
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
              {saving ? 'Saving...' : editing ? 'Update Expense' : 'Add Expense'}
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          {loading ? (
            <Spinner label="Loading expenses..." />
          ) : (
            <Table headers={['Type', 'Amount', 'Date', 'Notes', 'Actions']}>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{expense.expense_type}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{currency.format(expense.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">{expense.date}</td>
                    <td className="px-4 py-3 text-gray-500">{expense.notes || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditing(expense)
                            setForm({
                              expense_type: expense.expense_type,
                              amount: String(expense.amount),
                              date: expense.date,
                              notes: expense.notes ?? '',
                            })
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="secondary" onClick={() => setDeleteTarget(expense)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              )}
            </Table>
          )}
        </Card>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Expense"
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
          Delete the <span className="font-semibold">{deleteTarget?.expense_type}</span> expense?
        </p>
      </Modal>
    </div>
  )
}

