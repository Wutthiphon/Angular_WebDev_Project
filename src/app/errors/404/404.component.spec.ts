import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component404 } from './404.component';

describe('Component404', () => {
  let component: Component404;
  let fixture: ComponentFixture<Component404>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Component404]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Component404);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
