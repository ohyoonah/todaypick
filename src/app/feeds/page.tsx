import CategoryByFeed from "@/components/feed/CategoryByFeed";

export default function FeedsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <CategoryByFeed />
      </div>
    </div>
  );
}
