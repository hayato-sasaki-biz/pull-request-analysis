type Options = {
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
  headers: GoogleAppsScript.URL_Fetch.HttpHeaders;
  body?: GoogleAppsScript.URL_Fetch.Payload;
};

type Response<T> = {
  text: () => Promise<string>;
  json: () => Promise<T>;
};

const defaultOptions: Options = {
  method: "get",
  headers: {},
  body: null,
};

const fetch = <T = object>(
  url: string,
  options_: Options = defaultOptions
): Promise<Response<T>> => {
  const { headers, method, body } = options_;

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    headers,
    method,
    contentType: "application/json",
    payload: body ?? null,
  };

  return new Promise((resolve, reject) => {
    const result = UrlFetchApp.fetch(url, options);
    const code = result.getResponseCode();
    const contentText = result.getContentText();
    if (code >= 400 && code < 600) {
      reject({
        statusCode: code,
        content: contentText,
      });
    } else {
      const response: Response<T> = {
        text: (): Promise<string> => Promise.resolve(contentText),
        json: (): Promise<T> => {
          try {
            const parsed = JSON.parse(contentText) as T;
            return Promise.resolve(parsed);
          } catch (error) {
            return Promise.reject(error);
          }
        },
      };
      resolve(response);
    }
  });
};
export default fetch;
