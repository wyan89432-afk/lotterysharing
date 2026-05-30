import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  // Fetch pending photos
  const { data: pendingPhotos, isLoading, refetch } = trpc.photos.listPending.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const approveMutation = trpc.photos.approve.useMutation({
    onSuccess: () => {
      toast.success("Photo approved!");
      refetch();
      setSelectedPhotoId(null);
    },
  });

  const rejectMutation = trpc.photos.reject.useMutation({
    onSuccess: () => {
      toast.success("Photo rejected");
      refetch();
      setSelectedPhotoId(null);
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Access denied. Admin only.
          </p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const selectedPhoto = pendingPhotos?.find((p) => p.id === selectedPhotoId);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {selectedPhoto ? (
        /* Photo Review View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <img
                  src={selectedPhoto.photoUrl}
                  alt={selectedPhoto.title || "Photo"}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Photo Info */}
            <div className="mt-6">
              {selectedPhoto.title && (
                <h2 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h2>
              )}
              {selectedPhoto.description && (
                <p className="text-muted-foreground mb-4">{selectedPhoto.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Uploaded: {new Date(selectedPhoto.uploadedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Review Photo</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Status:</span> Pending Approval
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => approveMutation.mutate(selectedPhoto.id)}
                  disabled={approveMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {approveMutation.isPending ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => rejectMutation.mutate(selectedPhoto.id)}
                  disabled={rejectMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedPhotoId(null)}
              >
                Back to List
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        /* Pending Photos List */
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Pending Photos ({pendingPhotos?.length || 0})
            </h2>
          </div>

          {pendingPhotos && pendingPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPhotos.map((photo) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPhotoId(photo.id)}
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={photo.photoUrl}
                      alt={photo.title || "Photo"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    {photo.title && (
                      <h3 className="font-semibold truncate">{photo.title}</h3>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(photo.uploadedAt).toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoId(photo.id);
                      }}
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No pending photos to review
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
