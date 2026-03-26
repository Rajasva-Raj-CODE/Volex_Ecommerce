"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import type { ProductSpecGroup, ProductOverviewSection } from "@/lib/types";

interface ProductSpecificationsProps {
  specGroups: ProductSpecGroup[];
  overview?: ProductOverviewSection[];
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1a1a1a]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5"
      >
        <span className="text-lg font-bold text-white">{title}</span>
        <HugeiconsIcon
          icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
          size={20}
          strokeWidth={2}
          className="text-white/60"
        />
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

export default function ProductSpecifications({
  specGroups,
  overview,
}: ProductSpecificationsProps) {
  const [specsExpanded, setSpecsExpanded] = useState(false);

  if (specGroups.length === 0) return null;

  const visibleGroups = specsExpanded ? specGroups : specGroups.slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      {/* Specifications */}
      <CollapsibleSection title="Specifications">
        <div className="flex flex-col gap-6">
          {visibleGroups.map((group) => (
            <div key={group.groupName}>
              <h4 className="mb-4 text-sm font-black uppercase tracking-wider text-white">
                {group.groupName}
              </h4>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xs font-medium text-white/40">
                      {spec.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-b border-white/5" />
            </div>
          ))}

          {specGroups.length > 2 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setSpecsExpanded(!specsExpanded)}
                className="rounded-lg border-white/20 bg-transparent px-8 text-sm font-semibold text-white hover:bg-[#252525] hover:text-white"
              >
                {specsExpanded ? "View Less" : "View More"}
              </Button>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Overview */}
      {overview && overview.length > 0 && (
        <CollapsibleSection title="Overview">
          <div className="flex flex-col gap-6">
            {overview.map((section, i) => (
              <div key={i}>
                <h4 className="mb-2 text-sm font-bold text-[#49A5A2]">
                  {section.heading}
                </h4>
                <p className="text-sm leading-relaxed text-white/60">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
