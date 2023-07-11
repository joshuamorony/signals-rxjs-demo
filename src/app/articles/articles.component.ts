import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArticlesService } from "./data-access/articles.service";
import { ListComponent } from "./ui/list.component";
import { SearchComponent } from "./ui/search.component";
import { PaginationComponent } from "./ui/pagination.component";

@Component({
  standalone: true,
  selector: "app-articles",
  providers: [ArticlesService],
  template: `
    <app-search [control]="service.filterControl" />
    <app-list [articles]="service.filteredArticles()" />

    <div class="status">
      <p *ngIf="service.status() === 'loading'">Loading...</p>
      <div *ngIf="service.status() === 'error'">
        <p>{{ service.error() }}</p>
        <button (click)="service.retry$.next()">Retry</button>
      </div>
    </div>

    <app-pagination
      [currentPage]="service.currentPage()"
      (pageChange)="service.currentPage$.next($event)"
    />
  `,
  imports: [ListComponent, SearchComponent, PaginationComponent, CommonModule],
  styles: [
    `
      :host {
        display: block;
        background-color: #ecf0f1;
        padding: 2rem;
      }

      .status {
        display: flex;
        flex-direction: column;
        margin-bottom: 2rem;
        align-items: center;
      }
    `,
  ],
})
export default class ArticlesComponent {
  service = inject(ArticlesService);
}
