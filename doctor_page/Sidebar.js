import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaBars, FaTimes, FaTachometerAlt, FaCalendarAlt, FaUserInjured, FaCog } from 'react-icons/fa'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const links = [
    { name: 'Dashboard', href: '/', icon: <FaTachometerAlt /> },
    { name: 'Appointments', href: '/appointments', icon: <FaCalendarAlt /> },
    { name: 'Patient Records', href: '/patient-records', icon: <FaUserInjured /> },
    { name: 'Settings', href: '/settings', icon: <FaCog /> },
  ]

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-primaryGreen text-white p-4">
        <div className="text-lg font-semibold">Virtual Doc</div>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <nav
        className={`bg-white border-r border-gray-200 md:static fixed top-0 left-0 h-full w-64 transform md:translate-x-0 transition-transform duration-200 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 text-2xl font-bold text-primaryGreen border-b border-gray-200">
          Virtual Doc
        </div>
        <ul className="mt-6">
          {links.map(({ name, href, icon }) => (
            <li key={name} className="mb-2">
              <Link href={href}>
                <div
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-primaryGreen hover:text-white transition-colors rounded cursor-pointer ${
                    router.pathname === href ? 'bg-primaryGreen text-white' : ''
                  }`}
                >
                  <span className="mr-3">{icon}</span>
                  {name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
