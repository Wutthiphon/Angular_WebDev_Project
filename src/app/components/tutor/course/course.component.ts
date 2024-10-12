import { Component } from "@angular/core";
import { CoursesService } from "../../../services/courses.service";
import { TokenStorageService } from "../../../services/token-storage.service";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { Router, ActivatedRoute } from "@angular/router";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { environment } from "../../../../environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrl: "./course.component.scss",
})
export class CourseComponent {
  api_url = environment.apiURL;
  isLoad: boolean = true;
  isApiSaving: boolean = false;

  menu_items: any[] = [
    { label: "ข้อมูลคอร์ส", icon: "pi pi-fw pi-home" },
    { label: "ผู้สมัครในคอร์ส", icon: "pi pi-fw pi-home" },
    { label: "บทเรียน", icon: "pi pi-fw pi-home" },
    { label: "แบบทดสอบ", icon: "pi pi-fw pi-home" },
  ];
  menu_items_active: any = this.menu_items[0];

  select_course: any = {};
  select_course_info = {
    course_id: 0,
    course_name: "",
    course_description: "",
    course_have_price: false,
    cover_image: "./assets/cover/null-cover.png",
    payment_image: "./assets/cover/null-money-cover.png",
    course_price: null,
    register_user: [],
  };

  view_receipt_dialog: boolean = false;
  view_receipt_dialog_img: any | null = null;

  reject_comment_dialog: boolean = false;
  reject_comment_reg_id: number = 0;
  reject_comment: string = "";

  create_lesson_dialog: boolean = false;
  create_lesson_data = {
    lesson_name: "",
  };

  edit_lesson_dialog: boolean = false;
  edit_lesson_data = {
    lesson_id: <number | null>null,
    lesson_name: "",
  };

  isLoad_lesson: boolean = true;
  lesson_array: any[] = [];

  select_lesson_id: number | null = 0;

  chapter_array = {
    lesson_name: "",
    lesson_chapter: <any>[],
  };

  chapter_data_type: any[] = [
    { label: "วิดีโอ Youtube", value: 1 },
    { label: "เนื้อหา", value: 2 },
  ];

  create_chapter_dialog: boolean = false;
  create_chapter_data = {
    content_name: "",
    content_data: "",
    content_type: null, // 1 = video, 2 = html
  };

  view_chapter_dialog: boolean = false;
  view_chapter_data = {
    chapter_id: <number | null>null,
    content_name: "",
    content_data: "",
    content_type: null, // 1 = video, 2 = html
    edit: false,
  };

  isLoad_exam: boolean = true;
  exam_lesson_array: any[] = [];
  exam_array: any = [];

  select_exam_lesson_id: number | null = 0;
  select_exam_id: number | null = 0;
  select_exam_name: string = "";

  create_exam_dialog: boolean = false;
  create_exam_data = {
    exam_name: "",
    lesson_id: <number | null>null,
  };

  exam_problem_array: any = [];

  edit_exam_dialog: boolean = false;
  edit_exam_data = {
    exam_name: "",
  };

  view_reg_exam_score_dialog: boolean = false;
  view_reg_exam_score_dialog_isLoad: boolean = true;
  view_reg_exam_score_data = {
    reg_name: "",
    exam_lesson: <any>[],
  };

  // Image Crop
  imageCropDialog: boolean = false;
  imageCropData_imageChangedEvent: any = "";
  imageCropData_croppedImage: any = "";
  imageCropData_imageEncode: any = "";
  imageCropData_type: string = "create";

  constructor(
    private coursesService: CoursesService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    if (this.tokenStorage.getToken()) {
      let permission = this.tokenStorage.getUser().permission;
      if (permission != 2 && permission != 3) {
        this.router.navigateByUrl("/login");
      } else {
        this.loadCourses();
      }
    } else {
      this.router.navigateByUrl("/login");
      return;
    }
  }

  loadCourses() {
    // get param course_id
    let course_id = this.route.snapshot.paramMap.get("id");
    this.coursesService.getCourseByID(Number(course_id)).subscribe(
      (res) => {
        this.select_course_info = {
          course_id: res.course_id,
          course_name: res.course_name,
          course_description: res.course_description,
          course_have_price: res.course_visibility,
          course_price: res.cost,
          cover_image: res.image,
          payment_image: res.img_account,
          register_user: res.course_reg,
        };
        this.isLoad = false;

        if (this.menu_items_active == this.menu_items[2]) {
          this.loadLesson();
        } else if (this.menu_items_active == this.menu_items[3]) {
          this.loadExam();
        }
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "คุณไม่มีสิทธิ์ในการจัดการคอร์สนี้",
        }).then(() => {
          this.router.navigateByUrl("/my-courses");
        });
      }
    );
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
          if (this.imageCropData_type == "edit") {
            this.select_course_info.cover_image = api_res.image;
          } else if (this.imageCropData_type == "payment_edit") {
            this.select_course_info.payment_image = api_res.image;
          }
        }
      });
    this.imageCropDialog = false;
  }

  editCourseSubmit() {
    this.confirmationService.confirm({
      icon: "pi pi-exclamation-triangle",
      header: "ยืนยัน",
      message: "ยืนยันการแก้ไขคอร์ส",
      accept: () => {
        const {
          course_id,
          course_name,
          course_description,
          course_have_price,
          cover_image,
          course_price,
          payment_image,
        } = this.select_course_info;
        this.coursesService
          .updateCourse(
            course_id,
            course_name,
            course_description,
            course_have_price,
            cover_image == "./assets/cover/null-cover.png" ? null : cover_image,
            course_price,
            payment_image
          )
          .subscribe(
            (api_res) => {
              if (api_res.status == true) {
                this.messageService.add({
                  severity: "success",
                  summary: "สำเร็จ",
                  detail: "แก้ไขคอร์สสำเร็จ",
                });
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

  openReceiptDialog(transfer_document: any) {
    this.view_receipt_dialog = true;
    this.view_receipt_dialog_img = transfer_document;
  }

  onApproveRegisterCourse(reg_id: number) {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการอนุมัติการลงทะเบียน",
      accept: () => {
        this.coursesService.teacherApproveStudentRegistration(reg_id).subscribe(
          (res) => {
            this.messageService.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "อนุมัติการลงทะเบียนสำเร็จ",
            });
            this.loadCourses();
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

  onRejectRegisterCourse(reg_id: number) {
    this.reject_comment_dialog = true;
    this.reject_comment_reg_id = reg_id;
    this.reject_comment = "";
  }

  onRejectRegisterCourseSubmit() {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการปฏิเสธการลงทะเบียน",
      accept: () => {
        this.coursesService
          .teacherRejectStudentRegistration(
            this.reject_comment_reg_id,
            this.reject_comment
          )
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ปฏิเสธการลงทะเบียนสำเร็จ",
              });
              this.reject_comment_dialog = false;
              this.reject_comment_reg_id = 0;
              this.reject_comment = "";
              this.loadCourses();
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

  loadLesson() {
    this.isLoad_lesson = true;
    this.select_lesson_id = null;
    this.lesson_array = [];

    this.coursesService
      .getCourseLesson(this.select_course_info.course_id)
      .subscribe(
        (res) => {
          this.lesson_array = res.courseLesson;
          this.isLoad_lesson = false;
        },
        (err) => {
          this.isLoad_lesson = false;
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลบทเรียนได้",
          });
        }
      );
  }

  onCreateLesson() {
    this.create_lesson_dialog = true;
    this.create_lesson_data = {
      lesson_name: "",
    };
  }

  onSubmitCreateLesson() {
    this.isApiSaving = true;
    this.coursesService
      .createLesson(
        this.select_course_info.course_id,
        this.create_lesson_data.lesson_name
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "สร้างบทเรียนสำเร็จ",
          });
          this.create_lesson_dialog = false;
          this.create_lesson_data = {
            lesson_name: "",
          };
          this.loadLesson();
          this.isApiSaving = false;
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: err.error.message,
          });
          this.isApiSaving = false;
        }
      );
  }

  onSelectLesson(lesson_id: number) {
    this.isLoad_lesson = true;
    this.select_lesson_id = lesson_id;

    this.coursesService.getCourseLessonChapter(lesson_id).subscribe(
      (res) => {
        this.isLoad_lesson = false;
        this.chapter_array = {
          lesson_name: res.lesson_name,
          lesson_chapter: res.lesson_chapter,
        };
      },
      (err) => {
        this.isLoad_lesson = false;
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลบทเรียนได้",
        });
      }
    );
  }

  onEditLesson() {
    this.edit_lesson_dialog = true;
    this.edit_lesson_data = {
      lesson_id: this.select_lesson_id,
      lesson_name: this.chapter_array.lesson_name,
    };
  }

  onSubmitEditLesson() {
    this.isApiSaving = true;
    const { lesson_id, lesson_name } = this.edit_lesson_data;

    this.coursesService.editLesson(lesson_id as number, lesson_name).subscribe(
      (res) => {
        this.messageService.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "แก้ไขชื่อบทเรียนสำเร็จ",
        });
        this.edit_lesson_dialog = false;
        this.edit_lesson_data = {
          lesson_id: null,
          lesson_name: "",
        };
        this.onSelectLesson(this.select_lesson_id as number);
        this.isApiSaving = false;
      },
      (err) => {
        this.messageService.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: err.error.message,
        });
        this.isApiSaving = false;
      }
    );
  }

  onDeleteLesson() {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการลบบทเรียน",
      accept: () => {
        this.coursesService
          .deleteLesson(this.select_lesson_id as number)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ลบบทเรียนสำเร็จ",
              });
              this.loadLesson();
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

  onBackToLesson() {
    this.select_lesson_id = null;
    this.loadLesson();
  }

  onAddContent() {
    this.create_chapter_dialog = true;
    this.create_chapter_data = {
      content_name: "",
      content_data: "",
      content_type: null,
    };
  }

  onSubmitAddContent() {
    this.isApiSaving = true;
    const { content_name, content_data, content_type } =
      this.create_chapter_data;
    if (content_type == null || content_name == "" || content_data == "") {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      this.isApiSaving = false;
      return;
    }

    this.coursesService
      .createCourseLessonChapter(
        this.select_lesson_id as number,
        content_name,
        content_data,
        content_type
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "เพิ่มบทเรียนสำเร็จ",
          });
          this.isApiSaving = false;
          this.create_chapter_dialog = false;
          this.create_chapter_data = {
            content_name: "",
            content_data: "",
            content_type: null,
          };
          this.onSelectLesson(this.select_lesson_id as number);
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: err.error.message,
          });
          this.isApiSaving = false;
        }
      );
  }

  onViewContent(chapter_id: number) {
    let find_content_type = this.chapter_array.lesson_chapter.find(
      (x: any) => x.lesson_chapter_id == chapter_id
    );

    if (find_content_type) {
      this.view_chapter_data = {
        chapter_id: find_content_type.lesson_chapter_id,
        content_name: find_content_type.content_name,
        content_data: find_content_type.content_data,
        content_type: find_content_type.content_type,
        edit: false,
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

  onEditContent() {
    this.view_chapter_data.edit = !this.view_chapter_data.edit;
  }

  onUpdateContent() {
    this.coursesService
      .editCourseLessonChapter(
        this.view_chapter_data.chapter_id as number,
        this.view_chapter_data.content_name,
        this.view_chapter_data.content_data,
        this.view_chapter_data.content_type
      )
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "แก้ไขบทเรียนสำเร็จ",
          });

          let find_content_type = this.chapter_array.lesson_chapter.find(
            (x: any) => x.lesson_chapter_id == this.view_chapter_data.chapter_id
          );
          find_content_type.content_name = this.view_chapter_data.content_name;
          find_content_type.content_data = this.view_chapter_data.content_data;
          find_content_type.content_type = this.view_chapter_data.content_type;

          this.onViewContent(this.view_chapter_data.chapter_id as number);
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

  onDeleteContent() {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการลบบทเรียน",
      accept: () => {
        this.coursesService
          .deleteCourseLessonChapter(
            this.view_chapter_data.chapter_id as number
          )
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ลบบทเรียนสำเร็จ",
              });
              this.view_chapter_dialog = false;
              this.onSelectLesson(this.select_lesson_id as number);
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

  loadExam() {
    this.isLoad_exam = true;
    this.select_exam_id = null;
    this.exam_array = [];
    this.select_exam_lesson_id = null;
    this.exam_lesson_array = [];

    this.coursesService
      .getCourseLesson(this.select_course_info.course_id)
      .subscribe(
        (res) => {
          this.exam_lesson_array = res.courseLesson;
          this.isLoad_exam = false;
        },
        (err) => {
          this.isLoad_exam = false;
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลบทเรียนได้",
          });
        }
      );
  }

  onCreateExamTest() {
    this.create_exam_dialog = true;
    this.create_exam_data = {
      exam_name: "",
      lesson_id: this.select_exam_lesson_id ? this.select_exam_lesson_id : null,
    };
  }

  onSubmitCreateExam() {
    this.isApiSaving = true;
    const { exam_name, lesson_id } = this.create_exam_data;

    if (exam_name && lesson_id) {
      this.coursesService
        .createCourseExamLesson(
          this.select_course_info.course_id,
          lesson_id as number,
          exam_name
        )
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "สร้างแบบทดสอบสำเร็จ",
            });
            this.create_exam_dialog = false;
            this.create_exam_data = {
              exam_name: "",
              lesson_id: null,
            };
            this.select_exam_lesson_id = this.select_exam_lesson_id == null ? lesson_id : this.select_exam_lesson_id;
            this.loadLessonExam();
            this.isApiSaving = false;
          },
          (err) => {
            this.messageService.add({
              severity: "error",
              summary: "เกิดข้อผิดพลาด",
              detail: err.error.message,
            });
            this.isApiSaving = false;
          }
        );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      this.isApiSaving = false;
    }
  }

  loadLessonExam() {
    this.isLoad_exam = true;
    this.select_exam_id = null;

    this.coursesService
      .getCourseExamLesson(this.select_exam_lesson_id)
      .subscribe(
        (res) => {
          this.isLoad_exam = false;
          this.exam_array = res;
        },
        (err) => {
          this.isLoad_exam = false;
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลแบบทดสอบได้",
          });
        }
      );
  }

  onSelectExam(exam_id: number) {
    this.isLoad_exam = true;
    this.select_exam_id = exam_id;

    if (this.select_exam_id) {
      this.select_exam_name = this.exam_array.find(
        (item: any) => item.exam_id == exam_id
      ).exam_name;

      this.coursesService.getCourseExamByID(this.select_exam_id).subscribe(
        (res) => {
          this.exam_problem_array = res;

          if (this.exam_problem_array.length == 0) {
            this.onAddProblem();
          } else {
            this.exam_problem_array.map((problem: any) => {
              problem.correct_choice = problem.course_exam_choices.find(
                (choice: any) => choice.choices_id == problem.correct_choice
              );
              problem.choices = problem.course_exam_choices;
            });
          }
          this.isLoad_exam = false;
        },
        (err) => {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลแบบทดสอบได้",
          });
        }
      );
    }
  }

  onBackToLessonExam() {
    this.loadLessonExam();
  }

  onAddProblem() {
    this.exam_problem_array.push({
      problem_name: "",
      correct_choice: null,
      choices: [{ label: "" }],
    });
  }

  onAddChoice(index: number) {
    this.exam_problem_array[index].choices.push({
      label: "",
    });
  }

  onDeleteChoice(index: number, choice_index: number) {
    this.exam_problem_array[index].choices.splice(choice_index, 1);
  }

  onDeleteProblem(index: number) {
    this.exam_problem_array.splice(index, 1);
  }

  onSubmitExamTest() {
    if (
      this.exam_problem_array.filter((item: any) => item.problem_name == "")
        .length > 0
    ) {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณากรอกข้อคำถาม",
      });
      return;
    }

    if (
      this.exam_problem_array.filter((item: any) => item.correct_choice == null)
        .length > 0
    ) {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณาเลือกคำตอบที่ถูกต้อง",
      });
      return;
    }

    if (
      this.exam_problem_array.filter(
        (item: any) =>
          item.choices.filter((choice: any) => choice.label == "").length > 0
      ).length > 0
    ) {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณากรอกข้อคำตอบ",
      });
      return;
    }

    this.exam_problem_array.map((problem: any) => {
      let choice_label: any = [];
      problem.choices.map((choice: any) => {
        if (choice_label.includes(choice.label)) {
          this.messageService.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: "มีคำตอบซ้ำกัน",
          });
          return;
        }
        choice_label.push(choice.label);
      });
    });

    let answer: any = JSON.parse(JSON.stringify(this.exam_problem_array));
    answer.map((problem: any) => {
      problem.correct_choice = problem.choices.findIndex(
        (item: any) => item.label == problem.correct_choice.label
      );
    });

    this.coursesService
      .createCourseExamQuestion(this.select_exam_id, answer)
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "สร้างแบบทดสอบสำเร็จ",
          });
          this.onSelectExam(this.select_exam_id as number);
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

  onEditLessonExam() {
    this.edit_exam_dialog = true;
    this.edit_exam_data = {
      exam_name: this.select_exam_name,
    };
  }

  onSubmitEditExam() {
    this.isApiSaving = true;
    const { exam_name } = this.edit_exam_data;

    if (exam_name) {
      this.coursesService
        .editCourseExamLesson(this.select_exam_id as number, exam_name)
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "แก้ไขแบบทดสอบสำเร็จ",
            });
            this.edit_exam_dialog = false;
            this.edit_exam_data = {
              exam_name: "",
            };
            this.onSelectExam(this.select_exam_id as number);
            this.select_exam_name = exam_name;
            this.isApiSaving = false;
          },
          (err) => {
            this.messageService.add({
              severity: "error",
              summary: "เกิดข้อผิดพลาด",
              detail: err.error.message,
            });
            this.isApiSaving = false;
          }
        );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      this.isApiSaving = false;
    }
  }

  onDeleteLessonExam() {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการลบแบบทดสอบ",
      accept: () => {
        this.coursesService
          .deleteCourseExamLesson(this.select_exam_id as number)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ลบแบบทดสอบสำเร็จ",
              });
              this.onBackToLessonExam();
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

  calculateColor(score: number, total: number) {
    let percent = (score / total) * 100;
    if (percent >= 80) {
      return "green";
    } else if (percent >= 60) {
      return "yellow";
    } else {
      return "red";
    }
  }

  onViewExamTest(reg: any) {
    this.view_reg_exam_score_dialog_isLoad = true;
    this.view_reg_exam_score_data = {
      reg_name:
        reg.users_account.prefix +
        reg.users_account.first_name +
        " " +
        reg.users_account.last_name,
      exam_lesson: [],
    };

    this.coursesService.teacherGetStudentScore(reg.registration_id).subscribe(
      (res) => {
        this.view_reg_exam_score_dialog = true;
        this.view_reg_exam_score_dialog_isLoad = false;
        this.view_reg_exam_score_data.exam_lesson = res;
      },
      (err) => {
        this.view_reg_exam_score_dialog_isLoad = false;
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลคะแนนได้",
        });
      }
    );
  }

  onApproveCompletionCourse(reg_id: number) {
    this.confirmationService.confirm({
      header: "ยืนยัน",
      icon: "pi pi-exclamation-triangle",
      message: "ยืนยันการอนุมัติการเรียนจบ",
      accept: () => {
        this.coursesService
          .teacherApproveStudentCompletion(reg_id)
          .subscribe((res) => {
            this.messageService.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "อนุมัติการเรียนจบสำเร็จ",
            });
            this.loadCourses();
          },(err)=> {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: err.error.message,
            });
          });
      },
    });
  }

  onDeleteCourse() {
    Swal.fire({
      title: "ลบคอร์ส ?",
      text: "ยืนยันการลบคอร์ส หากลบคอร์สจะไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmationService.confirm({
          header: "คุณแน่ใจใช่หรือไม่ ?",
          icon: "pi pi-exclamation-triangle",
          message: "ยืนยันการลบคอร์ส หากลบคอร์สจะไม่สามารถกู้คืนได้",
          accept: () => {
            this.coursesService
              .teacherDeleteCourse(this.select_course_info.course_id)
              .subscribe(
                (res) => {
                  this.messageService.add({
                    severity: "success",
                    summary: "สำเร็จ",
                    detail: "ลบคอร์สสำเร็จ",
                  });
                  this.router.navigateByUrl("/my-courses");
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
    });
  }

  // Page Control
  onActiveItemChange(event: any) {
    this.menu_items_active = event;

    if (this.menu_items_active == this.menu_items[2]) {
      this.loadLesson();
    } else if (this.menu_items_active == this.menu_items[3]) {
      this.loadExam();
    }
  }
}
