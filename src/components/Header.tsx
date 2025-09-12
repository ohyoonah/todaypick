import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="flex items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <h1 className="text-2xl font-bold text-foreground">TodayPick</h1>
        </Link>
        {/* TODO: 내비게이션 메뉴 추가 */}
      </div>
    </header>
  );
}
