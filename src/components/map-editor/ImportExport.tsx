import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileJson, Download, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImportExportProps {
  onExportJSON: () => string | null;
  onImportJSON: (data: object) => void;
}

export const ImportExport = ({ onExportJSON, onImportJSON }: ImportExportProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = onExportJSON();
    if (!json) return;

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `map-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImportJSON(data);
      } catch {
        console.error("Failed to parse JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <FileJson className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium text-muted-foreground">JSON</h4>
      </div>
      
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Экспорт
            </Button>
          </TooltipTrigger>
          <TooltipContent>Экспорт карты в JSON</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-3 w-3 mr-1" />
              Импорт
            </Button>
          </TooltipTrigger>
          <TooltipContent>Импорт карты из JSON</TooltipContent>
        </Tooltip>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
};
