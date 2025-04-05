import { Link } from "react-router-dom"
import { Users, Calendar, FileText, Settings, AlertTriangle } from "lucide-react"
import { useSchedules } from "../../hooks/useSchedules"
import { useArticles } from "../../hooks/useArticles"

export default function Dashboard() {
  const { schedules, isLoading: schedulesLoading } = useSchedules()
  const { articles, isLoading: articlesLoading } = useArticles()

  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: "567",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "News Articles",
      value: "45",
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Settings",
      value: "Configure",
      icon: Settings,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.title === "Settings" ? "/admin/settings" : "#"}
            className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((booking) => (
              <div
                key={booking}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">Booking #{booking}</p>
                  <p className="text-sm text-muted-foreground">
                    Mafia Island - Dar es Salaam
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/schedules"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <p className="font-medium">Manage Schedules</p>
            </Link>
            <Link
              to="/admin/users"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Users className="h-6 w-6 mb-2" />
              <p className="font-medium">Manage Users</p>
            </Link>
            <Link
              to="/admin/news"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="h-6 w-6 mb-2" />
              <p className="font-medium">Manage News</p>
            </Link>
            <Link
              to="/admin/settings"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Settings className="h-6 w-6 mb-2" />
              <p className="font-medium">Settings</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        {/* Schedules Card */}
        <div className="p-6 rounded-xl border bg-card">
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h2 className="font-semibold">Total Schedules</h2>
              <p className="text-2xl font-bold">
                {schedulesLoading ? "..." : schedules?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Articles Card */}
        <div className="p-6 rounded-xl border bg-card">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h2 className="font-semibold">Published Articles</h2>
              <p className="text-2xl font-bold">
                {articlesLoading ? "..." : articles?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="p-6 rounded-xl border bg-card">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <h2 className="font-semibold">Active Alerts</h2>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">Latest Updates</h3>
          </div>
          <div className="divide-y">
            {schedules?.slice(0, 5).map(schedule => (
              <div key={schedule.id} className="p-4">
                <p className="font-medium">{schedule.ship_name}</p>
                <p className="text-sm text-muted-foreground">{schedule.route}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 