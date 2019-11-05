import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { TelegramService } from "../shared/telegram.service";
import * as $ from "jquery";

@Component({
  selector: "app-main-block",
  templateUrl: "./main-block.component.html",
  styleUrls: ["./main-block.component.scss"]
})
export class MainBlockComponent implements OnInit {
  constructor(
    private r: Renderer2,
    private cookieService: CookieService,
    private ts: TelegramService
  ) {}

  isTimer = false;

  form: FormGroup;
  isSubmit = true;

  maskArr = ["000)000-00-00", ""];
  prefixArr = ["+38(", "+7(", "+"];
  valuePrefix = "";

  maxLength = 15;
  mask = "";
  prefix = "+";

  phoneRegex = /[^\)\d\(\+]/;

  openModal(id: string) {
    this.r.setStyle(
      document.querySelector(".main-block").querySelector(id),
      "visibility",
      "visible"
    );
    setTimeout(() => {
      this.r.setStyle(
        document.querySelector(".main-block").querySelector(id),
        "transform",
        "translateY(0)"
      );
    }, 50);
  }

  openSecondModal() {
    this.openModal(".second-mw");
    this.r.setStyle(
      document
        .querySelector(".main-block")
        .querySelector(".first-mw")
        .querySelector(".close-icon"),
      "display",
      "none"
    );
  }

  openFirstModal() {
    this.openModal(".first-mw");
    this.r.setStyle(
      document
        .querySelector(".main-block")
        .querySelector(".first-mw")
        .querySelector(".close-icon"),
      "display",
      "block"
    );
  }

  closeModal(id: string) {
    this.r.setStyle(
      document.querySelector(".main-block").querySelector(id),
      "transform",
      "translateY(100%)"
    );
  }

  closeAll() {
    this.closeModal(".first-mw");
    this.closeModal(".second-mw");
  }

  onChange(e) {
    this.form
      .get("phone")
      .setValue(this.form.get("phone").value.replace(this.phoneRegex, ""));
    if (this.form.get("phone").value === "+38") {
      this.maxLength = 18;
      this.form.get("phone").setValue("");
      this.mask = this.maskArr[0];
      this.prefix = this.prefixArr[0];
      this.valuePrefix = "+38";
      this.form.get("phone").updateValueAndValidity();
    } else if (this.form.get("phone").value === "+7") {
      this.maxLength = 18;
      this.form.get("phone").setValue("");
      this.mask = this.maskArr[0];
      this.prefix = this.prefixArr[1];
      this.valuePrefix = "+7";
      this.form.get("phone").updateValueAndValidity();
    } else if (this.form.get("phone").value === "") {
      this.maxLength = 15;
      this.mask = "";
      this.prefix = "+";
      this.valuePrefix = "";
      this.form.get("phone").setValue("+");
      this.form.get("phone").updateValueAndValidity();
    } else if (this.form.get("phone").value === "+") {
      this.maxLength = 15;
      this.valuePrefix = "";
      e.target.blur();
      e.target.focus();
    }
    console.log(this.valuePrefix + this.form.get("phone").value);
  }

  order() {
    this.ts.sendMessage(this.form.get("phone").value).subscribe(
      res => {
        console.log(res);
        this.isSubmit = true;
      },
      error => {
        console.log(error);
      }
    );
  }

  startTimer() {
    this.isTimer = true;
    this.cookieService.set("time", "" + 15 * 60);
  }

  stopTimer(event) {
    this.isTimer = event;
  }

  onSubmit(e) {
    this.isSubmit = false;
    this.order();
    this.closeModal(".first-mw");
    this.closeModal(".second-mw");
    this.startTimer();
  }

  ngOnInit() {
    this.form = new FormGroup({
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(18)
      ])
    });

    $(".main-block .rectangle").addClass("show");
    $(".preloader").css({
      opacity: "0",
      "pointer-events": "none"
    });
    if (+this.cookieService.get("time") > 0) {
      this.isTimer = true;
    }
  }
}
