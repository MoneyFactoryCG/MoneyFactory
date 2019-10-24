import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input
} from "@angular/core";
import { TweenMax, Expo, Power2 } from "gsap/all";
import * as PIXI from "pixi.js";
import { Circ } from "gsap";
declare var TweenMax: any;

@Component({
  selector: "app-circle-cloud",
  templateUrl: "./circle-cloud.component.html",
  styleUrls: ["./circle-cloud.component.scss"]
})
export class CircleCloudComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() el;
  @ViewChild("cloud", { static: false }) rendererContainer: ElementRef;
  public app;

  cloudContainer = new PIXI.Container();

  settings = {
    tmpCanvas: null,
    imageData: null,
    widthDiff: 0,
    heightDiff: 0
  };

  angle = [];
  distance = [];
  position = [[], []];
  mouse = {
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0
  };

  block = 0;

  orientation;

  gyro;

  pCount = 500;

  particles = [];

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  polarRandom() {
    const rand = this.random(-1, 1);
    if (rand < 0) {
      return -1;
    }
    if (rand >= 0) {
      return 1;
    }
  }

  constructor() {}

  generateParticle() {
    const particle = PIXI.Sprite.from("assets/Ellipse.png");
    particle.interactive = true;
    particle.scale.set(this.random(0.1, 1));
    particle.position.set(
      this.random(this.app.screen.width / 2, this.app.screen.width / 2),
      this.random(this.app.screen.height / 2, this.app.screen.height / 2)
    );
    particle.anchor.set(0.5);
    particle.hitArea = new PIXI.Polygon([
      28,
      37,
      30,
      38,
      33,
      38,
      36,
      37,
      38,
      34,
      38,
      30,
      36,
      27,
      30,
      26,
      27,
      29,
      26,
      34
    ]);
    return particle;
  }

  addParticles() {
    for (let i = 0; i < this.pCount; i++) {
      this.particles.push(this.generateParticle());
      this.cloudContainer.addChild(this.particles[i]);
      this.angle.push(this.random(0.001, 0.001 * (i / 10)));
      this.distance.push(this.random(0.1, 0.3));
      this.position[0][i] = this.random(0.5, 1.5);
      this.position[1][i] = this.random(0.5, 1.5);
    }
    this.app.stage.addChild(this.cloudContainer);
  }

  positionParticle() {
    for (let i = 0; i < this.pCount; i++) {
      TweenMax.to(this.particles[i].position, this.random(2, 5), {
        ease: Power2.easeOut,
        x: this.random(
          0 - this.app.screen.width / 4,
          this.app.screen.width * 1.25
        ),
        y: this.random(
          0 - this.app.screen.height / 4,
          this.app.screen.height * 1.25
        )
      });
    }
  }

  // MOUSE SPEED
  timestamp = null;
  lastMouseX = null;
  lastMouseY = null;

  getMouseSpeed(x, y) {
    if (this.timestamp === null) {
      this.timestamp = Date.now();
      this.lastMouseX = x;
      this.lastMouseY = y;
      return;
    }

    const now = Date.now();
    const dt = now - this.timestamp;
    const dx = x - this.lastMouseX;
    const dy = y - this.lastMouseY;
    const speedX = Math.round((dx / dt) * 100);
    const speedY = Math.round((dy / dt) * 100);

    this.timestamp = now;
    this.lastMouseX = x;
    this.lastMouseY = y;

    return { speedX, speedY };
  }
  // MOUSE SPEED END

  ngOnInit() {
    this.app = new PIXI.Application({
      height: window.innerHeight,
      width: window.innerWidth,
      transparent: true,
      resizeTo: window,
      clearBeforeRender: true
    });

    if (window.innerWidth < 480) {
      this.pCount = 80;
    }

    document.querySelector(this.el).onmousemove = event => {
      this.mouse.x = event.clientX || 0;
      this.mouse.y = event.clientY || 0;
      this.block += 1;
      // if (this.block >= 5) {
      //   this.block = 0;
      //   for (let i = 0; i < this.pCount; i++) {
      //     TweenMax.to(this.particles[i].position, this.random(2, 3), {
      //       x:
      //         this.mouse.x * this.random(0.7, 1.3) +
      //         this.random(-100, 100) * this.distance[i] * 10,
      //       y:
      //         this.mouse.y * this.random(0.7, 1.3) +
      //         this.random(-100, 100) * this.distance[i] * 10
      //     });
      //   }
      // }
      if (this.block >= 5) {
        const { speedX, speedY } = this.getMouseSpeed(
          this.mouse.x,
          this.mouse.y
        );
        this.mouse.speedX = speedX;
        this.mouse.speedY = speedY;
        this.block = 0;
        for (let i = 0; i < this.pCount; i++) {
          TweenMax.to(this.particles[i].position, this.random(2, 3), {
            x:
              this.mouse.x * this.random(0.8, 1.2) +
              speedX * 1.4 +
              this.random(-100, 100) * this.distance[i] * 10,
            y:
              this.mouse.y * this.random(0.8, 1.2) +
              speedY * 1.4 +
              this.random(-100, 100) * this.distance[i] * 10
          });
        }
      }
    };
    document.querySelector(this.el).ontouchmove = event => {
      this.mouse.x = event.touches[0].clientX;
      this.mouse.y = event.touches[0].clientY;
      this.block += 1;
      if (this.block >= 1) {
        this.block = 0;
        for (let i = 0; i < this.pCount; i++) {
          TweenMax.to(this.particles[i].position, this.random(2, 5), {
            x:
              this.mouse.x * this.random(0.5, 1.5) +
              this.random(-100, 100) * this.distance[i] * 10,
            y:
              this.mouse.y * this.random(0.5, 1.5) +
              this.random(-100, 100) * this.distance[i] * 10
          });
        }
      }
    };
    document.querySelector(this.el).onclick = event => {
      for (let i = 0; i < this.pCount; i++) {
        TweenMax.to(this.particles[i].position, this.random(2, 5), {
          ease: Expo.easeOut,
          x:
            this.particles[i].position.x +
            this.app.screen.width * this.polarRandom(),
          y:
            this.particles[i].position.y +
            this.app.screen.height * this.polarRandom()
        });
      }
    };

    this.addParticles();
    this.positionParticle();
    this.app.ticker.add(delta => {
      const time = new Date().getTime() * 0.001;
      if (window.innerWidth < 480) {
        for (let i = 0; i < this.pCount; i++) {
          this.particles[i].x +=
            Math.cos(time * this.angle[i]) * this.distance[i];
          this.particles[i].y +=
            Math.sin(time * this.angle[i]) * this.distance[i];
          if (this.particles[i].position.y <= 0) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-50, 50) * this.distance[i] * 10,
              y:
                this.particles[i].position.y +
                this.random(50, 70) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.y >= this.app.screen.height) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-50, 50) * this.distance[i] * 10,
              y:
                this.particles[i].position.y -
                this.random(50, 70) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x <= 0) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              y:
                this.particles[i].position.y +
                this.random(-50, 50) * this.distance[i] * 10,
              x:
                this.particles[i].position.x +
                this.random(50, 70) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x >= this.app.screen.width) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              y:
                this.particles[i].position.y +
                this.random(-50, 50) * this.distance[i] * 10,
              x:
                this.particles[i].position.x -
                this.random(50, 70) * this.distance[i] * 10
            });
          }
        }
      } else {
        for (let i = 0; i < this.pCount; i++) {
          this.particles[i].x +=
            Math.cos(time * this.angle[i]) * this.distance[i] * 3;
          this.particles[i].y +=
            Math.sin(time * this.angle[i]) * this.distance[i] * 3;
          if (this.particles[i].position.y <= 5) {
            TweenMax.to(this.particles[i].position, this.random(4, 6), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-300, 300) * this.distance[i] * 10,
              y:
                this.particles[i].position.y +
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.y >= this.app.screen.height - 5) {
            TweenMax.to(this.particles[i].position, this.random(4, 6), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-300, 300) * this.distance[i] * 10,
              y:
                this.particles[i].position.y -
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x <= 5) {
            TweenMax.to(this.particles[i].position, this.random(4, 6), {
              ease: Expo.easeOut,
              y:
                this.particles[i].position.y +
                this.random(-300, 300) * this.distance[i] * 10,
              x:
                this.particles[i].position.x +
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x >= this.app.screen.width - 5) {
            TweenMax.to(this.particles[i].position, this.random(4, 6), {
              ease: Expo.easeOut,
              y:
                this.particles[i].position.y +
                this.random(-300, 300) * this.distance[i] * 10,
              x:
                this.particles[i].position.x -
                this.random(200, 400) * this.distance[i] * 10
            });
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    document.getElementById("cloud").appendChild(this.app.view);
  }

  ngOnDestroy() {
    document.querySelector(this.el).onmousemove = event => {
      event.preventDefault();
    };
    document.querySelector(this.el).onclick = event => {
      event.preventDefault();
    };
    document.querySelector(this.el).ontouchmove = event => {
      event.preventDefault();
    };
    this.app.renderer.destroy();
    this.app.stage.removeChild(this.cloudContainer);
    document
      .getElementById("cloud")
      .removeChild(document.querySelector("#cloud > canvas"));
  }
}
