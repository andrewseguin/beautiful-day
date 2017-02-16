/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {EditPurchaseStatusDialogComponent} from "./edit-purchase-status";

describe('EditPurchaseStatusDialogComponent', () => {
  let component: EditPurchaseStatusDialogComponent;
  let fixture: ComponentFixture<EditPurchaseStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPurchaseStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPurchaseStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
