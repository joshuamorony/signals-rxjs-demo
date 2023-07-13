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
    <div class="search-bar">
      <app-search [control]="service.filterControl" />
      <button
        class="refresh"
        (click)="service.refresh$.next()"
        title="Refresh and search for new entries"
      >
        🔄
      </button>
    </div>

    <app-list [articles]="service.articles()" />

    <div class="status">
      <p *ngIf="service.status() === 'LOADING'">Loading...</p>
      <div *ngIf="service.status() === 'ERROR'">
        <p>{{ service.error() }}</p>
        <button (click)="service.refresh$.next()">Retry</button>
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

      .search-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .search-bar app-search {
        flex-grow: 1;
      }

      .refresh {
        font-size: 24px;
        padding: 0.75rem;
      }
    `,
  ],
})
export default class ArticlesComponent {
  service = inject(ArticlesService);
}
