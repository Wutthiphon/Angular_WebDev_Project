import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";
import { TokenStorageService } from "../../services/token-storage.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import {
  SocialAuthService,
  GoogleLoginProvider,
} from "@abacritt/angularx-social-login";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  login_form: {
    username: string;
    password: string;
    remenber_me: boolean;
  } = {
      username: "",
      password: "",
      remenber_me: false,
    };

  is_error: boolean = false;
  is_load: boolean = false;

  forgot_password_dialog: boolean = false;
  forgot_password_dialog_data = {
    email: "",
    username: "",
  };

  constructor(
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private AuthServiceExternal: SocialAuthService,
    private router: Router
  ) {
    this.AuthServiceExternal.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.AuthServiceExternal.signOut();

    this.AuthServiceExternal.authState.subscribe((user) => {
      if (user) {
        let Google_UID = user.id;

        if (!this.tokenStorage.getToken()) {
          this.authService.login_google(Google_UID).subscribe(
            (api_res) => {
              this.tokenStorage.saveToken(api_res.accessToken);
              this.tokenStorage.saveUser(api_res);
              this.CheckisLogin();
            },
            (error) => {
              Swal.fire(
                "ข้อผิดพลาด!",
                error.error.message ||
                "เกิดข้อผิดพลาดในการเข้าสู่ระบบโปรดลองอีกครั้ง",
                "error"
              );
            }
          );
        }
      }
    });

    if (localStorage.getItem("remenber_me")) {
      this.login_form.username = localStorage.getItem("username") || "";
      this.login_form.password = localStorage.getItem("password") || "";
      this.login_form.remenber_me = true;
    }
    this.CheckisLogin();
  }

  CheckisLogin() {
    if (this.tokenStorage.getToken()) {
      this.AuthServiceExternal.signOut();

      let permission = this.tokenStorage.getUser().permission;
      if (!permission) {
        Swal.fire(
          "ข้อผิดพลาด!",
          "ไม่พบสิทธิ์การใช้งานใด ๆ ในบัญชีของคุณกรุณาติดต่อผู้ดูแลระบบ",
          "error"
        );
        this.tokenStorage.signOut();
        this.authService.updateLoginLogoutDetect();
      } else {
        this.router.navigateByUrl("/");
        this.authService.updateLoginLogoutDetect();
      }
    }
  }

  loginSubmit() {
    this.is_error = false;
    this.is_load = true;
    const { username, password, remenber_me } = this.login_form;
    if (username && password) {
      this.authService.login(username, password).subscribe(
        (res) => {
          // if login Success
          this.is_error = false;
          this.tokenStorage.saveToken(res.accessToken);
          this.tokenStorage.saveUser(res);
          // Save Remember Me
          if (remenber_me) {
            localStorage.setItem("remenber_me", "checked");
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
          } else {
            window.localStorage.removeItem("remenber_me");
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("password");
          }
          this.CheckisLogin();
          this.is_load = false;
        },
        (error) => {
          this.is_error = true;
          this.messageService.add({
            severity: "error",
            summary: "ข้อผิดพลาด",
            detail: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          });
          this.is_load = false;
        }
      );
    } else {
      this.is_error = true;
      this.messageService.add({
        severity: "error",
        summary: "ข้อผิดพลาด",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      this.is_load = false;
    }
  }

  forgotPassword() {
    this.forgot_password_dialog = true;
    this.forgot_password_dialog_data = {
      username: this.login_form.username ? this.login_form.username : "",
      email: "",
    };
  }

  forgotPasswordSubmit() {
    const { email, username } = this.forgot_password_dialog_data;
    if (email && username) {
      this.authService.forgot_password(username, email).subscribe(
        (res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "ส่งรหัสผ่านใหม่ไปยังอีเมล์ของคุณแล้ว",
          });
          this.forgot_password_dialog = false;
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "ข้อผิดพลาด",
            detail: error.error.message,
          });
        }
      );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "ข้อผิดพลาด",
        detail: "กรุณากรอกชื่อผู้ใช้",
      });
    }
  }
}
