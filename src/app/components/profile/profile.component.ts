import { Component } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";
import Swal from "sweetalert2";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { TokenStorageService } from "../../services/token-storage.service";
import {
  SocialAuthService,
  GoogleLoginProvider,
} from "@abacritt/angularx-social-login";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  env = environment;
  gender_arr: any[] = [
    { label: "ไม่ระบุ", value: null },
    { label: "ชาย", value: "ชาย" },
    { label: "หญิง", value: "หญิง" },
  ];

  profile_form = {
    username: "",
    prefix: "",
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
  };

  isApiSaving: boolean = false;

  google_id: string = "";

  profile_image: string = "";

  imageCropDialog: boolean = false;
  imageCropData_imageChangedEvent: any = "";
  imageCropData_croppedImage: any = "";
  imageCropData_imageEncode: any = "";

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private AuthServiceExternal: SocialAuthService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {
    if (this.tokenStorage.getToken()) {
      this.loadProfile();
    } else {
      this.router.navigateByUrl("/login");
      return;
    }
  }

  SyncGoogleAccount(google_uid: string, google_email: string) {
    if (this.router.url == "/profile") {
      // Confirmaion Dialog
      if (this.google_id != google_uid) {
        this.confirmationService.confirm({
          header: "ยืนยันการผูกบัญชี Google กับระบบ",
          message:
            "ต้องการผูกบัญชี Google กับระบบด้วย <br>E-mail: <b>" +
            google_email +
            "</b><br>ใช่หรือไม่",
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.accountService
              .syncGoogleAccount(google_uid, google_email)
              .subscribe(
                (api_res) => {
                  this.messageService.add({
                    severity: "success",
                    summary: "ผูกบัญชี Google สำเร็จ",
                    detail:
                      "ผูกบัญชี Google กับ E-mail: " + google_email + " สำเร็จ",
                  });
                  this.loadProfile();
                  this.AuthServiceExternal.signOut();
                },
                (err) => {
                  this.messageService.add({
                    severity: "error",
                    summary: "ผูกบัญชี Google ไม่สำเร็จ",
                    detail: err.error.message,
                  });
                }
              );
          },
        });
      }
    }
  }

  unSyncGoogleAccount() {
    // Confirmaion Dialog
    this.confirmationService.confirm({
      message: "ยืนยัน",
      header: "ยืนยันการยกเลิกการผูกบัญชี Google กับระบบ",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.accountService.unsyncGoogleAccount().subscribe((api_res) => {
          this.messageService.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "ยกเลิกการผูกบัญชี Google สำเร็จ",
          });
          this.AuthServiceExternal.signOut();
          this.loadProfile();
        });
      },
    });
  }

  // Profile Image
  selectProfileImage(event: any) {
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

  uploadProfileImage() {
    this.accountService
      .updateProfileImage(this.imageCropData_imageEncode)
      .subscribe((res) => {
        this.messageService.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "แก้ไขภาพโปรไฟล์แล้ว",
        });
        this.loadProfile();
      });
    this.imageCropDialog = false;
  }

  // profile Data
  loadProfile() {
    this.accountService.getProfile().subscribe((res) => {
      if (res) {
        this.profile_image = res.image;
        this.google_id = res.google_id;
        this.profile_form = {
          username: res.username,
          prefix: res.prefix,
          firstname: res.first_name,
          lastname: res.last_name,
          email: res.email,
          gender: res.gender,
        };

        this.AuthServiceExternal.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.AuthServiceExternal.authState.subscribe((user) => {
          if (user) {
            let Google_UID = user.id;
            let Google_Email = user.email;

            this.SyncGoogleAccount(Google_UID, Google_Email);
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
        });
      }
    });
  }

  updateProfile() {
    const { prefix, firstname, lastname, email, gender } = this.profile_form;

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "รูปแบบอีเมลไม่ถูกต้อง",
      });
      return;
    }

    if(
      !prefix ||
      !firstname ||
      !lastname ||
      !email
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }

    this.isApiSaving = true;
    this.accountService
      .updateProfile(prefix, firstname, lastname, email, gender)
      .subscribe(
        (res) => {
          if (res) {
            this.tokenStorage.saveToken(res.accessToken);
            this.tokenStorage.saveUser(res);

            this.messageService.add({
              severity: "success",
              summary: "แก้ไขข้อมูลโปรไฟล์สำเร็จ",
              detail: "ข้อมูลโปรไฟล์ของคุณได้รับการแก้ไขเรียบร้อยแล้ว",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "เกิดข้อผิดพลาด",
              detail: "ไม่สามารถแก้ไขข้อมูลโปรไฟล์ได้",
            });
          }
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
}
