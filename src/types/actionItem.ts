export type ActionItemStatus = "todo" | "done";

export interface ActionItem {
  id: string;
  observation_id: string;
  title: string;
  status: ActionItemStatus;
  created_at: string;
}

export type CreateActionItemInput = Omit<ActionItem, "id" | "created_at">;
