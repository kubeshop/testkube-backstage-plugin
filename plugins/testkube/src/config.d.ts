
export interface Config {
  testkube?: {
    /**
     * The UI url of the Dapr instance.
     * @visibility frontend
     */
    enterprise?: boolean;
    api?: string;
    ui?: string;
  }
}
