import { Injectable, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApiService } from "../../shared/data-access/api.service";
import { Article } from "../../shared/interfaces/article";
import { FormControl } from "@angular/forms";
import { Subject, retry, startWith, switchMap } from "rxjs";

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
  retry$ = new Subject<void>();
  error$ = new Subject<Error>();
  currentPage$ = new Subject<number>();

  articlesForPage$ = this.currentPage$.pipe(
    startWith(1),
    switchMap((page) =>
      this.apiService.getArticlesByPage(page).pipe(
        retry({
          delay: (err) => {
            this.error$.next(err);
            return this.retry$;
          },
        })
      )
    )
  );

  filter$ = this.filterControl.valueChanges;

  constructor() {
    // reducers
    this.articlesForPage$.pipe(takeUntilDestroyed()).subscribe((articles) =>
      this.state.update((state) => ({
        ...state,
        articles,
        status: "success",
      }))
    );

    this.currentPage$
      .pipe(takeUntilDestroyed())
      .subscribe((currentPage) =>
        this.state.update((state) => ({
          ...state,
          currentPage,
          status: "loading",
          articles: [],
        }))
      );

    this.filter$.pipe(takeUntilDestroyed()).subscribe((filter) =>
      this.state.update((state) => ({
        ...state,
        filter: filter === "" ? null : filter,
      }))
    );

    this.retry$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: "loading" }))
      );

    this.error$.pipe(takeUntilDestroyed()).subscribe((error) =>
      this.state.update((state) => ({
        ...state,
        status: "error",
        error: error.message,
      }))
    );
  }
}
