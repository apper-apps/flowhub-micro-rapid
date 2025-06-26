import React, { useContext, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import { routeArray } from "@/config/routes";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import "@/index.css";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-surface-200">
          {/* Sidebar Header */}
          <div className="px-6 py-4 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-surface-900">FlowHub</h1>
                  <p className="text-sm text-surface-600">CRM Platform</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="LogOut"
                onClick={logout}
                className="text-surface-600 hover:text-red-600"
                title="Logout"
              />
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-6 py-3 border-b border-surface-200 bg-surface-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">
                    {user.firstName?.charAt(0) || user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                  </p>
                  <p className="text-xs text-surface-600 truncate">
                    {user.emailAddress || user.email || ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
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
                <ApperIcon name="Bell" size={18} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>
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