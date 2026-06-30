export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-100">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}
