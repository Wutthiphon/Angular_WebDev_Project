import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { MyCoursesComponent } from "./components/my-courses/my-courses.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { CourseComponent } from "./components/tutor/course/course.component";

// Error pages
import { Component404 } from "./errors/404/404.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "my-courses", component: MyCoursesComponent },
  { path: "payment", component: PaymentComponent },
  { path: "profile", component: ProfileComponent },
  { path: "course/:id", component: CourseComponent },

  // 404 Page
  { path: "**", component: Component404 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
