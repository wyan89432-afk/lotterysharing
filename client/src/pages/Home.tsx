import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Calendar, Heart, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

/**
 * Landing page for the photo sharing application
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6" />
            <h1 className="text-2xl font-bold">PhotoShare</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/gallery")}
            >
              Gallery
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/calendar")}
            >
              Calendar
            </Button>
            {user?.role === "admin" && (
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin")}
              >
                Admin
              </Button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button
                  onClick={() => setLocation("/upload")}
                  size="sm"
                >
                  Upload
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                size="sm"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container py-20">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Share Your Moments
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload photos, get them approved, and share with the community.
              Comment, like, and discover amazing photos in our calendar view.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/gallery")}
              >
                View Gallery
              </Button>
              {isAuthenticated ? (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/upload")}
                >
                  Upload Photo
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <Card className="p-6">
              <Camera className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Upload Photos</h3>
              <p className="text-muted-foreground">
                Share your favorite moments. Photos require approval before appearing in the gallery.
              </p>
            </Card>

            <Card className="p-6">
              <Calendar className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
              <p className="text-muted-foreground">
                Browse photos by date in our beautiful calendar view. See what was shared on any day.
              </p>
            </Card>

            <Card className="p-6">
              <Heart className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Engage</h3>
              <p className="text-muted-foreground">
                Like photos and leave comments. Like counts are hidden from other users.
              </p>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Create Account</h4>
                  <p className="text-muted-foreground">
                    Sign up using Google or Telegram
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Upload Photo</h4>
                  <p className="text-muted-foreground">
                    Select a photo and add a title or description
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Wait for Approval</h4>
                  <p className="text-muted-foreground">
                    The owner will review and approve your photo
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Share & Engage</h4>
                  <p className="text-muted-foreground">
                    Your photo appears in the gallery. Like and comment on photos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 PhotoShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
