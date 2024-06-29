export interface PaginationResponse {
  pagination: {
    itemsCount: number;
    currentPage: number;
    lastPage: number;
    nextPage: number | null;
    previousPage: number | null;
  };
  data: any[];
}
