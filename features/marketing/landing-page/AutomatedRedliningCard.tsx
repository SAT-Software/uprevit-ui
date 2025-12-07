import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  PiCaretCircleDownDuotone,
  PiHashDuotone,
  PiPackageDuotone,
  PiPlusCircleDuotone,
  PiRulerDuotone,
  PiScalesDuotone,
  PiTextAlignLeftDuotone,
} from "react-icons/pi";

export function AutomatedRedliningCard() {
  return (
    <div className="relative w-2/3 h-full bg-background p-10 rounded-xl border border-border flex flex-col overflow-hidden group">
      <div className=" z-10 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Automated- Redlining
          </h3>
          <p className="w-2/3 text-muted-foreground leading-relaxed">
            No manual redlining of older versions. Get automated redlining copy
            with master version
          </p>
        </div>

        <div className="absolute -bottom-16 -right-20 w-full flex-1 min-h-0">
          <div className="p-2 bg-accent rounded-2xl">
            <div className="relative h-full bg-background rounded-t-xl border border-border shadow-md overflow-hidden flex flex-col">
              <div className="flex items-center justify-start gap-4 px-2 py-2 border-b bg-muted/30">
                <div className="text-xs font-bold text-foreground">
                  Label Components
                </div>
                <div className="flex items-center gap-2">
                  <button className="py-0.5 px-1 inline-flex rounded-lg items-center gap-1 text-[10px] bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80">
                    <PiPlusCircleDuotone className="h-2.5 w-2.5 text-muted-foreground" />
                    New Version
                  </button>
                  <button className="py-0.5 px-1 inline-flex rounded-lg items-center gap-1 text-[10px] bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80">
                    <PiCaretCircleDownDuotone className="h-2.5 w-2.5 text-muted-foreground" />
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
                      <TableHead className="h-8 w-[150px]">
                        <div className="flex items-center gap-1 text-[10px] xl:text-[10px]">
                          <PiScalesDuotone className="h-3.5 w-3.5 text-muted-foreground" />
                          Weight
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Row 1 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        1001
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Chassis Assy V1
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Chassis Assy V2
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Main structural base - Aluminum
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Main structural base - Steel alloy
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            450mm x 300mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            455mm x 305mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            1.20kg
                          </span>
                          <span className="text-emerald-600 font-medium">
                            1.55kg
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 2 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        1042
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Power Supply Unit
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Power Supply Unit Gen2
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            12V output, non-modular
                          </span>
                          <span className="text-emerald-600 font-medium">
                            12V output, fully modular
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            140mm x 150mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            140mm x 160mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            1.45kg
                          </span>
                          <span className="text-emerald-600 font-medium">
                            1.60kg
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 3 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        2055
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Warning Label
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Warning Label ISO
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Text only warning
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Pictogram + text warning
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            50mm x 25mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            50mm x 50mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            0.02g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            0.04g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 4 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        3010
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Cooling Fan
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Cooling Fan (High RPM)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Standard bearing
                          </span>
                          <span className="text-emerald-600 font-medium">
                            MagLev bearing system
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            120mm x 120mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            120mm x 120mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            150g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            145g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 5 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        3045
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Control Board
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Control Board V3
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Single core MCU
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Dual core MCU with WiFi
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            80mm x 60mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            85mm x 65mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            85g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            92g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 6 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        4102
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Connector Housing
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Connector Housing IP67
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Standard plastic
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Reinforced polymer
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            20mm x 15mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            22mm x 18mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            8g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            9.5g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 7 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        4500
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Display Panel
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Touch Display Panel
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            LCD 5-inch
                          </span>
                          <span className="text-emerald-600 font-medium">
                            OLED 5.5-inch
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            120mm x 80mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            125mm x 85mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            180g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            165g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Row 8 */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-medium align-top">
                        5021
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            Battery Pack
                          </span>
                          <span className="text-emerald-600 font-medium">
                            Battery Pack Li-Ion
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            3000mAh capacity
                          </span>
                          <span className="text-emerald-600 font-medium">
                            4500mAh capacity
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            90mm x 50mm
                          </span>
                          <span className="text-emerald-600 font-medium">
                            95mm x 55mm
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-[10px] xl:text-[10px] font-mono align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-red-500 line-through opacity-70">
                            250g
                          </span>
                          <span className="text-emerald-600 font-medium">
                            310g
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Filler row */}
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell className="py-1 h-8" colSpan={4} />
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
