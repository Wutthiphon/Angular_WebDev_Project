import { Observable, ReplaySubject, Subject, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

const API_URL = environment.apiURL + "/profile/";

const USERS_API_URL = environment.apiURL + "/users/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private updateProfileDetect: Subject<boolean> = new ReplaySubject<boolean>(0);

  constructor(private http: HttpClient) {}

  getProfileImage(): Observable<any> {
    return this.http.get(API_URL + "get_img", httpOptions);
  }

  updateProfileImage(image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", image);
    return this.http
      .post(API_URL + "upload_img", formData)
      .pipe(tap(() => this.updateProfileDetect.next(true)));
  }

  updateProfileImageChange(): Observable<boolean> {
    return this.updateProfileDetect.asObservable();
  }

  getProfile(): Observable<any> {
    return this.http.get(API_URL + "getprofile", httpOptions);
  }

  updateProfile(
    prefix: string,
    firstname: string,
    lastname: string,
    email: string,
    gender: string
  ): Observable<any> {
    return this.http
      .post(
        API_URL + "updateProfile",
        {
          prefix: prefix,
          first_name: firstname,
          last_name: lastname,
          email: email,
          gender: gender,
        },
        httpOptions
      )
      .pipe(tap(() => this.updateProfileDetect.next(true)));
  }

  changePassword(old_password: string, new_password: string): Observable<any> {
    return this.http.post(
      API_URL + "updatePassword",
      {
        password: old_password,
        new_password: new_password,
      },
      httpOptions
    );
  }

  syncGoogleAccount(google_id: string, google_email: string): Observable<any> {
    return this.http.post(
      API_URL + "google",
      {
        google_id: google_id,
        google_email: google_email,
      },
      httpOptions
    );
  }

  unsyncGoogleAccount(): Observable<any> {
    return this.http.post(API_URL + "delete/google", httpOptions);
  }

  // Admin
  adminGetAccounts(): Observable<any> {
    return this.http.get(USERS_API_URL + "getUser", httpOptions);
  }

  adminAddAccount(
    username: string,
    prefix: string | null,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    password: string
  ): Observable<any> {
    return this.http.post(
      USERS_API_URL + "createUser",
      {
        username: username,
        prefix: prefix,
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        password: password,
      },
      httpOptions
    );
  }

  updateUserInfo(
    user_id: null | number,
    prefix: string,
    first_name: string,
    last_name: string,
    email: string,
    gender: string
  ): Observable<any> {
    return this.http.post(
      USERS_API_URL + "updateUser",
      {
        user_id: user_id,
        prefix: prefix,
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
      },
      httpOptions
    );
  }

  deleteUser(user_id: number): Observable<any> {
    return this.http.delete(
      USERS_API_URL + "deleteUser/" + user_id,
      httpOptions
    );
  }
}
