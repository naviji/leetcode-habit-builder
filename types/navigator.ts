export interface Navigator {
    openTab(url: string): void
    // Api to enable or disable redirects
    setRedirectsEnabled(enabled: boolean, url?: string): void
}