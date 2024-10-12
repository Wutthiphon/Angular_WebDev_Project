import { Component } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { environment } from "../../../environments/environment";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  api_url = environment.apiURL;

  isLoad: boolean = true;
  courseList: any[] = [];
  myCourseList: any[] = [];

  can_register: boolean = false;
  can_manage: boolean = false;

  dialog_show_info_course: boolean = false;
  dialog_show_info_course_data: any = {};

  constructor(
    private coursesService: CoursesService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    if (this.tokenStorage.getToken()) {
      let permission = this.tokenStorage.getUser().permission;
      if (permission == 1) {
        this.can_register = true;
      } else if (permission == 3) {
        this.can_manage = true;
      }
    } else {
      this.can_register = false;
    }

    this.loadCourses();
  }

  loadCourses() {
    this.isLoad = true;
    this.coursesService.getCourseList().subscribe((res) => {
      this.courseList = res;
      this.isLoad = false;
    });

    if (this.tokenStorage.getToken()) {
      this.coursesService.getMyCourse().subscribe((res) => {
        this.myCourseList = res;

        this.courseList.map((course) => {
          this.myCourseList.map((myCourse) => {
            if (course.course_id == myCourse.course_id) {
              course.isRegister = true;
            }
          });
        });
      });
    }
  }

  onShowInfoCourseDialog(course: any) {
    this.dialog_show_info_course = true;
    this.dialog_show_info_course_data = course;
  }

  onRegisterCourse(course: any) {
    this.confirmationService.confirm({
      header: "ยืนยันการลงทะเบียน",
      icon: "pi pi-exclamation-triangle",
      message:
        "<b>คุณต้องการลงทะเบียนคอร์ส:</b> " +
        course.course_name +
        "<br>ใช่หรือไม่ ?<br>" +
        (course.course_visibility
          ? "<b class='text-danger'>(คอร์สเรียนนี้มีค่าใช้จ่าย)</b>"
          : ""),
      accept: () => {
        this.coursesService.registerCourse(course.course_id).subscribe(
          (res) => {
            if (res.registration_status == 1) {
              // Swal.fire({
              //   title: "คอร์สนี้เสียค่าใช้จ่าย",
              //   text: "ลงทะเบียนสำเร็จ ต้องการไปหน้าชำระเงินหรือไม่",
              //   icon: "question",
              //   showCancelButton: true,
              //   confirmButtonText: "ตกลง",
              //   cancelButtonText: "ยกเลิก",
              //   reverseButtons: true,
              // }).then((result) => {
              //   if (result.isConfirmed) {
              //     this.router.navigateByUrl("/payment");
              //   }
              // });
            } else if (res.registration_status == 2) {
              Swal.fire({
                title: "ลงทะเบียนคอร์สเรียนสำเร็จ",
                icon: "success",
                text: "คุณสามารถเริ่มเรียนได้เลย ที่หน้าคอร์สเรียนของฉัน",
              });
              this.loadCourses();
            }
            this.loadCourses();
          },
          (err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "ลงทะเบียนคอร์สเรียนไม่สำเร็จ: " + err.error.message,
            });
          }
        );
      },
    });
  }
}
