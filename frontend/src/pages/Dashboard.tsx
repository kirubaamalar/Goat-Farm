import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Spinner } from '../components/ui/Spinner'
import { dashboardApi, expenseApi, healthApi } from '../services/api'
import type { DashboardPayload, ExpenseRecord, HealthRecord } from '../services/api'
import { useToast } from '../context/ToastContext'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const Dashboard = () => {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [dueAlerts, setDueAlerts] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [dashboard, expenseList, dueList] = await Promise.all([
          dashboardApi.get(),
          expenseApi.list(),
          healthApi.due(),
        ])
        setData(dashboard)
        setExpenses(expenseList)
        setDueAlerts(dueList)
      } catch {
        showToast('Failed to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [showToast])

  const expenseBreakdown = useMemo(() => {
    if (!data) return []
    const entries = Object.entries(data.finance.expense_breakdown)
    const max = Math.max(...entries.map(([, value]) => value), 1)
    return entries.map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / max) * 100),
    }))
  }, [data])

  if (loading) {
    return <Spinner fullPage label="Loading dashboard..." />
  }

  if (!data) {
    return (
      <Card>
        <p className="text-sm text-gray-500">No dashboard data available.</p>
      </Card>
    )
  }

  const summary = [
    { label: 'Total Goats', value: data.goats.total.toString() },
    { label: 'Healthy', value: data.goats.healthy.toString() },
    { label: 'Sick', value: data.goats.sick.toString() },
    { label: 'Profit', value: currency.format(data.finance.profit) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Live farm insights across goats, finances, and health records.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Vaccination due: <span className="font-semibold text-amber-600">{dueAlerts.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-gray-50">
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Expense Breakdown
            </h2>
            <span className="text-sm text-gray-500">Chart-ready summary</span>
          </div>
          {expenseBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No expense data yet.</p>
          ) : (
            <div className="space-y-3">
              {expenseBreakdown.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {item.name}
                    </span>
                    <span className="text-gray-500">
                      {currency.format(item.value)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Finance Snapshot
          </h2>
          <div className="grid gap-3">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="text-xs uppercase text-gray-500">Total sales</p>
              <p className="mt-2 text-xl font-semibold">{currency.format(data.finance.total_sales)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="text-xs uppercase text-gray-500">Total expenses</p>
              <p className="mt-2 text-xl font-semibold">{currency.format(data.finance.total_expense)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="text-xs uppercase text-gray-500">Average sale price</p>
              <p className="mt-2 text-xl font-semibold">{currency.format(data.sales.average_sale_price)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Recent Sales
            </h2>
            <span className="text-sm text-gray-500">{data.sales.total_sales_count} total</span>
          </div>
          <Table headers={['Goat ID', 'Buyer', 'Price', 'Date']}>
            {data.recent_activity.recent_sales.length > 0 ? (
              data.recent_activity.recent_sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{sale.goat_id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{sale.buyer_name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{currency.format(sale.price)}</td>
                  <td className="px-4 py-3 text-gray-500">{sale.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No recent sales yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Recent Expenses
            </h2>
            <span className="text-sm text-gray-500">{expenses.length} records</span>
          </div>
          <Table headers={['Type', 'Amount', 'Date']}>
            {data.recent_activity.recent_expenses.length > 0 ? (
              data.recent_activity.recent_expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{expense.expense_type}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{currency.format(expense.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{expense.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No recent expenses yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Vaccination Due Alerts
          </h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            {dueAlerts.length} due
          </span>
        </div>
        <Table headers={['Goat ID', 'Issue', 'Medicine', 'Due Date']}>
          {dueAlerts.length > 0 ? (
            dueAlerts.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{item.goat_id}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{item.issue}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{item.medicine}</td>
                <td className="px-4 py-3 font-medium text-amber-600 dark:text-amber-300">{item.next_due_date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                No vaccination alerts right now.
              </td>
            </tr>
          )}
        </Table>
      </Card>
    </div>
  )
}

