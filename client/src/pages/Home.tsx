import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-4">
        PhotoShare
      </h1>

      <p className="text-gray-400 mb-8">
        Share your moments with everyone.
      </p>

      <div className="flex gap-4">
        <Button>
          View Gallery
        </Button>

        <Button
          variant="outline"
          onClick={() => alert("Login temporarily disabled")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}