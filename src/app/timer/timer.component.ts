import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import * as moment from "moment-timezone";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"]
})
export class TimerComponent implements OnInit, AfterViewInit {
  constructor(private cookieService: CookieService) {}

  @Output() destroyTimer = new EventEmitter();

  timer;

  hours;
  minutes;
  seconds;

  now = moment(new Date());
  nowH = this.now.tz("Europe/Kiev").format("H");
  nowM = 60 - +this.now.tz("Europe/Kiev").format("m");

  interval;
  timeLeft: number = 15 * 60;

  startTimer() {
    if (this.cookieService.get("time") && this.cookieService.get("lastDate")) {
      this.timeLeft =
        +this.cookieService.get("time") -
        (+moment(new Date())
          .tz("Europe/Kiev")
          .format("H") *
          60 *
          60 +
          +moment(new Date())
            .tz("Europe/Kiev")
            .format("m") *
            60 +
          +moment(new Date())
            .tz("Europe/Kiev")
            .format("s") -
          +this.cookieService.get("lastDate"));
      console.log(this.timeLeft + "yes");
    } else {
      this.cookieService.set("time", this.timeLeft.toString());
      this.cookieService.set(
        "lastDate",
        "" +
          (+moment(new Date())
            .tz("Europe/Kiev")
            .format("H") *
            60 *
            60 +
            +moment(new Date())
              .tz("Europe/Kiev")
              .format("m") *
              60 +
            +moment(new Date())
              .tz("Europe/Kiev")
              .format("s"))
      );
      console.log(this.timeLeft + "no");
    }
    if (+this.nowH < 9) {
      this.timeLeft = ((9 - +this.nowH) * 60 + +this.nowM) * 60;
    }
    if (+this.nowH > 18) {
      this.timeLeft = ((24 - (+this.nowH - 9)) * 60 + +this.nowM) * 60;
    }
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.renderTimer();
        this.cookieService.set("time", this.timeLeft.toString());
        this.cookieService.set(
          "lastDate",
          "" +
            (+moment(new Date())
              .tz("Europe/Kiev")
              .format("H") *
              60 *
              60 +
              +moment(new Date())
                .tz("Europe/Kiev")
                .format("m") *
                60 +
              +moment(new Date())
                .tz("Europe/Kiev")
                .format("s"))
        );
      } else if (this.timeLeft < 0) {
        this.timeLeft = 0;
        this.cookieService.set("time", this.timeLeft.toString());
        this.renderTimer();
        this.destroyTimer.emit(true);
        // this.cookieService.set("time", this.timeLeft.toString());
        // this.cookieService.set(
        //   "lastDate",
        //   Date.parse("" + new Date()).toString()
        // );
      }
    }, 1000);
  }

  renderTimer() {
    this.hours.innerHTML = (
      "0" + Math.floor((this.timeLeft / 60 / 60) % 24).toString()
    ).slice(-2);
    this.minutes.innerHTML = (
      "0" + Math.floor((this.timeLeft / 60) % 60).toString()
    ).slice(-2);
    this.seconds.innerHTML = (
      "0" + Math.floor(this.timeLeft % 60).toString()
    ).slice(-2);
  }

  ngAfterViewInit() {
    this.timer = document.querySelector(".timer");
    this.hours = this.timer.querySelector(".hours");
    this.minutes = this.timer.querySelector(".minutes");
    this.seconds = this.timer.querySelector(".seconds");
    this.startTimer();
    this.renderTimer();
  }

  ngOnInit() {}
}
