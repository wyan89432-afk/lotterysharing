import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import PhotoDetail from "@/components/PhotoDetail";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  // Fetch all approved photos
  const { data: photos, isLoading } = trpc.photos.listApproved.useQuery();

  // Group photos by date
  const photosByDate = useMemo(() => {
    if (!photos) return {};
    
    const grouped: Record<string, typeof photos> = {};
    photos.forEach((photo) => {
      const dateKey = new Date(photo.uploadedAt).toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(photo);
    });
    return grouped;
  }, [photos]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDateKey = (day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split("T")[0];
  };

  if (selectedPhotoId) {
    return (
      <PhotoDetail
        photoId={selectedPhotoId}
        onBack={() => setSelectedPhotoId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Photo Calendar</h1>
        <Button variant="outline" onClick={() => window.location.href = "/gallery"}>
          Gallery View
        </Button>
      </div>

      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-sm p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null;
            const dayPhotos = dateKey ? photosByDate[dateKey] : [];
            const hasPhotos = dayPhotos && dayPhotos.length > 0;

            return (
              <div
                key={index}
                className={`aspect-square border rounded-lg p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-primary ${
                  day === null ? "bg-muted" : hasPhotos ? "border-primary bg-primary/5" : ""
                }`}
              >
                {day && (
                  <>
                    <span className="text-xs font-medium mb-1">{day}</span>
                    {hasPhotos && (
                      <div className="flex-1 w-full flex flex-col gap-0.5">
                        {dayPhotos.slice(0, 2).map((photo) => (
                          <div
                            key={photo.id}
                            className="w-full h-6 rounded overflow-hidden cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedPhotoId(photo.id)}
                          >
                            <img
                              src={photo.photoUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {dayPhotos.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayPhotos.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="mt-6 text-sm text-muted-foreground">
        <p>💡 Click on any date with photos to view them</p>
      </div>
    </div>
  );
}
