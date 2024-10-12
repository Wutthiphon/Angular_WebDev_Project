import { Component } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { TokenStorageService } from "../../services/token-storage.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  prefix_arr: any[] = [
    { label: "นาย", value: "นาย" },
    { label: "นาง", value: "นาง" },
    { label: "นางสาว", value: "นางสาว" },
  ];

  gender_arr: any[] = [
    { label: "ไม่ระบุ", value: null },
    { label: "ชาย", value: "ชาย" },
    { label: "หญิง", value: "หญิง" },
  ];

  permission_arr: any[] = [
    { label: "นักเรียน", value: 1 },
    { label: "ผู้สอน", value: 2 },
  ];

  register_form: {
    username: string;
    password: string;
    password_confirm: string;
    email: string;
    prefix: string | null;
    firstname: string;
    lastname: string;
    gender: string | null;
    permission_id: number | null;
  } = {
    username: "",
    password: "",
    password_confirm: "",
    email: "",
    prefix: null,
    firstname: "",
    lastname: "",
    gender: null,
    permission_id: 1,
  };

  is_load: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.CheckisLogin();
  }

  CheckisLogin() {
    if (this.tokenStorage.getToken()) {
      let permission = this.tokenStorage.getUser().permission;
      if (!permission) {
        Swal.fire(
          "ข้อผิดพลาด!",
          "ไม่พบสิทธิ์การใช้งานใด ๆ ในบัญชีของคุณกรุณาติดต่อผู้ดูแลระบบ",
          "error"
        );
        this.tokenStorage.signOut();
      } else {
        this.router.navigateByUrl("/");
      }
    }
  }

  registerSubmit() {
    const {
      username,
      password,
      password_confirm,
      email,
      prefix,
      firstname,
      lastname,
      gender,
      permission_id,
    } = this.register_form;

    if (
      username &&
      password &&
      password_confirm &&
      email &&
      prefix &&
      firstname &&
      lastname &&
      permission_id
    ) {
      if (!/^[A-Za-z0-9]+$/.test(username)) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail:
            "ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษและตัวเลข โดยไม่มีช่องว่าง เท่านั้น",
        });
        return;
      }

      if (password.length < 8 || password_confirm.length < 8) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "รหัสผ่านต้องมากกว่า 8 ตัวอักษร",
        });
        return;
      }
      if (password != password_confirm) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "รหัสผ่านไม่ตรงกัน",
        });
        return;
      }

      this.confirmationService.confirm({
        icon: "pi pi-exclamation-triangle",
        header: "ยืนยันการสมัครสมาชิก ?",
        message: "กรุณายืนยันการสมัครสมาชิก",
        accept: () => {
          this.is_load = true;
          this.authService
            .register(
              username,
              password,
              password_confirm,
              email,
              prefix,
              firstname,
              lastname,
              gender ? gender : "ไม่ระบุ",
              permission_id
            )
            .subscribe(
              (res) => {
                Swal.fire({
                  icon: "success",
                  title: "สมัครสมาชิกสำเร็จ",
                  text: "ระบบจะทำการเข้าสู่ระบบ",
                }).then(() => {
                  // Save Token
                  this.tokenStorage.saveToken(res.accessToken);
                  this.tokenStorage.saveUser(res);
                  this.CheckisLogin();
                  this.is_load = false;
                  this.authService.updateLoginLogoutDetect();
                });
              },
              (err) => {
                Swal.fire({
                  icon: "error",
                  title: "เกิดข้อผิดพลาด",
                  text: err.error.message,
                });
                this.is_load = false;
              }
            );
        },
        reject: () => {},
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }
  }
}
