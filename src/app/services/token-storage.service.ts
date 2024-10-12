import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import jwt_decode from "jwt-decode";
const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";
import { environment } from "../../environments/environment";

const AUTH_API = environment.apiURL + "/";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor(private route: Router, private http: HttpClient) {
    if (!!this.getToken()) {
      var token: any = jwt_decode(this.getToken() || "{}");
      if (Date.now() > token.exp * 1000) {
        this.signOut();
      }
    }
  }

  signOut(): void {
    this.http.post(AUTH_API + "logout", httpOptions);

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    this.route.navigateByUrl("/");
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
