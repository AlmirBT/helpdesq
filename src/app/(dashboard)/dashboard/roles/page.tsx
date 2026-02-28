import { PermissionsGrid } from "./permissions-grid";

export default function RolesPage() {
  return (
    <main className="flex h-full flex-col gap-4 overflow-auto p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Роли и права</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Роли по умолчанию: Сотрудник, Поддержка, Разработчик, Администратор.
          Настройте права для каждой роли.
        </p>
      </div>
      <PermissionsGrid />
    </main>
  );
}
