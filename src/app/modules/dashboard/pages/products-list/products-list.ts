import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Product, ProductsApiService } from '../../../../core/api/products-api.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, map, switchMap, tap } from 'rxjs';
import { form, FormField } from '@angular/forms/signals';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  imports: [MatFormField, MatLabel, MatInput, FormField],
  selector: 'app-products-list',
  styleUrl: './products-list.scss',
  templateUrl: './products-list.html',
})
export class ProductsList {
  private readonly productsApiService = inject(ProductsApiService);

  protected formSearchModel = signal({ search: '' });
  protected searchForm = form(this.formSearchModel);

  products = signal<Product[]>([]);

  constructor() {
    toObservable(this.searchForm.search().value)
      .pipe(
        tap((term) => console.log('[search] 1. Input:', JSON.stringify(term))),
        map((term) => term.trim()),
        tap((term) => console.log('[search] 2. Trimmed; waiting 500 ms:', JSON.stringify(term))),
        debounceTime(500),
        tap((term) => console.log('[search] 3. Debounce emitted:', JSON.stringify(term))),
        distinctUntilChanged(),
        tap((term) => console.log('[search] 4. Different from previous emitted term:', JSON.stringify(term))),
        switchMap((term) =>
          this.productsApiService.searchProducts(term).pipe(
            tap({
              subscribe: () => console.log('[search] 5. API request started:', JSON.stringify(term)),
              next: (response) => console.log('[search] 6. API response:', response),
            }),
            catchError((error) => {
              console.error('Product search failed:', error);
              return EMPTY;
            }),
            finalize(() => console.log('[search] Request ended (completed, failed, or cancelled):', JSON.stringify(term))),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.products.set(response.products);
        console.log('[search] 7. Products updated:', this.products());
      });
  }
}
