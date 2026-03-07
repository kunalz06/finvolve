"use client";

import { motion } from "framer-motion";
import { Activity, Server, Cpu, Globe, Wifi, Database, Zap } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const stats = [
  { label: "System Uptime", value: "99.9%", icon: Server, color: "text-green-600" },
  { label: "Network Latency", value: "24ms", icon: Wifi, color: "text-blue-600" },
  { label: "CPU Load", value: "12%", icon: Cpu, color: "text-orange-600" },
  { label: "Active Sessions", value: "1,204", icon: Globe, color: "text-primary" },
];

export default function TelemetryPage() {
  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-primary font-medium text-sm">Live Data Stream</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mission Control
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Real-time performance metrics and system status. Finvolve engineering monitors every component to ensure maximum performance.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} delay={i * 0.1} className="p-6 flex flex-col items-center text-center">
              <stat.icon className={`mb-4 ${stat.color}`} size={32} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Log */}
          <div className="lg:col-span-1">
            <Card hover={false} className="h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-primary" /> System Logs
              </h3>
              <div className="space-y-3 font-mono text-xs text-gray-500 max-h-[400px] overflow-y-auto">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex gap-3 border-b border-gray-100 pb-2">
                    <span className="text-primary">[10:{24 + i}:05]</span>
                    <span>System check complete. All systems operational.</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-2">
            <Card hover={false} className="h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
              <div className="text-center">
                <Database size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Core Database</h3>
                <p className="text-gray-500 text-sm">Encrypted • Distributed • Fast</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Zap size={16} className="text-primary" />
                  <span className="text-sm text-gray-600">Real-time sync active</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/finvolve/contact" variant="primary" size="large">
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}
