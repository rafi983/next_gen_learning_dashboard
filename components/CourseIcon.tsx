"use client";

import {
  BookOpen,
  Code2,
  FileCode2,
  Palette,
  Network,
  Database,
  Terminal,
  Layers,
  Globe,
  Brain,
  Zap,
  Cpu,
  GitBranch,
  Blocks,
} from "lucide-react";

// maps icon_name from db → actual lucide component
const icons: Record<string, any> = {
  BookOpen,
  Code2,
  FileCode2,
  Palette,
  Network,
  Database,
  Terminal,
  Layers,
  Globe,
  Brain,
  Zap,
  Cpu,
  GitBranch,
  Blocks,
};

export default function CourseIcon({
  name,
  size = 18,
  color,
  className,
}: {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const Icon = icons[name] ?? BookOpen;
  return <Icon size={size} color={color} className={className} />;
}
