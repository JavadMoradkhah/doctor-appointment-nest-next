export interface Paginated<T> {
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    previousPage: number | null;
  };
  data: T[];
}
