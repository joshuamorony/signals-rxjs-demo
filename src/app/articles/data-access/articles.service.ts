import { Injectable, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "../../shared/data-access/api.service";
import { Article } from "../../shared/interfaces/article";
import { FormControl } from "@angular/forms";

export interface ArticlesState {
  articles: Article[];
  filter: string | null;
  error: string | null;
  status: "loading" | "success" | "error";
  currentPage: number;
}

@Injectable()
export class ArticlesService {
  private apiService = inject(ApiService);

  private state = signal<ArticlesState>({
    articles: [],
    filter: null,
    error: null,
    status: "loading",
    currentPage: 1,
  });

  filterControl = new FormControl();

  // selectors
  articles = computed(() => this.state().articles);
  filter = computed(() => this.state().filter);
  error = computed(() => this.state().error);
  status = computed(() => this.state().status);
  currentPage = computed(() => this.state().currentPage);

  filteredArticles = computed(() => {
    const filter = this.filter();

    return filter
      ? this.articles().filter((article) =>
          article.title.toLowerCase().includes(filter.toLowerCase())
        )
      : this.articles();
  });

  // sources
  articlesLoaded$ = this.apiService.articles$;
  filter$ = this.filterControl.valueChanges;

  constructor() {
    // reducers
    this.articlesLoaded$.pipe(takeUntilDestroyed()).subscribe((articles) =>
      this.state.update((state) => ({
        ...state,
        articles,
        status: "success",
      }))
    );

    this.filter$.pipe(takeUntilDestroyed()).subscribe((filter) =>
      this.state.update((state) => ({
        ...state,
        filter: filter === "" ? null : filter,
      }))
    );
  }
}
