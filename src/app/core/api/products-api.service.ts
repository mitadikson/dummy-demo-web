import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ENDPOINTS } from '../constants/endpoints.constants';

export interface Product {
  id: number;
  title: string;
  description: string;
}

export interface ProductsResponse {
  products: Product[];
}

@Service()
export class ProductsApiService {
  private readonly httpClient = inject(HttpClient);

  getListProducts() {
    return this.httpClient.get<ProductsResponse>(`${environment.apiUrl}${ENDPOINTS.PRODUCTS.LIST}`);
  }

  searchProducts(query: string) {
    return this.httpClient.get<ProductsResponse>(`${environment.apiUrl}${ENDPOINTS.PRODUCTS.SEARCH}`, {
      params: {
        q: query,
      },
    });
  }
}
