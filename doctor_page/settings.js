import Sidebar from '../components/Sidebar'

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primaryGreen mb-6">Settings</h1>
        <p className="text-gray-700">Settings page content coming soon. Andrew, this is a placeholder by the way</p>
      </main>
    </div>
  )
}

export default Settings
