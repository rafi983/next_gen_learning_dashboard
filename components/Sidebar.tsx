"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  ClipboardList,
  Settings,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/", Icon: LayoutDashboard },
  { label: "Courses", href: "/courses", Icon: BookOpen },
  { label: "Analytics", href: "/analytics", Icon: BarChart2 },
  { label: "Tasks", href: "/tasks", Icon: ClipboardList },
  { label: "Settings", href: "/settings", Icon: Settings },
];

function NavItem({
  item,
  collapsed,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-100"
      style={{ color: active ? "#e2e8f0" : "#4b5563" }}
    >
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 rounded-lg"
          style={{ background: "rgba(255,255,255,0.07)" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
      )}
      <item.Icon size={17} className="relative z-10 flex-shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.14 }}
            className="relative z-10 overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Sidebar() {
  // TODO: persist this to localStorage
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        className={[
          "hidden md:flex flex-col flex-shrink-0 h-screen py-5 overflow-hidden",
          "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          collapsed ? "w-16" : "w-16 lg:w-[220px]",
        ].join(" ")}
        style={{
          background: "#09090e",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 px-[14px] mb-8">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            }}
          >
            <GraduationCap size={15} className="text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="brand"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="hidden lg:block text-sm font-semibold text-slate-200 whitespace-nowrap overflow-hidden"
              >
                EduForge
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={pathname === item.href}
            />
          ))}
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex mx-2 mt-4 items-center justify-center rounded-lg py-2 text-slate-700 transition-colors hover:bg-white/[0.05] hover:text-slate-400"
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className="flex"
          >
            <ChevronLeft size={15} />
          </motion.span>
        </button>
      </nav>

      {/* mobile — bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background: "rgba(9,9,14,0.92)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(14px)",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 rounded-lg p-2 transition-colors duration-100"
            style={{ color: pathname === item.href ? "#3b82f6" : "#4b5563" }}
          >
            <item.Icon size={20} />
            <span className="text-[9px] tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
