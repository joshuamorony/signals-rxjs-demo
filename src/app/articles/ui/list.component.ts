import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Article } from "../../shared/interfaces/article";

@Component({
  standalone: true,
  selector: "app-list",
  template: `
    <ul>
      <li *ngFor="let article of articles">
        {{ article.title }}
      </li>
    </ul>
  `,
  imports: [CommonModule],
  styles: [
    `
      ul {
        padding: 0;
      }
      li {
        border: 1px solid #bdc3c7;
        list-style: none;
        margin-bottom: 1rem;
        padding: 1rem;
      }
    `,
  ],
})
export class ListComponent {
  @Input({ required: true }) articles!: Article[];
}
