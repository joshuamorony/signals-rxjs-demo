import { Injectable } from "@angular/core";
import { delay, of, switchMap, throwError } from "rxjs";
import { Article } from "../interfaces/article";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  articles: Article[] = [
    { title: "Breaking News: JavaScript Sentient, Demands Paid Vacation" },
    { title: "CSS Developers Reveal: Our Pants Are Made of Code" },
    {
      title: "New Study Finds Python Developers Have Superior Sock Collection",
    },
    {
      title: 'Exclusive: Web Developers Discover Hidden "Easter Egg" in HTML!',
    },
    {
      title:
        "Developers Who Master Angular Bend Space-Time Continuum in Their Spare Time",
    },
    {
      title:
        "Angular Applications Run 42% Faster When Serenaded with Smooth Jazz",
    },
  ];

  articles$ = of(this.articles).pipe(delay(1000));
  articlesFail$ = of(this.articles).pipe(
    delay(1000),
    switchMap(() =>
      Math.random() < 0.8
        ? throwError(() => new Error("Oops"))
        : of(this.articles)
    )
  );

  getArticlesByPage(page: number) {
    const articles = this.articles.map((article) => ({
      ...article,
      title: `Page ${page}: ${article.title}`,
    }));

    return of(articles).pipe(
      delay(1000),
      switchMap(() =>
        Math.random() < 0.5 ? throwError(() => new Error("Oops")) : of(articles)
      )
    );
  }
}
