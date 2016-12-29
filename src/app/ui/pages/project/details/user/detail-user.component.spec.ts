/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetailUserComponent } from './detail-user.component';

describe('DetailUserComponent', () => {
  let component: DetailUserComponent;
  let fixture: ComponentFixture<DetailUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
