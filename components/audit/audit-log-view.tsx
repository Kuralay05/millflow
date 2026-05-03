"use client";

import { useApi } from "@/hooks/use-api";
import { AuditLogEntry } from "@/types/entities";
import { DataTable } from "@/components/ui/data-table";
import { LoadingState } from "@/components/ui/loading-state";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function AuditLogView() {
  const { data, loading, error } = useApi<AuditLogEntry[]>("/api/audit-logs");

  if (loading) return <LoadingState label="Loading audit log..." />;
  if (!data || error) {
    return <Card className="border-rose-200 bg-rose-50 text-rose-700">{error}</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-100 to-slate-50">
        <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
        <p className="mt-2 text-sm text-slate-600">
          Administrative log of key operations for traceability of CRUD actions and demo sessions.
        </p>
      </Card>
      <DataTable
        rows={data}
        getRowKey={(item) => item._id}
        columns={[
          { key: "action", header: "Action", render: (item) => item.action },
          { key: "entityType", header: "Entity", render: (item) => item.entityType },
          { key: "entityId", header: "ID", render: (item) => item.entityId },
          { key: "userEmail", header: "User", render: (item) => item.userEmail },
          { key: "timestamp", header: "Timestamp", render: (item) => formatDate(item.timestamp) },
          { key: "details", header: "Details", render: (item) => item.details }
        ]}
      />
    </div>
  );
}
