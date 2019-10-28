import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CircleCloudComponent } from "./circle-cloud/circle-cloud.component";
import { MainBlockComponent } from "./main-block/main-block.component";
import { TimerComponent } from "./timer/timer.component";
import { CookieService } from "ngx-cookie-service";

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    CircleCloudComponent,
    MainBlockComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMaskModule.forRoot(options)
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {}
