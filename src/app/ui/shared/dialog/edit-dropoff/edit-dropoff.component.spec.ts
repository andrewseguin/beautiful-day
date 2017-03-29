/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditDropoffComponent } from './edit-dropoff.component';

describe('EditDropoffComponent', () => {
  let component: EditDropoffComponent;
  let fixture: ComponentFixture<EditDropoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDropoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDropoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
