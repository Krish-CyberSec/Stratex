import React from "react";
import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import RecentNotices from "./components/RecentNotices";
import RecentUsers from "./components/RecentUsers";
import UpcomingEvents from "./components/UpcomingEvents";

const SuperAdminDashboard = () => {
  return (
    <>
      <header className="mt-6 mb-8 w-full">
        <div className="min-w-0 border-l-4 border-[var(--stratex-gold)] pl-4 sm:pl-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--stratex-navy-light30)]">
            Overview
          </p>

          <h1 className="text-2xl font-semibold leading-tight text-[var(--stratex-navy)] break-words sm:text-3xl lg:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-full text-sm leading-6 text-[var(--text-secondary)] break-words sm:max-w-2xl sm:text-base">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
      </header>

      <DashboardStats />

      <section className="mt-6 grid w-full grid-cols-1 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <RecentUsers />
        <RecentActivity />
      </section>

      <section className="mt-6 grid w-full grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        <RecentNotices />
        <UpcomingEvents />
        <QuickActions />
      </section>
    </>
  );
};

export default SuperAdminDashboard;
