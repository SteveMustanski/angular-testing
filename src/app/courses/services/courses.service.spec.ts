import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";


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
    courcesService.findAllCourses()
      .subscribe(courses => {

        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'incorrect number of courses returned');

        const course = courses.find(course => course.id == 12);

        expect(course.titles.description).toBe('Angular Testing Course');

      });

      const req = httpTestingControler.expectOne('/api/courses');

      expect(req.request.method).toEqual('GET');

      // pass test data from courses to mock http request
      req.flush({payload: Object.values(COURSES)});
    });

  it('should find a course by id', () => {
      courcesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy('Couse not found');
        expect(course.id).toBe(12);
      });

      const req = httpTestingControler.expectOne('/api/courses/12');

      expect(req.request.method).toEqual('GET');

      req.flush(COURSES[12]);
    });

    it ('should save a course', () => {

      const changes :Partial<Course> = {titles:{description: 'Testing course'}}

      courcesService.saveCourse(12, changes)
        .subscribe(course => {
          expect(course.id).toBe(12);
        });

        const req = httpTestingControler.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        // responds with the original course 12 with changes applied on top
        req.flush({
          ...COURSES[12],
          ...changes
        })
    });

    it('should give error when save course fails', ()=> {

      const changes :Partial<Course> = {titles:{description: 'Testing course'}}

      courcesService.saveCourse(12, changes)
        .subscribe(
          () => fail('save course should have failed'),
          (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        );

        const req = httpTestingControler.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        req.flush('Save course failed', {status:500, statusText: 'Internal Server error'})
    });

    it('should find lessons', () => {
      courcesService.findLessons(12)
        .subscribe(lessons => {
          expect(lessons).toBeTruthy();
          expect(lessons.length).toBe(3);
        });

        const req = httpTestingControler.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual('GET');

        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('fileter')).toEqual(null);
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({
          payload: findLessonsForCourse(12).slice(0, 3)
        });
    })

  afterEach(() => {
    // verifies that only specified requests were executed
    httpTestingControler.verify();
  })
});
