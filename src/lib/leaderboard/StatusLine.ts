import { createElement } from "react";

export function StatusLine({ loading, error, empty }: { loading: boolean; error: string | null; empty: boolean }) {
  if (loading) return createElement("div", { style: { color: "#64748b", fontSize: 12, padding: "16px 0", textAlign: "center" } }, "loading...");
  if (error) return createElement("div", { style: { color: "#fb7185", fontSize: 12, padding: "16px 0", textAlign: "center" } }, `[ERROR] ${error}`);
  if (empty) return createElement("div", { style: { color: "#64748b", fontSize: 12, padding: "16px 0", textAlign: "center" } }, "no entries yet");
  return null;
}