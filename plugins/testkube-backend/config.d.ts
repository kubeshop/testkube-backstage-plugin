export interface Config {
  testkube?: {
    /** Upstream Testkube API base URL (e.g. http://localhost:8088) */
    apiUrl?: string;
    /** Path to a PEM file containing custom CA certificates for TLS verification */
    caFilePath?: string;
    /** Disable TLS certificate verification for the upstream Testkube API (defaults to false) */
    skipTlsVerify?: boolean;
    /** Enable Testkube Enterprise mode (defaults to false) */
    enterprise?: boolean;
    /** Testkube UI base URL, required in enterprise mode (e.g. https://app.testkube.io) */
    uiUrl?: string;
    /** Testkube organizations to connect to, required in enterprise mode */
    organizations?: Array<{
      /** Organization ID (e.g. tkcorg_0000000000) */
      id: string;
      /**
       * API key for the organization
       * @visibility secret
       */
      apiKey: string;
    }>;
  };
}
