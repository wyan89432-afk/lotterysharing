import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoDetailProps {
  photoId: number;
  onBack: () => void;
}

export default function PhotoDetail({ photoId, onBack }: PhotoDetailProps) {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [commentText, setCommentText] = useState("");
  
  // Fetch photo details
  const { data: photo, isLoading: photoLoading } = trpc.photos.getById.useQuery(photoId);
  
  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = trpc.comments.list.useQuery(photoId);
  
  // Fetch like status
  const { data: userLiked, isLoading: likeStatusLoading } = trpc.likes.getUserStatus.useQuery(
    photoId,
    { enabled: !!user }
  );
  
  // Fetch like count
  const { data: likeCount } = trpc.likes.getCount.useQuery(photoId);
  
  // Mutations
  const toggleLikeMutation = trpc.likes.toggle.useMutation({
    onSuccess: () => {
      toast.success(userLiked ? "Unliked" : "Liked");
      utils.likes.getUserStatus.invalidate(photoId);
      utils.likes.getCount.invalidate(photoId);
    },
  });
  
  const addCommentMutation = trpc.comments.add.useMutation({
    onSuccess: () => {
      setCommentText("");
      toast.success("Comment added");
      utils.comments.list.invalidate(photoId);
    },
  });

  if (photoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Photo not found</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like photos");
      return;
    }
    toggleLikeMutation.mutate(photoId);
  };

  const handleAddComment = () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    addCommentMutation.mutate({
      photoId,
      content: commentText,
    });
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Gallery
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <img
                src={photo.photoUrl}
                alt={photo.title || "Photo"}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          {/* Photo Info */}
          <div className="mt-6">
            {photo.title && <h1 className="text-2xl font-bold mb-2">{photo.title}</h1>}
            {photo.description && (
              <p className="text-muted-foreground mb-4">{photo.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Uploaded: {new Date(photo.uploadedAt).toLocaleDateString()}
              </span>
              {photo.approvedAt && (
                <span>
                  Approved: {new Date(photo.approvedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Like Section */}
          <Card className="p-4">
            <Button
              variant={userLiked ? "default" : "outline"}
              className="w-full"
              onClick={handleLike}
              disabled={toggleLikeMutation.isPending || likeStatusLoading}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${userLiked ? "fill-current" : ""}`}
              />
              {userLiked ? "Unlike" : "Like"}
            </Button>
            {user?.role === "admin" && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Likes: {likeCount || 0}
              </p>
            )}
          </Card>

          {/* Comments Section */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">
              Comments {comments && comments.length > 0 ? `(${comments.length})` : ""}
            </h3>

            {/* Add Comment */}
            {user && (
              <div className="space-y-2 mb-4">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending}
                >
                  {addCommentMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Comment"
                  )}
                </Button>
              </div>
            )}

            {!user && (
              <p className="text-sm text-muted-foreground mb-4">
                Login to comment
              </p>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commentsLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="text-sm border-t pt-2">
                    <p className="font-medium text-xs text-muted-foreground mb-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
