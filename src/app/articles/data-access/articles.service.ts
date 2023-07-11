import { Injectable, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "../../shared/data-access/api.service";
import { Article } from "../../shared/interfaces/article";

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

  // selectors
  articles = computed(() => this.state().articles);
  filter = computed(() => this.state().filter);
  error = computed(() => this.state().error);
  status = computed(() => this.state().status);
  currentPage = computed(() => this.state().currentPage);

  // sources
  articlesLoaded$ = this.apiService.articles$;

  constructor() {
    // reducers
    this.articlesLoaded$.pipe(takeUntilDestroyed()).subscribe((articles) =>
      this.state.update((state) => ({
        ...state,
        articles,
        status: "success",
      }))
    );
  }
}
