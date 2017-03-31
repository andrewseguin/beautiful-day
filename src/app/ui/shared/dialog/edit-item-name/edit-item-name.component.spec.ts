/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditItemNameComponent } from './edit-item-name.component';

describe('EditItemNameComponent', () => {
  let component: EditItemNameComponent;
  let fixture: ComponentFixture<EditItemNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
