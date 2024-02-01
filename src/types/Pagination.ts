import {ServiceCursor} from "@/types/ServiceCursor";

export interface Pagination {
  currentPage: number
  perPage: number
  totalCount: number
  cursor: ServiceCursor
}