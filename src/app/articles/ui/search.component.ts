import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: "app-search",
  template: ` <input [formControl]="control" placeholder="search..." /> `,
  styles: [
    `
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 1rem;
        font-size: 1.3em;
      }
    `,
  ],
})
export class SearchComponent {
  @Input({ required: true }) control!: FormControl;
}
