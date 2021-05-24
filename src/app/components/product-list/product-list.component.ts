import { keyframes } from '@angular/animations';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousCategoryId: number = 1;
  previousKeyWord: string = null;

  /**
   * 
   * @param productService to use RESTFUL Services we need it
   * @param route is usefull when we need to access route parameters
   */
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    })

  }

  listProduct() {


    this.searchMode = this.route.snapshot.paramMap.has('keyword'); // Comes From Router where we set

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  // For Search Operation
  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword'); // getting the keyword user entered
    if (this.previousKeyWord != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyWord = theKeyword;
    this.productService.searchProductListPagination(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(
      this.processResult()
    )
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // convert the hasCategoryId to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;


    this.productService.getProductListPagination(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult())
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProduct();
  }

}
