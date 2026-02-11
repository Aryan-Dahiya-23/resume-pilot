import {
  DangerZoneSettingsCard,
  DataSettingsCard,
  ProfileSettingsCard,
  SettingsHeader,
} from "@/components/dashboard/settings-sections";

export default function SettingsPage() {
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
