// https://shadcnui-expansions.typeart.cc/docs/dual-range-slider
"use client";
import React from "react";
import { DualRangeSlider } from "@/components/range";
import { ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RangeProps {
  label?: string;
  className?: string;
  field: ControllerRenderProps;
  min: number;
  max: number;
  onChange?: (value: number[]) => void;
}

export default function Range({
  label,
  className,
  field,
  min,
  max,
  onChange,
}: RangeProps) {
  const Element = (
    <DualRangeSlider
      label={(value) => value}
      value={field.value || [min, max]}
      onValueChange={(value) => {
        field.onChange(value);
        if (onChange) {
          onChange(value);
        }
      }}
      min={min}
      max={max}
      step={1}
      labelPosition="top"
      className={className}
      //{...field}
    />
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel className="mb-6">{label}</FormLabel>
      <FormControl className="block ml-2">{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
