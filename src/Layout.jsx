import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -240, opacity: 0 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-100">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40 px-4 lg:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <ApperIcon name="Zap" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900 hidden sm:block">FlowHub CRM</h1>
          </div>

          {/* Search and notifications */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-surface-50 rounded-lg px-3 py-2">
              <ApperIcon name="Search" size={16} className="text-surface-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-60 bg-white border-r border-surface-200 flex-col z-40">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'gradient-primary text-white shadow-md'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  {route.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-surface-200 z-50 lg:hidden"
              >
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'gradient-primary text-white shadow-md'
                              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={18} />
                        {route.label}
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;