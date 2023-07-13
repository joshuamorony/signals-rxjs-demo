export type ServerResponseLoading = {
  status: "LOADING";
};

export type ServerResponseOk<T> = {
  status: "OK";
  body: T;
};

export type ServerResponseError = {
  status: "ERROR";
  error: Error;
};

export type ServerResponse<T> =
  | ServerResponseLoading
  | ServerResponseOk<T>
  | ServerResponseError;
