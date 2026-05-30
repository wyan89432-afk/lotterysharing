import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Heart, MessageCircle, Calendar } from "lucide-react";
import { useState } from "react";
import PhotoDetail from "@/components/PhotoDetail";

export default function Gallery() {
  const { user } = useAuth();
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  
  // Fetch approved photos
  const { data: photos, isLoading } = trpc.photos.listApproved.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">No photos yet</p>
          {user && (
            <Button onClick={() => window.location.href = "/upload"}>
              Upload First Photo
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (selectedPhotoId) {
    return (
      <PhotoDetail 
        photoId={selectedPhotoId} 
        onBack={() => setSelectedPhotoId(null)}
      />
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/calendar"}>
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          {user && (
            <Button onClick={() => window.location.href = "/upload"}>
              Upload Photo
            </Button>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
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
              {photo.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {photo.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
