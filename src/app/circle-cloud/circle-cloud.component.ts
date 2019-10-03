import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { TweenMax, Expo, Power2 } from "gsap/all";
import * as PIXI from "pixi.js";
declare var TweenMax: any;

@Component({
  selector: "app-circle-cloud",
  templateUrl: "./circle-cloud.component.html",
  styleUrls: ["./circle-cloud.component.scss"]
})
export class CircleCloudComponent implements OnInit, AfterViewInit, OnDestroy {
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

  mouse = {
    x: 0,
    y: 0
  };

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
    const particle = PIXI.Sprite.from("assets/Ellipse.svg");
    particle.interactive = true;
    particle.scale.set(this.random(0.1, 1));
    particle.position.set(
      this.random(this.app.screen.width / 2, this.app.screen.width / 2),
      this.random(this.app.screen.height / 2, this.app.screen.height / 2)
    );
    particle.rotation = this.random(0, 1);
    particle.anchor.set(this.random(0.1, 1));
    const distance = this.random(0.1, 0.3);
    return particle;
  }

  addParticles() {
    for (let i = 0; i < this.pCount; i++) {
      this.particles.push(this.generateParticle());
      this.cloudContainer.addChild(this.particles[i]);
      this.angle.push(this.random(0.001, 0.001 * (i / 10)));
      this.distance.push(this.random(0.1, 0.3));
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

  createCloud() {
    // 3
    let i = 0;
    for (let y = 0; y < this.settings.tmpCanvas.height; y += 6) {
      for (let x = 0; x < this.settings.tmpCanvas.width; x += 6) {
        if (
          this.settings.imageData.data[
            (y * this.settings.imageData.width + x) * 4 + 3
          ] > 20
        ) {
          this.setParticleToCloud(
            x + this.settings.widthDiff,
            y + this.settings.heightDiff,
            i
          );
          i += 1;
        }
      }
    }
  }

  setParticleToCloud(x, y, num) {
    TweenMax.to(this.particles[num].position, this.random(3, 6), {
      ease: Expo.easeOut,
      x,
      y
    });
  }

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

    document.getElementById("cloud").onmousemove = event => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
      for (let i = 0; i < this.pCount; i++) {
        TweenMax.to(this.particles[i].position, 3, {
          ease: Expo.ease,
          x:
            this.mouse.x * this.random(0.5, 1.5) +
            this.random(-100, 100) * this.distance[i] * 10,
          y:
            this.mouse.y * this.random(0.5, 1.5) +
            this.random(-100, 100) * this.distance[i] * 10
        });
      }
    };
    document.getElementById("cloud").ontouchmove = event => {
      this.mouse.x = event.touches[0].clientX;
      this.mouse.y = event.touches[0].clientY;
      for (let i = 0; i < this.pCount; i++) {
        TweenMax.to(this.particles[i].position, 3, {
          ease: Expo.ease,
          x:
            this.mouse.x * this.random(0.5, 1.5) +
            this.random(-100, 100) * this.distance[i] * 10,
          y:
            this.mouse.y * this.random(0.5, 1.5) +
            this.random(-100, 100) * this.distance[i] * 10
        });
      }
    };
    document.getElementById("cloud").onclick = event => {
      for (let i = 0; i < this.pCount; i++) {
        TweenMax.to(this.particles[i].position, 3, {
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
            Math.cos(time * this.angle[i]) * this.distance[i];
          this.particles[i].y +=
            Math.sin(time * this.angle[i]) * this.distance[i];
          if (this.particles[i].position.y <= 0) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-300, 300) * this.distance[i] * 10,
              y:
                this.particles[i].position.y +
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.y >= this.app.screen.height) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              x:
                this.particles[i].position.x +
                this.random(-300, 300) * this.distance[i] * 10,
              y:
                this.particles[i].position.y -
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x <= 0) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
              ease: Expo.easeOut,
              y:
                this.particles[i].position.y +
                this.random(-300, 300) * this.distance[i] * 10,
              x:
                this.particles[i].position.x +
                this.random(200, 400) * this.distance[i] * 10
            });
          }
          if (this.particles[i].position.x >= this.app.screen.width) {
            TweenMax.to(this.particles[i].position, this.random(2, 4), {
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
    document.getElementById("cloud").onmousemove = event => {
      event.preventDefault();
    };
    document.getElementById("cloud").onclick = event => {
      event.preventDefault();
    };
    document.getElementById("cloud").ontouchmove = event => {
      event.preventDefault();
    };
    this.app.renderer.destroy();
    this.app.stage.removeChild(this.cloudContainer);
    document
      .getElementById("cloud")
      .removeChild(document.querySelector("#cloud > canvas"));
  }
}
