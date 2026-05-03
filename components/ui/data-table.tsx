import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  actions,
  getRowKey
}: {
  columns: Column<T>[];
  rows: T[];
  actions?: (item: T) => React.ReactNode;
  getRowKey: (item: T, index: number) => string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-semibold">
                  {column.header}
                </th>
              ))}
              {actions ? <th className="px-5 py-4 font-semibold">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={getRowKey(row, index)} className="border-t border-slate-200">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-top text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
                {actions ? <td className="px-5 py-4">{actions(row)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export { StatusBadge };
