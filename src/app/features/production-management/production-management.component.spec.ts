import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionManagementComponent } from './production-management.component';

describe('ProductionManagementComponent', () => {
  let component: ProductionManagementComponent;
  let fixture: ComponentFixture<ProductionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductionManagementComponent]
    });
    fixture = TestBed.createComponent(ProductionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
