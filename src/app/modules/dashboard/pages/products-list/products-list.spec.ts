import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsList } from './products-list';
import { ProductsApiService, ProductsResponse } from '../../../../core/api/products-api.service';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;
  let response: Subject<ProductsResponse>;
  let searchProducts: ReturnType<typeof vi.fn>;

  const setSearch = (value: string) => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    TestBed.tick();
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    response = new Subject<ProductsResponse>();
    searchProducts = vi.fn().mockReturnValue(response);
    await TestBed.configureTestingModule({
      imports: [ProductsList],
      providers: [{ provide: ProductsApiService, useValue: { searchProducts } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.tick();
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debounces input and ignores repeated trimmed terms', async () => {
    setSearch('phone');
    await vi.advanceTimersByTimeAsync(499);
    expect(searchProducts).not.toHaveBeenCalled();

    setSearch('laptop');
    await vi.advanceTimersByTimeAsync(500);
    expect(searchProducts).toHaveBeenCalledExactlyOnceWith('laptop');

    setSearch(' laptop ');
    await vi.advanceTimersByTimeAsync(500);
    expect(searchProducts).toHaveBeenCalledTimes(1);
  });

  it('cancels the previous request and renders the latest products', async () => {
    setSearch('phone');
    await vi.advanceTimersByTimeAsync(500);
    const latestResponse = new Subject<ProductsResponse>();
    searchProducts.mockReturnValue(latestResponse);

    setSearch('laptop');
    await vi.advanceTimersByTimeAsync(500);
    expect(response.observed).toBe(false);

    const products = [{ id: 1, title: 'Laptop', description: 'A laptop' }];
    latestResponse.next({ products });
    fixture.detectChanges();
    expect(component.products()).toEqual(products);
    expect(fixture.nativeElement.querySelector('h4').textContent).toBe('Laptop');

    fixture.destroy();
    expect(latestResponse.observed).toBe(false);
  });

  it('searches with an empty term when the input is cleared', async () => {
    setSearch('phone');
    await vi.advanceTimersByTimeAsync(500);
    setSearch('');
    await vi.advanceTimersByTimeAsync(500);
    expect(searchProducts).toHaveBeenLastCalledWith('');
  });

  it('continues searching after an API error', async () => {
    const logError = vi.spyOn(console, 'error').mockImplementation(() => {});
    setSearch('phone');
    await vi.advanceTimersByTimeAsync(500);
    const error = new Error('Search failed');
    response.error(error);
    expect(logError).toHaveBeenCalledWith('Product search failed:', error);

    const nextResponse = new Subject<ProductsResponse>();
    searchProducts.mockReturnValue(nextResponse);
    setSearch('laptop');
    await vi.advanceTimersByTimeAsync(500);
    const products = [{ id: 2, title: 'Laptop', description: 'A laptop' }];
    nextResponse.next({ products });
    expect(component.products()).toEqual(products);
  });
});
