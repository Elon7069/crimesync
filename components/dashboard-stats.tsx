'use client'

import { useMemo } from 'react'
import { seedCrimeReports, type CrimeReport } from '@/lib/seed-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface DashboardStatsProps {
  reports?: CrimeReport[]
}

export function DashboardStats({ reports = seedCrimeReports }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Today's reports
    const todayReports = reports.filter(report => 
      report.timestamp.toDateString() === today.toDateString()
    )

    // This week's reports
    const weekReports = reports.filter(report => 
      report.timestamp >= sevenDaysAgo
    )

    // This month's reports
    const monthReports = reports.filter(report => 
      report.timestamp >= thirtyDaysAgo
    )

    // Crime type distribution
    const crimeTypeData = Object.entries(
      reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: Math.round((count / reports.length) * 100)
    }))

    // Severity distribution
    const severityData = Object.entries(
      reports.reduce((acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count,
      color: severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#10b981'
    }))

    // Daily trend (last 7 days)
    const dailyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      const dayReports = reports.filter(report => 
        report.timestamp.toDateString() === date.toDateString()
      )
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        reports: dayReports.length,
        high: dayReports.filter(r => r.severity === 'high').length,
        medium: dayReports.filter(r => r.severity === 'medium').length,
        low: dayReports.filter(r => r.severity === 'low').length
      }
    })

    // Top unsafe areas
    const locationData = Object.entries(
      reports.reduce((acc, report) => {
        const area = report.location.address.split(',')[0] // Get first part of address
        acc[area] = (acc[area] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    )
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }))

    return {
      todayCount: todayReports.length,
      weekCount: weekReports.length,
      monthCount: monthReports.length,
      totalCount: reports.length,
      highSeverityCount: reports.filter(r => r.severity === 'high').length,
      verifiedCount: reports.filter(r => r.verified).length,
      crimeTypeData,
      severityData,
      dailyTrend,
      locationData
    }
  }, [reports])

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Reports</p>
              <p className="text-2xl font-bold">{stats.todayCount}</p>
              <p className="text-xs text-gray-500">{stats.weekCount} this week</p>
            </div>
            <div className="text-2xl text-red-600">⚠️</div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highSeverityCount}</p>
              <p className="text-xs text-gray-500">
                {Math.round((stats.highSeverityCount / stats.totalCount) * 100)}% of total
              </p>
            </div>
            <div className="text-2xl text-orange-600">📈</div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified Reports</p>
              <p className="text-2xl font-bold text-green-600">{stats.verifiedCount}</p>
              <p className="text-xs text-gray-500">
                {Math.round((stats.verifiedCount / stats.totalCount) * 100)}% verified
              </p>
            </div>
            <div className="text-2xl text-green-600">✅</div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold">{stats.totalCount}</p>
              <p className="text-xs text-gray-500">{stats.monthCount} this month</p>
            </div>
            <div className="text-2xl text-blue-600">📊</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Types Chart */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Crime Types Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">Breakdown of reported crime categories</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.crimeTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, 'Reports']}
                labelFormatter={(label) => `Crime Type: ${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">Risk level breakdown of all reports</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.severityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ severity, count }) => `${severity}: ${count}`}
              >
                {stats.severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, 'Reports']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">7-Day Trend</h3>
        <p className="text-sm text-gray-600 mb-4">Daily crime reports for the past week</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="reports" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Unsafe Areas */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">📍</span>
          Top 5 Areas with Most Reports
        </h3>
        <p className="text-sm text-gray-600 mb-4">Locations that need increased attention</p>
        <div className="space-y-3">
          {stats.locationData.map((item, index) => (
            <div key={item.location} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  index === 0 ? 'bg-red-600' : 
                  index === 1 ? 'bg-orange-500' : 
                  index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{item.location}</div>
                  <div className="text-sm text-gray-600">
                    {item.count} reports
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                index < 3 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {Math.round((item.count / stats.totalCount) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🕐</span>
          Recent Activity Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">{stats.todayCount}</div>
            <div className="text-sm text-blue-800">Reports Today</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">{stats.verifiedCount}</div>
            <div className="text-sm text-green-800">Verified Reports</div>
          </div>
          <div className="p-4 rounded-lg bg-red-50">
            <div className="text-2xl font-bold text-red-600">{stats.highSeverityCount}</div>
            <div className="text-sm text-red-800">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  )
}