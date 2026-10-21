import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from './core/api/auth-api.service';
import { ProductsApiService } from './core/api/products-api.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('dummy-demo-web');
  private readonly authApiService = inject(AuthApiService);
  private readonly productsApiService = inject(ProductsApiService);

  ngOnInit() {
    /*this.productsApiService.getListProducts().subscribe({
      next: (res) => {
        console.log('Products fetched successfully:', res);
      },
      error: (error) => {
        console.log('error:', error);
      },
    });

    const mitaTuple = mita();

    const a: (string | number | boolean)[] = ['a', 'a', true, false, 1, 2];

    console.log(a);*/
  }

  /* protected login() {
    this.authApiService.login('emilys', 'emilyspass').subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }*/
}
