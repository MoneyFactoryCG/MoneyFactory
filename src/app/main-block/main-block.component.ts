import { Component, OnInit } from "@angular/core";

import * as $ from "jquery";

@Component({
  selector: "app-main-block",
  templateUrl: "./main-block.component.html",
  styleUrls: ["./main-block.component.scss"]
})
export class MainBlockComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $(".main-block .rectangle").addClass("show");

    // setTimeout(() => {
    $(".preloader").css({
      opacity: "0",
      "pointer-events": "none"
    });
    // }, 2000);
  }
}
