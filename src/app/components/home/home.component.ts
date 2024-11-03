import { Component } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { AuthService } from "../../services/auth.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { environment } from "../../../environments/environment";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import Swal from "sweetalert2";
import { loadStripe } from '@stripe/stripe-js';
import { ActivatedRoute, Router } from "@angular/router";

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

  private stripePromise = loadStripe(environment.StripePublishableKey);

  constructor(
    private coursesService: CoursesService,
    private tokenStorage: TokenStorageService,
    private messageService: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.updateLoginLogoutChange().subscribe((res) => {
      if(!this.tokenStorage.getToken()) {
        this.can_register = false;
        this.can_manage = false;
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params['payment'] == 'success') {
        Swal.fire({
          title: "ชำระเงินสำเร็จ",
          icon: "success",
          text: "ระบบจะพาคุณไปยังหน้าคอร์สเรียนของฉัน",
        }).then(() => {
          this.router.navigate(['/my-courses'])
        })
      } else if (params['payment'] == 'reject') {
        Swal.fire({
          title: "ยกเลิกการชำระเงิน",
          icon: "warning",
          text: "กรุณาลองใหม่อีกครั้ง",
        }).then(() => {
          this.router.navigate(['/'])
        })
      }
    });

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

  getContinuityCourse(con_course_id: number) {
    let findCourse = this.courseList.find((f_course) => f_course.course_id == con_course_id);
    return findCourse ? findCourse.course_name : 0;
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
        if (course.course_visibility == 1) {
          Swal.fire({
            title: 'กำลังตรวจสอบข้อมูล',
            icon: 'info',
            text: 'กรุณารอสักครู่...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
          })

          this.coursesService.getCoursePrice(course).subscribe(async (res) => {
            let confirm_status = false
            if (res.status) {
              let result = await Swal.fire({
                title: 'คุณมีโปรโมชั่น ต้องการใช้หรือไม่ ?',
                icon: 'question',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `ใช้`,
                denyButtonText: `ไม่`,
                cancelButtonText: `ยกเลิก`,
              }).then((result) => {
                if (result.isConfirmed) {
                  confirm_status = true
                  return true
                } else if (result.isDenied) {
                  confirm_status = false
                  return false
                } else {
                  return;
                }
              })

              if (result == undefined) {
                Swal.close()
                return;
              }
            }

            Swal.fire({
              title: 'กำลังเปิดหน้าชำระเงิน',
              icon: 'info',
              text: 'กรุณารอสักครู่...',
              allowOutsideClick: false,
              allowEscapeKey: false,
              allowEnterKey: false,
              showConfirmButton: false,
            })
            this.coursesService.createCoursePayment(course, confirm_status).subscribe(async (res) => {
              await this.stripePromise.then((stripe) => {
                stripe ? stripe.redirectToCheckout({
                  sessionId: res.sessionId,
                }) : null;
              });
            }, (err) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "ไม่สามารถดึงข้อมูลราคาคอร์สได้: " + err.error.message,
              });
              Swal.close();
            });
          },
            (err) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "ไม่สามารถดึงข้อมูลราคาคอร์สได้: " + err.error.message,
              });
            })
        } else {
          this.coursesService.registerCourse(course.course_id).subscribe(
            async (res) => {
              Swal.fire({
                title: "ลงทะเบียนคอร์สเรียนสำเร็จ",
                icon: "success",
                text: "คุณสามารถเริ่มเรียนได้เลย ที่หน้าคอร์สเรียนของฉัน",
              });
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
        }
      },
    });
  }
}
