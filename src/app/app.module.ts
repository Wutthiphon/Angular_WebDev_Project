import { NgModule, LOCALE_ID } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
} from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { authInterceptorProviders } from "./services/helpers/auth.interceptor";
import { registerLocaleData } from "@angular/common";
import localeTH from "@angular/common/locales/th";
// Thai Language
registerLocaleData(localeTH, "th");

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// PrimeNG Modules
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { FileUploadModule } from "primeng/fileupload";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputNumberModule } from "primeng/inputnumber";
import { TabMenuModule } from "primeng/tabmenu";
import { StepsModule } from "primeng/steps";
import { AccordionModule } from "primeng/accordion";
import { PanelModule } from "primeng/panel";
import { ListboxModule } from "primeng/listbox";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { ToolbarModule } from "primeng/toolbar";
import { SplitButtonModule } from "primeng/splitbutton";
import { MenuModule } from "primeng/menu";
import { TieredMenuModule } from "primeng/tieredmenu";
import { SidebarModule } from "primeng/sidebar";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { CarouselModule } from "primeng/carousel";
import { GalleriaModule } from "primeng/galleria";
import { FieldsetModule } from "primeng/fieldset";
import { InputMaskModule } from "primeng/inputmask";
import { SliderModule } from "primeng/slider";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RatingModule } from "primeng/rating";
import { KeyFilterModule } from "primeng/keyfilter";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from "primeng/colorpicker";
import { InputSwitchModule } from "primeng/inputswitch";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { BlockUIModule } from "primeng/blockui";
import { PanelMenuModule } from "primeng/panelmenu";
import { AvatarModule } from "primeng/avatar";
import { BadgeModule } from "primeng/badge";
import { DividerModule } from "primeng/divider";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { SelectButtonModule } from "primeng/selectbutton";
import { MessageService } from "primeng/api";
import { ConfirmationService } from "primeng/api";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { ImageModule } from "primeng/image";
import { EditorModule } from "primeng/editor";

// Other
import { ImageCropperModule } from "ngx-image-cropper";

// Soical Login
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";

// Pipe
import { SafePipe, SafeHtmlPipe } from "./app-sanitizer-pipe";

// Components
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { Component404 } from "./errors/404/404.component";
import { MyCoursesComponent } from "./components/my-courses/my-courses.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { CourseComponent } from "./components/tutor/course/course.component";
import { AccountsComponent } from './components/admin/accounts/accounts.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    Component404,
    MyCoursesComponent,
    PaymentComponent,
    ProfileComponent,
    CourseComponent,
    // Pipe
    SafePipe,
    AccountsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    // Pipe
    SafeHtmlPipe,
    // PrimeNG
    MenubarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    TabViewModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    MultiSelectModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    InputNumberModule,
    TabMenuModule,
    StepsModule,
    AccordionModule,
    PanelModule,
    ListboxModule,
    TreeModule,
    TreeTableModule,
    ToolbarModule,
    SplitButtonModule,
    MenuModule,
    TieredMenuModule,
    SidebarModule,
    ScrollPanelModule,
    CarouselModule,
    GalleriaModule,
    FieldsetModule,
    InputMaskModule,
    SliderModule,
    ToggleButtonModule,
    RatingModule,
    KeyFilterModule,
    AutoCompleteModule,
    ChipsModule,
    ColorPickerModule,
    InputSwitchModule,
    VirtualScrollerModule,
    BlockUIModule,
    PanelMenuModule,
    AvatarModule,
    BadgeModule,
    DividerModule,
    OverlayPanelModule,
    MessagesModule,
    MessageModule,
    SelectButtonModule,
    SkeletonModule,
    TagModule,
    ImageModule,
    EditorModule,
    // Social Login
    SocialLoginModule,
    GoogleSigninButtonModule,
    // Other
    ImageCropperModule,
  ],
  providers: [
    authInterceptorProviders,
    { provide: LOCALE_ID, useValue: "th" },
    MessageService,
    ConfirmationService,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "268414927196-mfea0kpsja1jkp9tgldc3f9u6gvg2o97.apps.googleusercontent.com",
              {
                oneTapEnabled: false,
              }
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
