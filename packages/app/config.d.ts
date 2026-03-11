export interface Config {
  app?: {
    /**
     * Selects the sign-in provider shown in the frontend.
     * Supported values: `guest` or `github`.
     * @visibility frontend
     */
    signInPage?: 'guest' | 'github';
  };
}
