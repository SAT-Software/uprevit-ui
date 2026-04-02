import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { TextLoop } from "@uprevit/ui/components/ui/text-loop";
import { TextMorph } from "@uprevit/ui/components/ui/text-morph";
import { TextScramble } from "@uprevit/ui/components/ui/text-scramble";
import { cn } from "@uprevit/ui/lib/utils";
import { useState } from "react";
import {
  PiCaretCircleDownDuotone,
  PiHashDuotone,
  PiPackageDuotone,
  PiPlusCircleDuotone,
  PiRulerDuotone,
  PiTagDuotone,
  PiTextAlignLeftDuotone,
} from "react-icons/pi";
import { useTouchCardActivation } from "./useTouchCardActivation";

type RowData = {
  no: string;
  name: { clean: string; redline?: { old: string; new: string } };
  description: { clean: string; redline?: { old: string; new: string } };
  dimension: { clean: string; redline?: { old: string; new: string } };
  labelTypes: {
    clean: string[];
    redline?: { old: string[]; new: string[] };
  };
};

const CellContent = ({
  data,
  isMono = false,
  TextScrambleTrigger,
}: {
  data: { clean: string; redline?: { old: string; new: string } };
  isMono?: boolean;
  TextScrambleTrigger?: boolean;
}) => {
  if (data.redline) {
    return (
      <div className="relative min-h-8">
        <div className="absolute inset-0 flex flex-col gap-0.5">
          <TextScramble
            trigger={TextScrambleTrigger}
            className="text-muted-foreground group-hover:text-red-500 group-hover:dark:text-red-400 group-data-[active=true]:text-red-500 group-data-[active=true]:dark:text-red-400 transition-all duration-500 ease-in-out line-through opacity-100"
          >
            {data.redline.old}
          </TextScramble>
          <TextScramble
            trigger={TextScrambleTrigger}
            className="text-muted-foreground group-hover:text-emerald-600 group-hover:dark:text-emerald-400 group-data-[active=true]:text-emerald-600 group-data-[active=true]:dark:text-emerald-400 transition-all duration-500 ease-in-out opacity-50 group-hover:opacity-100 group-data-[active=true]:opacity-100 font-medium"
          >
            {data.redline.new}
          </TextScramble>
        </div>
      </div>
    );
  }
  return <span className={cn(isMono && "font-mono")}>{data.clean}</span>;
};

const LabelTypesBadge = ({
  data,
}: {
  data: { clean: string[]; redline?: { old: string[]; new: string[] } };
}) => {
  if (data.redline) {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-wrap gap-0.5">
          {data.redline.old.map((label, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-[8px] text-muted-foreground group-hover:text-red-500 group-hover:dark:text-red-300 duration-300 ease-in-out delay-300 line-through opacity-70"
            >
              {label}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-0.5">
          {data.redline.new.map((label, idx) => (
            <Badge
              key={idx}
              variant="default"
              className="text-[8px] bg-emerald-100/50 text-foreground group-hover:text-emerald-600 group-hover:dark:text-emerald-300 duration-300 ease-in-out delay-300 opacity-0 -mt-2 group-hover:opacity-100 group-hover:mt-0 transition-all border border-emerald-600"
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-0.5">
      {data.clean.map((label, idx) => (
        <Badge
          key={idx}
          variant="outline"
          className="text-[8px] py-0 px-1 h-3.5"
        >
          {label}
        </Badge>
      ))}
    </div>
  );
};

const tableData: RowData[] = [
  {
    no: "1001",
    name: {
      clean: "Chassis Assy V2",
      redline: { old: "Chassis Assy V1", new: "Chassis Assy V2" },
    },
    description: {
      clean: "Main structural base - Steel alloy",
      redline: {
        old: "Main structural base - Aluminum",
        new: "Main structural base - Steel alloy",
      },
    },
    dimension: {
      clean: "455mm x 305mm",
      redline: { old: "450mm x 300mm", new: "455mm x 305mm" },
    },
    labelTypes: {
      clean: ["Pouch", "Carton"],
      redline: { old: ["Pouch"], new: ["Pouch", "Carton"] },
    },
  },
  {
    no: "1042",
    name: {
      clean: "Power Supply Unit Gen2",
    },
    description: {
      clean: "12V output, fully modular",
      redline: {
        old: "12V output, non-modular",
        new: "12V output, fully modular",
      },
    },
    dimension: {
      clean: "140mm x 160mm",
    },
    labelTypes: {
      clean: ["Box"],
    },
  },
  {
    no: "2055",
    name: {
      clean: "Warning Label ISO",
      redline: { old: "Warning Label", new: "Warning Label ISO" },
    },
    description: {
      clean: "Pictogram + text warning",
    },
    dimension: {
      clean: "50mm x 50mm",
      redline: { old: "50mm x 25mm", new: "50mm x 50mm" },
    },
    labelTypes: {
      clean: ["Tyvek"],
    },
  },
  {
    no: "3010",
    name: {
      clean: "Cooling Fan (High RPM)",
      redline: { old: "Cooling Fan", new: "Cooling Fan (High RPM)" },
    },
    description: {
      clean: "MagLev bearing system",
      redline: { old: "Standard bearing", new: "MagLev bearing system" },
    },
    dimension: {
      clean: "120mm x 120mm",
    },
    labelTypes: {
      clean: ["Jar", "Pouch"],
      redline: { old: ["Jar"], new: ["Jar", "Pouch"] },
    },
  },
  {
    no: "3045",
    name: {
      clean: "Control Board V3",
    },
    description: {
      clean: "Dual core MCU with WiFi",
      redline: { old: "Single core MCU", new: "Dual core MCU with WiFi" },
    },
    dimension: {
      clean: "85mm x 65mm",
      redline: { old: "80mm x 60mm", new: "85mm x 65mm" },
    },
    labelTypes: {
      clean: ["Pouch 2"],
    },
  },
  {
    no: "4102",
    name: {
      clean: "Connector Housing IP67",
    },
    description: {
      clean: "Reinforced polymer",
    },
    dimension: {
      clean: "22mm x 18mm",
      redline: { old: "20mm x 15mm", new: "22mm x 18mm" },
    },
    labelTypes: {
      clean: ["Carton", "Box"],
      redline: { old: ["Carton"], new: ["Carton", "Box"] },
    },
  },
  {
    no: "4500",
    name: {
      clean: "Touch Display Panel",
      redline: { old: "Display Panel", new: "Touch Display Panel" },
    },
    description: {
      clean: "OLED 5.5-inch",
      redline: { old: "LCD 5-inch", new: "OLED 5.5-inch" },
    },
    dimension: {
      clean: "125mm x 85mm",
    },
    labelTypes: {
      clean: ["Tyvek"],
    },
  },
  {
    no: "5021",
    name: {
      clean: "Battery Pack Li-Ion",
    },
    description: {
      clean: "4500mAh capacity",
      redline: { old: "3000mAh capacity", new: "4500mAh capacity" },
    },
    dimension: {
      clean: "95mm x 55mm",
      redline: { old: "90mm x 50mm", new: "95mm x 55mm" },
    },
    labelTypes: {
      clean: ["Jar", "Pouch 2"],
      redline: { old: ["Jar"], new: ["Jar", "Pouch 2"] },
    },
  },
];

export function AutomatedRedliningCard() {
  const [TextScrambleTrigger, setTextScrambleTrigger] = useState(false);
  const { isTouchActive, activateTouch, deactivateTouch, scheduleTouchDeactivate } =
    useTouchCardActivation();

  return (
    <div
      onMouseEnter={() => {
        setTextScrambleTrigger(true);
      }}
      onMouseLeave={() => {
        setTextScrambleTrigger(false);
      }}
      onTouchStart={() => {
        activateTouch();
        setTextScrambleTrigger(true);
      }}
      onTouchEnd={() => {
        scheduleTouchDeactivate();
        setTextScrambleTrigger(false);
      }}
      onTouchCancel={() => {
        deactivateTouch();
        setTextScrambleTrigger(false);
      }}
      data-active={isTouchActive ? "true" : undefined}
      className="lg:relative group w-full lg:w-2/3 h-125 lg:h-full bg-background p-4 md:p-4 lg:p-8 rounded-xl border border-border flex flex-col overflow-hidden group transition-all duration-300 ease-in-out delay-300"
    >
      <div className="z-10 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-base md:text-base lg:text-lg font-semibold text-foreground mb-2">
            Automated Redlining
          </h3>
          <p className="text-xs md:text-sm lg:text-base w-full lg:w-2/3 text-muted-foreground leading-relaxed text-balance">
            No manual redlining of older versions. Get automated redlining copy
            with master version
          </p>
        </div>

        <div className="lg:absolute -bottom-16 lg:-right-20 w-full flex-1 min-h-0 transition-transform duration-300 ease-in-out delay-300">
          <div className="p-1 bg-accent border border-border rounded-2xl">
            <div className="relative h-full bg-background rounded-t-[15px] border border-border shadow-md overflow-hidden flex flex-col">
              <div className="flex flex-col items-start gap-2 px-2 py-2 sm:flex-row sm:items-center sm:justify-start sm:gap-4 border-b bg-muted/30">
                <div className="text-xs font-bold text-foreground">
                  Label Components
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                  <button className="py-0.5 px-1 inline-flex rounded-lg items-center gap-1 text-[10px] bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80">
                    <PiPlusCircleDuotone className="h-2.5 w-2.5 text-muted-foreground" />
                    Version 2
                  </button>
                  <button className="py-0.5 px-1 inline-flex rounded-lg items-center gap-1 text-[10px] bg-secondary text-secondary-foreground border border-border group-hover:bg-purple-100/50 group-hover:dark:bg-purple-900/50 group-hover:border-purple-500 group-data-[active=true]:bg-purple-100/50 group-data-[active=true]:dark:bg-purple-900/50 group-data-[active=true]:border-purple-500 transition-all duration-300 ease-in-out delay-100">
                    <PiCaretCircleDownDuotone className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary group-data-[active=true]:text-primary" />
                    View Redline
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-accent/60 border-border">
                      <TableHead className="w-[60px] h-8 border-r border-border last:border-r-0">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiHashDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          No
                        </div>
                      </TableHead>
                      <TableHead className="h-8 w-[160px] border-r border-border last:border-r-0">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiPackageDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          Name
                        </div>
                      </TableHead>
                      <TableHead className="h-8 w-[250px] border-r border-border last:border-r-0">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiTextAlignLeftDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          Description
                        </div>
                      </TableHead>
                      <TableHead className="h-8 w-[150px] border-r border-border last:border-r-0">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiRulerDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          Dimension
                        </div>
                      </TableHead>
                      {/* <TableHead className="h-8 w-[150px]">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiTagDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          Label Types
                        </div>
                      </TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow
                        key={row.no}
                        className="border-border hover:bg-transparent"
                      >
                        <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                          {row.no}
                        </TableCell>
                        <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                          <CellContent
                            data={row.name}
                            TextScrambleTrigger={TextScrambleTrigger}
                          />
                        </TableCell>
                        <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                          <CellContent
                            data={row.description}
                            TextScrambleTrigger={TextScrambleTrigger}
                          />
                        </TableCell>
                        <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                          <CellContent
                            data={row.dimension}
                            isMono
                            TextScrambleTrigger={TextScrambleTrigger}
                          />
                        </TableCell>
                        {/* <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                          <LabelTypesBadge data={row.labelTypes} />
                        </TableCell> */}
                      </TableRow>
                    ))}

                    {/* Filler row */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 h-8" colSpan={5} />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
