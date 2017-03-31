/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InventorySearchComponent } from './inventory-search.component';

describe('InventorySearchComponent', () => {
  let component: InventorySearchComponent;
  let fixture: ComponentFixture<InventorySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
