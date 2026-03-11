export interface Config {
  auth?: {
    githubAccess?: {
      /** Allowed email domains for GitHub sign-in (for example: testkube.io). */
      allowedDomains?: string[];
      /** Explicitly allowed emails for GitHub sign-in, even outside allowedDomains. */
      whitelistedEmails?: string[];
    };
  };
}
