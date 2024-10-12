import { Component } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { TokenStorageService } from "../../services/token-storage.service";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { Router } from "@angular/router";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { environment } from "../../../environments/environment";
import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

@Component({
  selector: "app-my-courses",
  templateUrl: "./my-courses.component.html",
  styleUrl: "./my-courses.component.scss",
})
export class MyCoursesComponent {
  api_url = environment.apiURL;
  isLoad: boolean = true;
  courseList: any[] = [];

  can_create: boolean = false;

  imageCropDialog: boolean = false;
  imageCropData_imageChangedEvent: any = "";
  imageCropData_croppedImage: any = "";
  imageCropData_imageEncode: any = "";
  imageCropData_type: string = "create";

  create_course_dialog: boolean = false;
  create_course_dialog_data = {
    course_name: "",
    course_description: "",
    course_have_price: false,
    cover_image: "./assets/cover/null-cover.png",
    payment_image: "./assets/cover/null-money-cover.png",
    course_price: null,
  };

  page: string = "my-courses"; // my-courses in-course
  select_course: any = {};

  menu_items: any[] = [
    { label: "บทเรียน", icon: "pi pi-fw pi-home" },
    { label: "แบบทดสอบ", icon: "pi pi-fw pi-home" },
  ];
  menu_items_active: any = this.menu_items[0];

  // Student
  student_course_content: any = {};
  student_select_lesson_id: number | null = null;
  student_select_lesson_name: string = "";
  student_select_lesson_array: any[] = [];
  isLoad_student_content: boolean = true;

  student_course_exam: any[] = [];
  student_select_exam_id: number | null = null;
  student_select_exam_name: string = "";
  student_select_exam_array: any[] = [];
  isLoad_student_exam: boolean = true;

  view_chapter_dialog: boolean = false;
  view_chapter_data = {
    chapter_id: <number | null>null,
    content_name: "",
    content_data: "",
    content_type: null, // 1 = video, 2 = html
  };

  constructor(
    private coursesService: CoursesService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    if (this.tokenStorage.getToken()) {
      let permission = this.tokenStorage.getUser().permission;
      switch (permission) {
        case 1:
          // Student
          this.can_create = false;
          break;
        case 2:
          // Teacher
          this.can_create = true;
          break;
        default:
          this.router.navigateByUrl("/login");
          break;
      }
      this.loadCourses();
    } else {
      this.router.navigateByUrl("/login");
      return;
    }
  }

  loadCourses() {
    this.coursesService.getMyCourse().subscribe((res) => {
      this.courseList = res;
      this.isLoad = false;
    });
  }

  // Teacher
  createCourse() {
    this.create_course_dialog = true;
    this.create_course_dialog_data = {
      course_name: "",
      course_description: "",
      course_have_price: false,
      cover_image: "./assets/cover/null-cover.png",
      payment_image: "./assets/cover/null-money-cover.png",
      course_price: null,
    };
  }

  selectCoverImage(event: any, type: string) {
    this.imageCropData_type = type;
    this.imageCropData_croppedImage = "";
    this.imageCropData_imageEncode = "";
    this.imageCropData_imageChangedEvent = event;
    if (event && event.target.files.length > 0) {
      this.imageCropDialog = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imageCropData_croppedImage = event.base64;
    this.imageCropData_imageEncode = this.base64ToFile(
      event.base64,
      this.imageCropData_imageChangedEvent.target.files[0].name
    );
    {
      {
      }
    }
  }

  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
  }
  loadImageFailed() {
    /* show message */
  }

  base64ToFile(data: any, filename: any) {
    const arr = data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  uploadCoverImage() {
    this.coursesService
      .update_course_image(this.imageCropData_imageEncode)
      .subscribe((api_res) => {
        if (api_res.status == true) {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "Upload รูปภาพสำเร็จ",
          });
          if (this.imageCropData_type == "create") {
            this.create_course_dialog_data.cover_image = api_res.image;
          } else if (this.imageCropData_type == "payment") {
            this.create_course_dialog_data.payment_image = api_res.image;
          }
        }
      });
    this.imageCropDialog = false;
  }

  createCourseSubmit() {
    const {
      course_name,
      course_description,
      course_have_price,
      cover_image,
      course_price,
    } = this.create_course_dialog_data;

    this.confirmationService.confirm({
      icon: "pi pi-exclamation-triangle",
      header: "ยืนยัน",
      message: "ยืนยันการสร้างคอร์ส",
      accept: () => {
        this.coursesService
          .createCourse(
            course_name,
            course_description,
            course_have_price,
            cover_image == "./assets/cover/null-cover.png" ? null : cover_image,
            course_price,
          )
          .subscribe(
            (api_res) => {
              if (api_res.status == true) {
                this.messageService.add({
                  severity: "success",
                  summary: "สำเร็จ",
                  detail: "Succes",
                });
                this.create_course_dialog = false;
                this.loadCourses();
              }
            },
            (error) => {
              this.messageService.add({
                severity: "error",
                summary: "เกิดข้อผิดพลาด",
                detail: error.error.message,
              });
            }
          );
      },
    });
  }

  // Student
  onOpenCourse(course: any) {
    this.select_course = course;
    this.goPage("in-course");
    this.getCourseByID(this.select_course);
  }

  getCourseByID(couse: any) {
    this.isLoad_student_content = true;
    this.coursesService.getCourseContent(couse.course_id).subscribe(
      (res) => {
        this.student_course_content = res;
        this.isLoad_student_content = false;

        if (this.menu_items_active == this.menu_items[1]) {
          this.loadCourseExamTest();
        }
      },
      (err) => {
        this.messageService.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: err.error.message,
        });
      }
    );
  }

  onOpenLesson(lesson_id: number) {
    this.student_select_lesson_id = lesson_id;
    this.isLoad_student_content = true;

    this.coursesService.studentGetChapters(lesson_id).subscribe(
      (res) => {
        this.student_select_lesson_name = res.lesson_name;
        this.student_select_lesson_array = res.lesson_chapter;
        this.isLoad_student_content = false;
      },
      (err) => {
        this.messageService.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: err.error.message,
        });
      }
    );
  }

  backToLesson() {
    this.student_select_lesson_id = null;
    this.student_select_lesson_name = "";
    this.student_select_lesson_array = [];
  }

  onViewContent(chapter_id: number) {
    let find_content_type = this.student_select_lesson_array.find(
      (x: any) => x.lesson_chapter_id == chapter_id
    );
    if (find_content_type) {
      this.view_chapter_data = {
        chapter_id: find_content_type.lesson_chapter_id,
        content_name: find_content_type.content_name,
        content_data: find_content_type.content_data,
        content_type: find_content_type.content_type,
      };
      if (this.view_chapter_data.content_type == 1) {
        // If url have watch?v= replace to embed/
        if (this.view_chapter_data.content_data.includes("watch?v=")) {
          this.view_chapter_data.content_data =
            this.view_chapter_data.content_data.replace("watch?v=", "embed/");
        }
        // If url is youtu.be replace to www.youtube.com/embed/
        if (this.view_chapter_data.content_data.includes("youtu.be")) {
          this.view_chapter_data.content_data =
            this.view_chapter_data.content_data.replace(
              "youtu.be",
              "www.youtube.com/embed"
            );
        }
      }
      this.view_chapter_dialog = true;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่พบข้อมูลบทเรียน",
      });
    }
  }

  loadCourseExamTest() {
    this.isLoad_student_exam = true;
    this.coursesService
      .studentGetCourseExam(this.student_course_content.course_id)
      .subscribe(
        (res) => {
          this.student_course_exam = res;
          this.isLoad_student_exam = false;
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: err.error.message,
          });
        }
      );
  }

  onSelectExam(exam_id: number | null, is_do: boolean) {
    if (is_do) {
      this.confirmationService.confirm({
        icon: "pi pi-exclamation-triangle",
        header: "ยืนยัน",
        message: "คุณเคยทำแบบทดสอบนี้แล้ว ต้องการทำใหม่หรือไม่?",
        accept: () => {
          this.student_select_exam_id = exam_id;
          this.onSubmitSelectExam();
        },
      });
    } else {
      this.student_select_exam_id = exam_id;

      this.onSubmitSelectExam();
    }
  }

  onSubmitSelectExam() {
    this.isLoad_student_exam = true;

    this.coursesService

      .studentGetExamQuestion(this.student_select_exam_id)
      .subscribe(
        (res) => {
          this.student_select_exam_name = res.exam_name;
          this.student_select_exam_array = res.course_exam_problem;
          this.isLoad_student_exam = false;

          this.student_select_exam_array.map((problem: any) => {
            problem.select_choice = null;
          });
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: err.error.message,
          });
        }
      );
  }

  onSubmitedExam() {
    if (
      this.student_select_exam_array.filter((x: any) => x.select_choice == null)
        .length > 0
    ) {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณาตอบคำถามให้ครบ",
      });
      return;
    }

    this.confirmationService.confirm({
      icon: "pi pi-exclamation-triangle",
      header: "ยืนยัน",
      message: "ยืนยันการส่งคำตอบ?",
      accept: () => {
        this.coursesService
          .studentSubmitAnswer(
            this.select_course.course_id,
            this.student_select_exam_id,
            this.student_select_exam_array
          )
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ส่งคำตอบสำเร็จ",
              });
              this.student_select_exam_array = [];
              this.student_select_exam_id = null;
              this.student_select_exam_name = "";
              this.loadCourseExamTest();
            },
            (err) => {
              this.messageService.add({
                severity: "error",
                summary: "เกิดข้อผิดพลาด",
                detail: err.error.message,
              });
            }
          );
      },
    });
  }

  backToExam() {
    this.student_select_exam_id = null;
    this.student_select_exam_name = "";
    this.student_select_exam_array = [];
  }

  async downloadCert() {
    const user_data = this.tokenStorage.getUser();
    const username = user_data.name;

    const tempate_file_url = "./assets/pdf_template/Certificate.pdf";
    const existingPdfBytes = await fetch(tempate_file_url).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const f_fonts_url = new URL(
      "./assets/fonts/THSarabun.ttf",
      window.location.href
    );
    const f_fonts_url2 = new URL(
      "./assets/fonts/THSarabun_Bold.ttf",
      window.location.href
    );
    const font_Bytes = await fetch(f_fonts_url).then((res) =>
      res.arrayBuffer()
    );
    const font_Bytes2 = await fetch(f_fonts_url2).then((res) =>
      res.arrayBuffer()
    );
    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(font_Bytes);
    const customFont2 = await pdfDoc.embedFont(font_Bytes2);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    const fontSize = 40;
    const textWidth = customFont2.widthOfTextAtSize(username, fontSize);
    firstPage.drawText(username, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font: customFont2,
    });

    firstPage.drawText(this.select_course.course_name, {
      x: 360,
      y: 222,
      size: 24,
      font: customFont2,
    });

    firstPage.drawText(
      this.select_course.users_account.prefix +
      this.select_course.users_account.first_name +
      " " +
      this.select_course.users_account.last_name,
      {
        x: 510,
        y: 135,
        size: 24,
        font: customFont2,
      }
    );

    const pdfBytes = await pdfDoc.save();
    this.saveByteArray("Certificate", pdfBytes);
  }

  // Page Control
  goPage(page: string) {
    this.page = page;
  }

  onActiveItemChange(event: any) {
    this.menu_items_active = event;

    if (this.menu_items_active == this.menu_items[0]) {
      this.backToLesson();
    } else if (this.menu_items_active == this.menu_items[1]) {
      this.loadCourseExamTest();
    }
  }

  saveByteArray(reportName: any, byte: any) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }
}
