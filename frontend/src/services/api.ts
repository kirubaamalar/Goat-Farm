import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

export const getAssetUrl = (path?: string | null) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path}`
}

export type Goat = {
  id: number
  goat_code: string
  name: string
  breed: string
  age: number
  weight: number
  gender: string
  status: string
  photo_url?: string | null
}

export type FeedingRecord = {
  id: number
  goat_id: number
  food_type: string
  quantity: number
  feeding_date: string
  notes?: string | null
}

export type HealthRecord = {
  id: number
  goat_id: number
  issue: string
  medicine: string
  vaccination_date: string
  next_due_date: string
  notes?: string | null
}

export type ExpenseRecord = {
  id: number
  expense_type: string
  amount: number
  date: string
  notes?: string | null
}

export type SalesRecord = {
  id: number
  goat_id: number
  price: number
  buyer_name: string
  date: string
  notes?: string | null
}

export type DashboardPayload = {
  goats: {
    total: number
    healthy: number
    sick: number
    sold: number
    pregnant: number
  }
  finance: {
    total_expense: number
    total_sales: number
    profit: number
    expense_breakdown: Record<string, number>
  }
  sales: {
    total_sales_count: number
    average_sale_price: number
  }
  feeding: {
    total_records: number
  }
  health: {
    vaccination_due_count: number
  }
  recent_activity: {
    recent_sales: SalesRecord[]
    recent_expenses: ExpenseRecord[]
  }
}

export const dashboardApi = {
  get: async () => (await api.get<DashboardPayload>('/api/dashboard')).data,
}

export const goatApi = {
  list: async () => (await api.get<Goat[]>('/api/goat/list')).data,
  add: async (data: FormData) =>
    (
      await api.post<{ message?: string; error?: string; goat_code?: string }>(
        '/api/goat/add',
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
    ).data,
  update: async (
    id: number,
    data: Omit<Goat, 'id' | 'goat_code' | 'photo_url'>,
  ) => (await api.put<{ message?: string; error?: string }>(`/api/goat/update/${id}`, data)).data,
  delete: async (id: number) =>
    (await api.delete<{ message?: string; error?: string }>(`/api/goat/delete/${id}`)).data,
}

export const feedingApi = {
  list: async () => (await api.get<FeedingRecord[]>('/api/feeding/list')).data,
  add: async (data: Omit<FeedingRecord, 'id'>) =>
    (await api.post<{ message?: string; error?: string }>('/api/feeding/add', data)).data,
  update: async (id: number, data: Omit<FeedingRecord, 'id'>) =>
    (await api.put<{ message?: string; error?: string }>(`/api/feeding/update/${id}`, data)).data,
  delete: async (id: number) =>
    (await api.delete<{ message?: string; error?: string }>(`/api/feeding/delete/${id}`)).data,
}

export const healthApi = {
  list: async () => (await api.get<HealthRecord[]>('/api/health/list')).data,
  due: async () =>
    (await api.get<HealthRecord[]>('/api/health/vaccination-due')).data,
  add: async (data: Omit<HealthRecord, 'id'>) =>
    (await api.post<{ message?: string; error?: string }>('/api/health/add', data)).data,
  update: async (id: number, data: Omit<HealthRecord, 'id'>) =>
    (await api.put<{ message?: string; error?: string }>(`/api/health/update/${id}`, data)).data,
  delete: async (id: number) =>
    (await api.delete<{ message?: string; error?: string }>(`/api/health/delete/${id}`)).data,
}

export const expenseApi = {
  list: async () => (await api.get<ExpenseRecord[]>('/api/expense/list')).data,
  add: async (data: Omit<ExpenseRecord, 'id'>) =>
    (await api.post<{ message?: string; error?: string }>('/api/expense/add', data)).data,
  update: async (id: number, data: Omit<ExpenseRecord, 'id'>) =>
    (await api.put<{ message?: string; error?: string }>(`/api/expense/update/${id}`, data)).data,
  delete: async (id: number) =>
    (await api.delete<{ message?: string; error?: string }>(`/api/expense/delete/${id}`)).data,
}

export const salesApi = {
  list: async () => (await api.get<SalesRecord[]>('/api/sales/list')).data,
  add: async (data: Omit<SalesRecord, 'id'>) =>
    (await api.post<{ message?: string; error?: string }>('/api/sales/add', data)).data,
}

