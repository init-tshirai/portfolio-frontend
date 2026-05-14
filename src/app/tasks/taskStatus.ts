export type TaskStatus = "not_started" | "in_progress" | "resolved" | "completed" | "feedback" | "rejected"

export const taskStatusLabels: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  resolved: "解決済み",
  completed: "完了",
  feedback: "フィードバック",
  rejected: "却下",
}
