import React from "react";
import Contacts from "@/components/pages/Contacts";
import Dashboard from "@/components/pages/Dashboard";
import Automation from "@/components/pages/Automation";
import Analytics from "@/components/pages/Analytics";
import Forms from "@/components/pages/Forms";
import Campaigns from "@/components/pages/Campaigns";
import SMS from "@/components/pages/SMS";
export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  campaigns: {
    id: 'campaigns',
    label: 'Campaigns',
    path: '/campaigns',
    icon: 'Mail',
    component: Campaigns
  },
  forms: {
    id: 'forms',
    label: 'Forms',
    path: '/forms',
    icon: 'FileText',
    component: Forms
  },
  automation: {
    id: 'automation',
    label: 'Automation',
    path: '/automation',
    icon: 'Zap',
    component: Automation
  },
analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  sms: {
    id: 'sms',
    label: 'SMS',
    path: '/sms',
    icon: 'MessageSquare',
    component: SMS
  }
};

export const routeArray = Object.values(routes);
export default routes;