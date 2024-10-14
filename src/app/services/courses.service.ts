import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

const API = environment.apiURL + "/course/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) { }

  update_course_image(image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", image);
    return this.http.post(environment.apiURL + "/img/upload/course", formData);
  }

  getCourseList(): Observable<any> {
    return this.http.get(API + "getCourse", httpOptions);
  }

  getMyCourse(): Observable<any> {
    return this.http.get(API + "mycourse", httpOptions);
  }

  getCourseByID(course_id: number): Observable<any> {
    return this.http.get(API + "getcourse/course/" + course_id, httpOptions);
  }

  getCourseContent(course_id: number): Observable<any> {
    return this.http.get(API + "lesson/content/" + course_id, httpOptions);
  }

  createCourse(
    course_name: string,
    course_description: string,
    course_have_price: boolean,
    cover_image: string | null,
    course_price: number | null,
    continuity: number | null
  ): Observable<any> {
    return this.http.post(
      API + "createCourse",
      {
        course_name: course_name,
        course_description: course_description,
        course_visibility: course_have_price,
        image: cover_image,
        cost: course_price,
        Continuity: continuity
      },
      httpOptions
    );
  }

  updateCourse(
    course_id: number,
    course_name: string,
    course_description: string,
    course_have_price: boolean,
    cover_image: string | null,
    course_price: number | null,
  ): Observable<any> {
    return this.http.post(
      API + "updateCourse",
      {
        course_id: course_id,
        course_name: course_name,
        course_description: course_description,
        course_visibility: course_have_price,
        image: cover_image,
        cost: course_price,
      },
      httpOptions
    );
  }

  registerCourse(course_id: number): Observable<any> {
    return this.http.post(
      API + "registerCourse",
      { course_id: course_id },
      httpOptions
    );
  }

  getCoursePrice(course: any): Observable<any> {
    return this.http.post(API + "payment/check_price", { course: course }, httpOptions);
  }

  createCoursePayment(course: any, use_promotion: boolean): Observable<any> {
    return this.http.post(
      API + "payment/createPayment",
      {
        course: course,
        use_promotion: use_promotion
      },
      httpOptions
    );
  }

  teacherApproveStudentRegistration(reg_id: number): Observable<any> {
    return this.http.post(
      API + "payment/approve",
      { registration_id: reg_id },
      httpOptions
    );
  }

  teacherRejectStudentRegistration(
    reg_id: number,
    comment: string
  ): Observable<any> {
    return this.http.post(
      API + "payment/reject",
      { registration_id: reg_id, comment: comment },
      httpOptions
    );
  }

  getCourseLesson(course_id: number): Observable<any> {
    return this.http.get(API + "lesson/" + course_id, httpOptions);
  }

  createLesson(course_id: number, lesson_name: string): Observable<any> {
    return this.http.post(
      API + "createLesson",
      { course_id: course_id, lesson_name: lesson_name },
      httpOptions
    );
  }

  editLesson(lesson_id: number, lesson_name: string): Observable<any> {
    return this.http.post(
      API + "updateLesson",
      { lesson_id: lesson_id, lesson_name: lesson_name },
      httpOptions
    );
  }

  deleteLesson(lesson_id: number): Observable<any> {
    return this.http.delete(
      API + "delete/course_lesson/" + lesson_id,
      httpOptions
    );
  }

  getCourseLessonChapter(lesson_id: number): Observable<any> {
    return this.http.get(API + "getCourseContent/" + lesson_id, httpOptions);
  }

  createCourseLessonChapter(
    lesson_id: number,
    content_name: string,
    content_data: string,
    content_type: number
  ): Observable<any> {
    return this.http.post(
      API + "createContent ",
      {
        lesson_id: lesson_id,
        content_name: content_name,
        content_data: content_data,
        content_type: content_type,
      },
      httpOptions
    );
  }

  editCourseLessonChapter(
    content_id: number,
    content_name: string,
    content_data: string,
    content_type: number | null
  ): Observable<any> {
    return this.http.post(
      API + "updateContent",
      {
        lesson_chapter_id: content_id,
        content_name: content_name,
        content_data: content_data,
        content_type: content_type,
      },
      httpOptions
    );
  }

  deleteCourseLessonChapter(content_id: number): Observable<any> {
    return this.http.delete(
      API + "delete/course_content/" + content_id,
      httpOptions
    );
  }

  createCourseExamLesson(
    course_id: number,
    lesson_id: number,
    exam_name: string
  ): Observable<any> {
    return this.http.post(
      API + "exam/createExam",
      {
        course_id: course_id,
        lesson_id: lesson_id,
        exam_name: exam_name,
      },
      httpOptions
    );
  }

  getCourseExamLesson(lesson_id: number | null): Observable<any> {
    return this.http.get(API + "getExam/" + lesson_id, httpOptions);
  }

  getCourseExamByID(exam_id: number | null): Observable<any> {
    return this.http.get(API + "exam/getExam/question/" + exam_id, httpOptions);
  }

  createCourseExamQuestion(
    exam_id: number | null,
    problem_array: any
  ): Observable<any> {
    return this.http.post(
      API + "createQuestion",
      {
        exam: {
          exam_id: exam_id,
          questions: problem_array,
        },
      },
      httpOptions
    );
  }

  editCourseExamLesson(
    exam_id: number | null,
    exam_name: string
  ): Observable<any> {
    return this.http.post(
      API + "exam/updateExam",
      { exam_id: exam_id, exam_name: exam_name },
      httpOptions
    );
  }

  deleteCourseExamLesson(exam_id: number | null): Observable<any> {
    return this.http.delete(API + "exam/deleteExam/" + exam_id, httpOptions);
  }

  studentGetChapters(lesson_id: number): Observable<any> {
    return this.http.get(
      API + "lesson/content_student/" + lesson_id,
      httpOptions
    );
  }

  studentGetCourseExam(course_id: number): Observable<any> {
    return this.http.get(API + "getExam_student/" + course_id, httpOptions);
  }

  studentGetExamQuestion(exam_id: number | null): Observable<any> {
    return this.http.get(API + "getQuestion_student/" + exam_id, httpOptions);
  }

  studentSubmitAnswer(
    course_id: number | null,
    exam_id: number | null,
    exam_array: any
  ): Observable<any> {
    return this.http.post(
      API + "exam/submitAnswer",
      {
        exam: {
          course_id: course_id,
          exam_id: exam_id,
          student_do_choice: exam_array,
        },
      },
      httpOptions
    );
  }

  teacherApproveStudentCompletion(reg_id: number | null): Observable<any> {
    return this.http.post(
      API + "completed",
      { registration_id: reg_id },
      httpOptions
    );
  }

  teacherGetStudentScore(reg_id: number | null): Observable<any> {
    return this.http.get(API + "score/getScore/" + reg_id, httpOptions);
  }

  teacherDeleteCourse(course_id: number | null): Observable<any> {
    return this.http.delete(API + "deleteCourse/" + course_id, httpOptions);
  }
}
