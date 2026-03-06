export interface Config {
  testkube?: {
    /** Upstream Testkube API base URL (e.g. http://localhost:8088) */
    apiUrl?: string;
    auth?: {
      /** API key or token sent to Testkube API (e.g. from env: ${TESTKUBE_API_KEY}) */
      apiKey?: string;
    };
  };
}
