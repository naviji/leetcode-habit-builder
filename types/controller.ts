export interface Controller {
  startRedirect({
    url,
    redirectOnSuccess,
    whiteListedUrls,
  }: {
    url: string;
    redirectOnSuccess: boolean;
    whiteListedUrls: string[];
  }): void;
  stopRedirect({ redirectOnSuccess }: { redirectOnSuccess: boolean }): void;
}
