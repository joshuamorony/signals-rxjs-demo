import { Observable, UnaryFunction, of, pipe } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";
import {
  ServerResponse,
  ServerResponseError,
  ServerResponseLoading,
  ServerResponseOk,
} from "./data-access.types";

export const mapHttpResultToServerResponse = <T>(): UnaryFunction<
  Observable<T>,
  Observable<ServerResponse<T>>
> =>
  pipe(
    map<T, ServerResponseOk<T>>((body) => ({ status: "OK", body })),
    catchError((error) => of<ServerResponseError>({ status: "ERROR", error })),
    startWith<ServerResponse<T>, [ServerResponseLoading]>({
      status: "LOADING",
    })
  );

export const isResponseOk = <T>(
  response: ServerResponse<T>
): response is ServerResponseOk<T> => response.status === "OK";

export const isResponseError = <T>(
  response: ServerResponse<T>
): response is ServerResponseError => response.status === "ERROR";

export const isResponseLoading = <T>(
  response: ServerResponse<T>
): response is ServerResponseLoading => response.status === "LOADING";
