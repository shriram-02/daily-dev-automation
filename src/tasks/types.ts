export interface AutomationTaskResult {
  name: string;
  changed: boolean;
  files: string[];
  commitMessage: string;
}

export interface AutomationTask {
  name: string;
  run(): Promise<AutomationTaskResult>;
}
