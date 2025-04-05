import { useState } from "react"

export function Schedule() {
  const [activeTab, setActiveTab] = useState("today")

  // Sample schedule data
  const schedules = {
    today: [
      { time: "08:00", from: "Mafia", to: "Zanzibar", status: "On Time" },
      { time: "10:30", from: "Zanzibar", to: "Mafia", status: "On Time" },
      { time: "14:00", from: "Mafia", to: "Dar es Salaam", status: "Delayed" },
      { time: "16:30", from: "Dar es Salaam", to: "Mafia", status: "On Time" },
    ],
    tomorrow: [
      { time: "08:00", from: "Mafia", to: "Zanzibar", status: "Scheduled" },
      { time: "10:30", from: "Zanzibar", to: "Mafia", status: "Scheduled" },
      { time: "14:00", from: "Mafia", to: "Dar es Salaam", status: "Scheduled" },
      { time: "16:30", from: "Dar es Salaam", to: "Mafia", status: "Scheduled" },
    ],
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ferry Schedule
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4">
            Check our daily ferry schedules and plan your journey
          </p>
        </div>

        <div className="mt-12">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("today")}
                className={`${
                  activeTab === "today"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-muted-foreground hover:border-muted-foreground"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Today's Schedule
              </button>
              <button
                onClick={() => setActiveTab("tomorrow")}
                className={`${
                  activeTab === "tomorrow"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-muted-foreground hover:border-muted-foreground"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tomorrow's Schedule
              </button>
            </nav>
          </div>

          <div className="mt-8">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-border sm:rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-card">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            From
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            To
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {schedules[activeTab].map((schedule, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                              {schedule.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              {schedule.from}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              {schedule.to}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  schedule.status === "On Time"
                                    ? "bg-green-100 text-green-800"
                                    : schedule.status === "Delayed"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {schedule.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 