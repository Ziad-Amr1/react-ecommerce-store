import { Button } from "../../../../components/ui/button";

export default function ProductPagination({ currentPage, totalPages, isFetching, setCurrentPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted"
                disabled={currentPage === 1 || isFetching} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous
            </Button>

            <span className="rounded-md border border-border bg-card px-4 py-2 font-mono text-sm text-foreground">{currentPage} / {totalPages}</span>

            <Button variant="outline" className="cursor-pointer border-border bg-background text-foreground hover:bg-muted"
                disabled={currentPage === totalPages || isFetching} onClick={() => setCurrentPage((prev) => prev + 1)}>Next
            </Button>
        </div>
    );
}