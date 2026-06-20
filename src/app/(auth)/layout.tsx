export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">{children}</div>
    </div>
  )
}
