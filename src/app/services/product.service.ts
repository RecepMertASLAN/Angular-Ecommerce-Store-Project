import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private categoryUrl = 'http://localhost:8080/api/product-category';
  private baseUrl = "http://localhost:8080/api/products"

  constructor(private httpClient: HttpClient) { }

  // Get Products by Category Id
  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  // For Pagination Support
  getProductListPagination(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(response => response._embedded.productCategory))
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  // For Pagination Search support
  searchProductListPagination(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProduct(productId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
