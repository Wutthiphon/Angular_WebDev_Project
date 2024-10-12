import { Observable, ReplaySubject, Subject, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenStorageService } from "../services/token-storage.service";
import { environment } from "../../environments/environment";

const AUTH_API = environment.apiURL + "/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private LoginLogoutDetect: Subject<boolean> = new ReplaySubject<boolean>(0);

  constructor(private http: HttpClient, private token: TokenStorageService) {}

  register(
    username: string,
    password: string,
    password_confirm: string,
    email: string,
    prefix: string,
    firstname: string,
    lastname: string,
    gender: string,
    permission_id: number
  ): Observable<any> {
    return this.http.post(
      AUTH_API + "register",
      {
        username: username,
        password: password,
        confirm_password: password_confirm,
        email: email,
        prefix: prefix,
        first_name: firstname,
        last_name: lastname,
        gender: gender,
        permission_id: permission_id,
      },
      httpOptions
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + "login",
      {
        username: username,
        password: password,
      },
      httpOptions
    );
  }

  login_google(google_id: string): Observable<any> {
    return this.http.post(
      AUTH_API + "login/google",
      {
        google_id: google_id,
      },
      httpOptions
    );
  }

  updateLoginLogoutDetect() {
    this.LoginLogoutDetect.next(true);
  }

  updateLoginLogoutChange(): Observable<boolean> {
    return this.LoginLogoutDetect.asObservable();
  }

  forgot_password(username: string, email: string): Observable<any> {
    return this.http.post(
      AUTH_API + "auth/forgotPassword",
      {
        username: username,
        email: email,
      },
      httpOptions
    );
  }
}
