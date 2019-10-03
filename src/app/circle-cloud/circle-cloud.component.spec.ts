import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleCloudComponent } from './circle-cloud.component';

describe('CircleCloudComponent', () => {
  let component: CircleCloudComponent;
  let fixture: ComponentFixture<CircleCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
