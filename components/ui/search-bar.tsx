import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
      />
    </div>
  );
}
