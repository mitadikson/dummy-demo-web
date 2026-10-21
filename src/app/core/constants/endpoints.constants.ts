export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search', // query param: ?q=searchTerm
    DETAIL: (id: string) => `/products/${id}`,
  },
};
