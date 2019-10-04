import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CircleCloudComponent } from './circle-cloud/circle-cloud.component';
import { MainBlockComponent } from './main-block/main-block.component';

@NgModule({
  declarations: [
    AppComponent,
    CircleCloudComponent,
    MainBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
