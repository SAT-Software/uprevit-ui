"use client";

import * as React from "react";
import { useId, useState } from "react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Tag {
  id: string;
  text: string;
}

interface TagInputProps {
  id?: string;
  label?: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
  styleClasses?: {
    tagList?: {
      container?: string;
    };
    input?: string;
    tag?: {
      body?: string;
      closeButton?: string;
    };
  };
  disabled?: boolean;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      id,
      label,
      tags,
      setTags,
      placeholder = "Add a tag",
      className,
      styleClasses,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const localId = useId();
    const inputId = id || localId;
    const [inputValue, setInputValue] = useState("");

    const addTag = (text: string) => {
      if (text.trim() !== "") {
        const newTag: Tag = {
          id: Math.random().toString(36).substring(7),
          text: text.trim(),
        };
        setTags([...tags, newTag]);
        setInputValue("");
      }
    };

    const removeTag = (id: string) => {
      setTags(tags.filter((tag) => tag.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        tags.length > 0
      ) {
        // Remove the last tag when backspace is pressed on empty input
        removeTag(tags[tags.length - 1].id);
      }
    };

    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2",
            styleClasses?.tagList?.container
          )}
        >
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              className={cn("flex items-center gap-1", styleClasses?.tag?.body)}
            >
              {tag.text}
              <button
                type="button"
                className={cn(
                  "rounded-full hover:bg-background/20",
                  styleClasses?.tag?.closeButton
                )}
                onClick={() => removeTag(tag.id)}
                disabled={disabled}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className={cn(
              "flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              styleClasses?.input
            )}
            disabled={disabled}
            {...props}
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput, type Tag };
