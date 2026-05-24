import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = generatePageNumbers(currentPage, totalPages)

    return (
        <nav className="flex flex-nowrap w-full justify-center items-center gap-2 md:gap-4 mt-12 px-2" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className={cn(
                    'flex items-center justify-center min-w-[48px] h-[48px] md:min-w-[40px] md:h-[40px] px-2 md:px-3 text-sm rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                    currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                )}
            >
                <ChevronLeft className="w-6 h-6 text-white" />
                <span className="sr-only">Previous</span>
            </button>

            <div className="flex-1 min-w-0 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar px-2">
                {pages.map((page, i) => (
                    page === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-zinc-600 text-base shrink-0 select-none">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                'flex items-center justify-center min-w-[40px] h-[40px] text-base font-medium rounded-lg transition-colors shrink-0',
                                currentPage === page
                                    ? 'bg-white text-black font-bold'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                            )}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className={cn(
                    'flex items-center justify-center min-w-[48px] h-[48px] md:min-w-[40px] md:h-[40px] px-2 md:px-3 text-sm rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                    currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
                )}
            >
                <ChevronRight className="w-6 h-6 text-white" />
                <span className="sr-only">Next</span>
            </button>
        </nav>
    )
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    // Start range: 1 2 3 ... 22
    if (current <= 3) {
        return [1, 2, 3, '...', total]
    }

    // End range: 1 ... 20 21 22
    if (current >= total - 2) {
        return [1, '...', total - 2, total - 1, total]
    }

    // Middle range: 1 ... 10 11 12 ... 22
    return [1, '...', current - 1, current, current + 1, '...', total]
}
