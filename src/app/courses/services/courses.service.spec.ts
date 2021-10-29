import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoursesService } from "./courses.service";


describe("CoursesService", () => {

  let courcesService: CoursesService;
  let httpTestingControler: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    courcesService = TestBed.inject(CoursesService);
    httpTestingControler = TestBed.inject(HttpTestingController);
  })

  it('should retrieve all courses', () => {
    
  });
});
