"use client"
import DashboardContent from "./dashboard/page"

export default function DashboardPage() {

  return (
    <div className="flex h-screen bg-gray-100">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <DashboardContent />
        </main>
    </div>

  )
}

