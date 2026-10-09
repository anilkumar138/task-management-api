
import { useCallback, useEffect, useState } from 'react'
import {
  ListTodo,
  LogOut,
  Plus,
  Search,
  Trash2,
  CheckSquare,
  Clock3,
  CircleCheck,
  AlertCircle,
  X,
  CalendarDays,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTasks, setTotalTasks] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/tasks', {
        params: {
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          page,
          limit: 10,
        },
      })

      setTasks(response.data.tasks || [])
      setTotalTasks(response.data.totalTasks ?? 0)
      setTotalPages(Math.max(response.data.totalPages || 1, 1))
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
        return
      }

      setError(err.response?.data?.message || 'Unable to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, priorityFilter, page, navigate])

  const loadSummary = useCallback(async () => {
    try {
      const response = await api.get('/tasks', {
        params: { limit: 1000, page: 1 },
      })

      setAllTasks(response.data.tasks || [])
    } catch {
      setAllTasks([])
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  function handleFilterChange(setter, value) {
    setter(value)
    setPage(1)
  }

  async function createTask(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/tasks', {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate,
      })

      setForm(emptyForm)
      setShowForm(false)
      setPage(1)
      setSuccess('Task created successfully.')
      await Promise.all([loadTasks(), loadSummary()])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task.')
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(id, status) {
    setError('')
    setSuccess('')

    try {
      await api.put(`/tasks/${id}`, { status })
      setSuccess('Task status updated successfully.')
      await Promise.all([loadTasks(), loadSummary()])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task.')
      await loadTasks()
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task?')

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      await api.delete(`/tasks/${id}`)
      setSuccess('Task deleted successfully.')
      await Promise.all([loadTasks(), loadSummary()])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  const counts = {
    total: allTasks.length,
    pending: allTasks.filter((task) => task.status === 'Pending').length,
    progress: allTasks.filter((task) => task.status === 'In Progress').length,
    completed: allTasks.filter((task) => task.status === 'Completed').length,
    high: allTasks.filter(
      (task) => task.priority === 'High' && task.status !== 'Completed',
    ).length,
  }

  const completedPercentage = counts.total
    ? Math.round((counts.completed / counts.total) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
            <ListTodo size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">TaskFlow</h1>
            <p className="text-xs text-slate-500">Personal workspace</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <LogOut size={17} />
          Log out
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h2>
            <p className="mt-2 text-slate-500">
              Organize your work and get things done.
            </p>
          </div>

          <button
            onClick={() => {
              setError('')
              setSuccess('')
              setShowForm(true)
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
          >
            <Plus size={19} />
            Create Task
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss error">
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} aria-label="Dismiss message">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total Tasks',
              value: counts.total,
              Icon: CheckSquare,
              color: 'bg-indigo-50 text-indigo-600',
            },
            {
              label: 'Pending',
              value: counts.pending,
              Icon: Clock3,
              color: 'bg-amber-50 text-amber-600',
            },
            {
              label: 'In Progress',
              value: counts.progress,
              Icon: AlertCircle,
              color: 'bg-sky-50 text-sky-600',
            },
            {
              label: 'Completed',
              value: counts.completed,
              Icon: CircleCheck,
              color: 'bg-emerald-50 text-emerald-600',
            },
          ].map(({ label, value, Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon size={21} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">Productivity</h3>
                <p className="mt-1 text-sm text-slate-500">Completed tasks across your workspace</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {completedPercentage}%
              </span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${completedPercentage}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {counts.completed} completed out of {counts.total} tasks
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">High priority</p>
                <p className="text-2xl font-bold text-slate-900">{counts.high}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Uncompleted high-priority tasks that need attention.
            </p>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Tasks</h3>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter and manage your work
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => handleFilterChange(setSearch, event.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-indigo-400 sm:w-48"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => handleFilterChange(setStatusFilter, event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => handleFilterChange(setPriorityFilter, event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button
                onClick={() => Promise.all([loadTasks(), loadSummary()])}
                aria-label="Refresh tasks"
                className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Task</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Due date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-14 text-center text-slate-500">
                      Loading your tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>
                      <p className="mt-3 font-semibold text-slate-700">No tasks found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try different filters or create your first task.
                      </p>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{task.title}</p>
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {task.description || 'No description'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            task.priority === 'High'
                              ? 'bg-rose-50 text-rose-700'
                              : task.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={15} />
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'Not set'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={task.status}
                          onChange={(event) => updateStatus(task._id, event.target.value)}
                          className={`rounded-lg border-0 px-2 py-2 text-xs font-semibold outline-none ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : task.status === 'In Progress'
                                ? 'bg-sky-50 text-sky-700'
                                : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => deleteTask(task._id)}
                          aria-label={`Delete ${task.title}`}
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              {totalTasks} matching tasks
            </p>
            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <form
              onSubmit={createTask}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Create a task</h3>
                  <p className="mt-1 text-sm text-slate-500">Add a task to your workspace.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <label htmlFor="task-title" className="mb-2 block text-sm font-medium">
                Task title
              </label>
              <input
                id="task-title"
                required
                maxLength={150}
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Enter task title"
                className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
              />

              <label htmlFor="task-description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="task-description"
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Describe the task"
                className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
              />

              <label htmlFor="task-priority" className="mb-2 block text-sm font-medium">
                Priority
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(event) => setForm({ ...form, priority: event.target.value })}
                className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label htmlFor="task-due-date" className="mb-2 block text-sm font-medium">
                Due date
              </label>
              <input
                id="task-due-date"
                type="date"
                required
                min={new Date().toLocaleDateString('en-CA')}
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                className="mb-6 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
