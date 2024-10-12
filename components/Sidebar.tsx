'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, Users, FileText, Settings, BarChart2, Clipboard, LogOut, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const menuItems = [
    { id: 1, label: "Dashboard", icon: Home, link: "/dashboard" },
    { id: 2, label: "Draft Board", icon: Clipboard, link: "/draft-board" },
    { id: 3, label: "Player Rankings", icon: Users, link: "/player-rankings" },
    { id: 4, label: "Team Management", icon: FileText, link: "/team-management" },
    { id: 5, label: "Player Comparison", icon: BarChart2, link: "/player-comparison" },
    { id: 6, label: "Settings", icon: Settings, link: "/settings" },
    { id: 7, label: "Support the Founder", icon: Heart, link: "/help-me-get-an-internship" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-0`}>
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-xl font-bold">Fantasy Helper</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2">
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <Link href={item.link}>
                <span className="flex items-center p-2 hover:bg-gray-700">
                  <item.icon size={24} className="mr-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button onClick={handleSignOut} className="flex items-center p-2 hover:bg-gray-700 w-full">
          <LogOut size={24} className="mr-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
