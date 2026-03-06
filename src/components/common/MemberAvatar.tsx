"use client";

import { Member } from "@/types";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  member: Member;
  size?: "sm" | "md";
  className?: string;
}

export function MemberAvatar({ member, size = "sm", className }: MemberAvatarProps) {
  const sizeClass = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[11px]";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white border border-[#0A0A0D] shrink-0",
        sizeClass,
        className
      )}
      style={{ background: member.color }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

interface MemberStackProps {
  members: Member[];
  max?: number;
  size?: "sm" | "md";
}

export function MemberStack({ members, max = 3, size = "sm" }: MemberStackProps) {
  const visible = members.slice(0, max);
  const rest = members.length - max;
  const sizeClass = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[11px]";

  return (
    <div className="flex items-center">
      {visible.map((member, i) => (
        <div
          key={member.id}
          className={cn(
            "rounded-full flex items-center justify-center font-semibold text-white border-2 border-[#16161A] shrink-0",
            sizeClass,
            i > 0 ? "-ml-2" : ""
          )}
          style={{ background: member.color }}
          title={member.name}
        >
          {member.initials}
        </div>
      ))}
      {rest > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-semibold text-[#7A7A88] border-2 border-[#16161A] -ml-2",
            sizeClass
          )}
          style={{ background: "#252530" }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
