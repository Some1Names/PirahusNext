import { createElement } from "react";
import { RANK_COLORS, RANK_GLYPHS } from "@/src/lib/leaderboard/types";

export function RankRow({
  rank,
  username,
  value,
  valueSuffix,
  meta,
  isMe,
  accentColor,
}: {
  rank: number;
  username: string;
  value: string;
  valueSuffix?: string;
  meta?: string;
  isMe: boolean;
  accentColor: string;
}) {
  const isTop3 = rank <= 3;
  const rankColor = isTop3 ? RANK_COLORS[rank - 1] : "#94a3b8";

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "9px 12px",
    borderRadius: 6,
    background: isMe ? `${accentColor}14` : "rgba(255,255,255,0.02)",
    border: isMe ? `1px solid ${accentColor}66` : "1px solid transparent",
  } as const;

  const rankStyle = {
    width: 26,
    fontSize: isTop3 ? 14 : 12,
    fontWeight: 700,
    color: rankColor,
    textAlign: "center",
    flexShrink: 0,
  } as const;

  const usernameStyle = {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    color: isMe ? accentColor : "#e2e8f0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as const;

  const metaBadgeStyle = {
    color: accentColor,
    marginLeft: 8,
    fontSize: 10,
    padding: "1px 6px",
    border: `1px solid ${accentColor}44`,
    borderRadius: 3,
    opacity: 0.85,
    whiteSpace: "nowrap",
    flexShrink: 0,
  } as const;

  const youLabelStyle = {
    color: "#64748b",
    marginLeft: 6,
    fontSize: 10,
    flexShrink: 0,
    whiteSpace: "nowrap",
  } as const;

  const valueStyle = {
    fontSize: 13,
    fontWeight: 700,
    color: rankColor,
    flexShrink: 0,
  } as const;

  const valueSuffixStyle = {
    fontSize: 10,
    color: "#64748b",
    marginLeft: 4,
  } as const;

  return createElement(
    "div",
    { style: containerStyle },
    createElement("div", { style: rankStyle }, isTop3 ? RANK_GLYPHS[rank - 1] : `#${rank}`),
    createElement(
      "div",
      { style: { flex: 1, display: "flex", alignItems: "center", minWidth: 0 } },
      createElement("div", { style: usernameStyle }, username),
      isMe && createElement("span", { style: youLabelStyle }, "(you)"),
      meta && createElement("span", { style: metaBadgeStyle }, meta)
    ),
    createElement(
      "div",
      { style: valueStyle },
      value,
      valueSuffix && createElement("span", { style: valueSuffixStyle }, valueSuffix)
    )
  );
}
