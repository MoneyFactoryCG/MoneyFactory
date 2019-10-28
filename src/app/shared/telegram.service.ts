import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TelegramService {
  constructor(private http: HttpClient) {}

  sendMessage(phone: string) {
    return this.http.post(environment.host + "/.netlify/functions/test/send", {
      phone
    });
  }
}
