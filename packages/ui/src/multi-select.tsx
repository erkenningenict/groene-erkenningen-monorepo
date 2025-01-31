// copied and adjusted from https://github.com/sersavan/shadcn-multi-select-component
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Plus, X } from "lucide-react";

import { Separator } from "./separator";
import { Button } from "./button";
import { Badge } from "./badge";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { cn } from "./lib/utils";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva("", {
  variants: {
    variant: {
      default: "border-foreground text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxDisplayCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /**
   * Optionally set to `false` to turn off the automatic filtering and sorting.
   * If `false`, you must conditionally render valid items based on the search query yourself.
   */
  shouldFilter?: boolean;

  /**
   * Maximum number of items to be selected. Selecting items will be disabled when the maximum is reached.
   * Optional, defaults to Infinity.
   */
  maxSelectAmount?: number;
  searchInputPlaceholder?: string;
  selectAllText?: string;
  moreText?: string;
  noResultsFoundText?: string;
  clearText?: string;
  closeText?: string;
  showClearIcon?: boolean;
  onSearchValueChanged?: (value: string) => void;
  showToggleAll?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      onSearchValueChanged,
      shouldFilter,
      showToggleAll,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxDisplayCount = 3,
      maxSelectAmount = Infinity,
      modalPopover = false,
      asChild = false,
      className,
      searchInputPlaceholder = "Search",
      selectAllText = "Select all",
      moreText = "More",
      noResultsFoundText = "No results found",
      clearText = "Clear",
      closeText = "Close",
      showClearIcon = false,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handlePopupOnOpenChange = (open: boolean) => {
      setIsPopoverOpen(open);
      onSearchValueChanged && onSearchValueChanged("");
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxDisplayCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const canSelectMore = maxSelectAmount > selectedValues.length;

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={handlePopupOnOpenChange}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full rounded-md border border-slate-200 min-h-12 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto pl-2.5 pr-2",
              className,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center gap-1">
                  {selectedValues.slice(0, maxDisplayCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className={cn(
                          multiSelectVariants({ variant }),
                          "whitespace-normal text-left",
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {option?.label}
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                        />
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxDisplayCount && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        multiSelectVariants({ variant }),
                      )}
                    >
                      {`+ ${selectedValues.length - maxDisplayCount} ${moreText}`}
                      <X
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {showClearIcon && (
                    <>
                      <X
                        className="h-4 mx-2 cursor-pointer text-muted-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClear();
                        }}
                      />
                      <Separator
                        orientation="vertical"
                        className="flex min-h-6 h-full"
                      />
                    </>
                  )}
                  <ChevronDown className="h-4 mx-1 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command shouldFilter={shouldFilter}>
            <CommandInput
              onValueChange={onSearchValueChanged}
              placeholder={searchInputPlaceholder}
            />
            {showToggleAll && (
              <div className="mx-1 pt-0.5 px-1.5">
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className={`cursor-pointer flex flex-row justify-between gap-2 -mx-1.5 px py-2`}
                >
                  <span className={cn("leading-normal text-sm")}>
                    {selectAllText}
                  </span>
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm",
                    )}
                  >
                    {selectedValues.length === options.length ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              </div>
            )}
            <CommandList className="max-h-40 md:max-h-[300px]">
              <CommandEmpty>{noResultsFoundText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      disabled={!isSelected && !canSelectMore}
                      className={cn(
                        `cursor-pointer flex flex-row justify-between gap-2
                        data-[selected=true]:!bg-slate-700 data-[selected=true]:text-white my-0.5`,
                        isSelected ? "!bg-slate-800 !text-white" : "",
                      )}
                    >
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "leading-normal text-sm group:data-[selected=true]:text-white",
                        )}
                      >
                        {option.label}
                      </span>
                      {isSelected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="w-full px-3">
            <Separator orientation="horizontal" className="flex w-full" />
          </div>
          <div className="flex items-center justify-between gap-2 w-full px-3 py-2">
            {selectedValues.length > 0 && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleClear}
                >
                  {clearText}
                </Button>
                <Separator
                  orientation="vertical"
                  className="flex min-h-6 h-full"
                />
              </>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => setIsPopoverOpen(false)}
            >
              {closeText}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
