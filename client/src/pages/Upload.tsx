import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload as UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Upload() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = trpc.photos.upload.useMutation({
    onSuccess: () => {
      toast.success("Photo uploaded! Waiting for approval...");
      setTitle("");
      setDescription("");
      setPhotoUrl("");
      setPreviewUrl(null);
      setLocation("/gallery");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload photo");
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Please login to upload photos
          </p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload to storage API
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setPhotoUrl(data.url);
      setPreviewUrl(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      toast.error("Please select a photo");
      return;
    }

    uploadMutation.mutate({
      photoUrl,
      title: title || undefined,
      description: description || undefined,
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Photo</h1>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">Photo *</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="photo-input"
              />
              <label
                htmlFor="photo-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <UploadIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? "Uploading..." : "Click to select or drag and drop"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Max 5MB, JPG/PNG/GIF
                </span>
              </label>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPhotoUrl("");
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2"
                >
                  ✕
                </Button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title (Optional)
            </label>
            <Input
              id="title"
              placeholder="Give your photo a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="Add a description for your photo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Info Box */}
          <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-2">📋 What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your photo will be submitted for approval</li>
              <li>The owner will review your photo</li>
              <li>Once approved, it will appear in the gallery</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={uploadMutation.isPending || !photoUrl}
              className="flex-1"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit for Approval"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/gallery")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
