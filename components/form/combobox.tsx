"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

type ComboboxProps = {
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  field: ControllerRenderProps;
  options: { value: string; label: string }[];
};

export function Combobox(props: ComboboxProps) {
  const { options, label, onChange, onInputChange, className, placeholder, field } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');  

  const Element = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[200px] justify-between", className)}
        >
          {field.value
            ? options.find((option) => option.value === field.value)?.label
            : "Select ..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {            
            const option = options.find(o => o.value === value);
            return option?.label.includes(search) ? 1 : 0;
          }}
        >
          <CommandInput
            onValueChange={(value) => {
              setSearch(value);
              onInputChange?.(value);
            }}
            placeholder={placeholder || "Search ..."}
            className="h-9"
          />
          <CommandList>
            {search && <CommandEmpty>No data found.</CommandEmpty>}
            <CommandGroup className="p-0">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const o = options.find(
                      (o) => o.value === currentValue
                    );
                    const value = o?.value === field.value ? '' : o?.value;

                    field.onChange(value);
                    onChange?.(value || '');

                    if (value && o) {
                      setSearch(o.label);
                    } else {
                      setSearch('');
                    }
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      field.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  if (!label) {
    return Element;
  }

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>{Element}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
