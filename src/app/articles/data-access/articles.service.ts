import { Injectable, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { BehaviorSubject, Subject, combineLatest } from "rxjs";
import { mergeMap, startWith, switchMap } from "rxjs/operators";
import {
  isResponseError,
  isResponseOk,
} from "../../shared/data-access-utils/data-access.utils";
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

  // sources
  readonly refresh$ = new Subject<void>();
  readonly currentPage$ = new BehaviorSubject<number>(1);

  readonly filterControl = new FormControl();
  readonly filter$ = this.filterControl.valueChanges.pipe(startWith(""));

  private readonly state = toSignal(
    this.refresh$.pipe(
      startWith(undefined),
      mergeMap(() => combineLatest([this.currentPage$, this.filter$])),
      switchMap(([page, filter]) =>
        this.apiService.getArticlesByPageAndFilter(page, filter)
      )
    ),
    { requireSync: true }
  );

  // selectors
  readonly articles = computed(() => {
    const state = this.state();
    return isResponseOk(state) ? state.body : [];
  });
  readonly error = computed(() => {
    const state = this.state();
    return isResponseError(state) ? state.error : undefined;
  });
  readonly status = computed(() => this.state().status);
  readonly currentPage = toSignal(this.currentPage$, { requireSync: true });
}
