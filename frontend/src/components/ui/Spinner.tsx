type SpinnerProps = {
  label?: string
  fullPage?: boolean
}

export const Spinner = ({ label = 'Loading...', fullPage = false }: SpinnerProps) => {
  const content = (
    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500 dark:border-gray-700 dark:border-t-emerald-400" />
      <span>{label}</span>
    </div>
  )

  if (fullPage) {
    return <div className="flex min-h-[40vh] items-center justify-center">{content}</div>
  }

  return content
}

