"use client";

import { DashboardPageError, DashboardPageLoading } from "@/components/dashboard/page-state";
import {
  DangerZoneSettingsCard,
  DataSettingsCard,
  ProfileSettingsCard,
  SettingsHeader,
} from "@/components/dashboard/settings-sections";
import { useCurrentDbUser } from "@/hooks/queries";

export default function SettingsPage() {
  const currentUserQuery = useCurrentDbUser();

  if (currentUserQuery.isLoading) {
    return <DashboardPageLoading label="Loading settings..." />;
  }

  if (currentUserQuery.isError) {
    return (
      <DashboardPageError
        title="Could not load settings"
        message="We could not fetch your account details right now."
        onRetry={() => {
          void currentUserQuery.refetch();
        }}
      />
    );
  }

  return (
    <>
      <SettingsHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSettingsCard />
        <DataSettingsCard />
        <DangerZoneSettingsCard />
      </div>
    </>
  );
}
