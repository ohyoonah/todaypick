import { useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface FeedPaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function FeedPagination({
  totalPages,
  currentPage,
}: FeedPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 첫 페이지
      pages.push(1);

      // 중간 페이지 범위 계산
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // 시작 생략표시
      if (start > 2) {
        pages.push("ellipsis");
      }

      // 중간 페이지들
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // 끝 생략표시
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // 마지막 페이지
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* 이전 버튼 */}
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious href={createPageURL(currentPage - 1)}>
                이전
              </PaginationPrevious>
            ) : (
              <PaginationPrevious className="pointer-events-none opacity-50">
                이전
              </PaginationPrevious>
            )}
          </PaginationItem>

          {/* 페이지 번호들 */}
          {renderPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageURL(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* 다음 버튼 */}
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext href={createPageURL(currentPage + 1)}>
                다음
              </PaginationNext>
            ) : (
              <PaginationNext className="pointer-events-none opacity-50">
                다음
              </PaginationNext>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
