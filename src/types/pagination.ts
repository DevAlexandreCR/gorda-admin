import { ref, Ref } from 'vue';

export interface Pagination {
  currentPage: Ref<number>;
  perPage: Ref<number>;
  totalCount: Ref<number>;
  limit: Ref<number>;
}

export const pagination: Pagination = {
  currentPage: ref(1),
  perPage: ref(10),
  totalCount: ref(0),
  limit: ref(100000)
};