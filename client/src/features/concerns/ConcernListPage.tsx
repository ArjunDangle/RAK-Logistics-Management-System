import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ConcernsTable } from "./components/ConcernsTable";
import { ConcernDetailDialog } from "./components/ConcernDetailDialog";
import { useGetConcerns, useUpdateConcern } from "./useConcerns";
import { Concern } from "./types";
import { Loader2 } from "lucide-react";

const ConcernListPage = () => {
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);
  const { data: concerns, isLoading } = useGetConcerns();
  const updateMutation = useUpdateConcern();

  const activeConcerns = concerns?.filter(c => c.status !== "SOLVED") || [];

  const handleUpdate = (updates: Parameters<typeof updateMutation.mutate>[0]["updates"]) => {
    if (!selectedConcern) return;
    
    updateMutation.mutate(
      { id: selectedConcern.id, updates },
      {
        onSuccess: () => {
          setSelectedConcern(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Concerns Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Manage and resolve logistics support concerns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Concerns</CardTitle>
          <CardDescription>
            {activeConcerns.length} concern{activeConcerns.length !== 1 ? 's' : ''} awaiting action
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ConcernsTable 
              concerns={activeConcerns} 
              onSelectConcern={setSelectedConcern}
            />
          )}
        </CardContent>
      </Card>

      <ConcernDetailDialog
        concern={selectedConcern}
        open={!!selectedConcern}
        onOpenChange={(open) => !open && setSelectedConcern(null)}
        onUpdate={handleUpdate}
        isUpdating={updateMutation.isPending}
      />
    </div>
  );
};

export default ConcernListPage;
