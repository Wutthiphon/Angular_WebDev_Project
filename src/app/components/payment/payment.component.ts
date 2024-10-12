import { Component } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.scss",
})
export class PaymentComponent {
  api_url = environment.apiURL;
  isLoad: boolean = true;
  courseList: any[] = [];
  activeIndexArr: any[] = [];

  selectedImage: any = null;

  constructor(
    private coursesService: CoursesService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) {
    if (this.tokenStorage.getToken()) {
      let permission = this.tokenStorage.getUser().permission;
      if (permission != 1) {
        this.router.navigateByUrl("/login");
      } else {
        this.loadCourses();
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  loadCourses() {
    this.coursesService.getMyCourse().subscribe((res) => {
      this.courseList = res
        .filter((course: any) => {
          return course.course_visibility;
        })
        .sort((a: any, b: any) => {
          return (
            a.course_reg[0].registration_status -
            b.course_reg[0].registration_status
          );
        });

      let not_registration_status = this.courseList.filter(
        (course: any, index: number) => {
          return (
            course.course_reg[0].registration_status == 1 ||
            course.course_reg[0].registration_status == 0
          );
        }
      );
      not_registration_status.map((course: any) => {
        this.activeIndexArr.push(this.courseList.indexOf(course));
      });

      console.log(this.courseList);

      this.isLoad = false;
    });
  }

  uploadSlipImage(event: any, course: any) {
    let selectedFile = event.target.files[0];

    if (selectedFile) {
      if (
        ["image/jpeg", "image/png", "image/svg+xml"].includes(selectedFile.type)
      ) {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(selectedFile);

        fileReader.addEventListener("load", (event) => {
          this.selectedImage = event.target?.result;
        });
      }
    }

    this.confirmationService.confirm({
      header: "ยืนยันการอัพโหลดหลักฐานการโอนเงิน",
      message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง ก่อนทำการอัพโหลดหลักฐานการโอนเงิน",
      accept: () => {
        this.coursesService
          .update_course_image(event.target.files[0])
          .subscribe((api_res) => {
            if (api_res.status == true) {
              this.coursesService
                .uploadSlipImage(
                  api_res.image,
                  course.course_reg[0].registration_id
                )
                .subscribe(() => {
                  this.messageService.add({
                    severity: "success",
                    summary: "สำเร็จ",
                    detail: "ยืนยันการชำระเงินสำเร็จ",
                  });
                  this.loadCourses();
                });
            }
          });
      },
    });
  }

  // Page Control
  getPaymentStatus(status: number, transfer_document: string) {
    switch (status) {
      case 1:
        if (!transfer_document) {
          return "รอการชำระเงิน";
        } else {
          return "รอการตรวจสอบ";
        }
      case 2:
        return "ชำระเงินแล้ว";
      default:
        return "รอการชำระเงิน";
    }
  }
}
