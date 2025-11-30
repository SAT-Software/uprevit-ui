import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  PiBarcodeDuotone,
  PiCubeDuotone,
  PiDatabaseFill,
  PiFilePngDuotone,
  PiFolderFill,
  PiGavelDuotone,
  PiGlobeHemisphereWestFill,
  PiHashDuotone,
  PiMapPinDuotone,
  PiPenNibDuotone,
  PiQrCodeDuotone,
  PiRulerDuotone,
  PiScissorsDuotone,
  PiSealCheckDuotone,
  PiShapesFill,
  PiStackDuotone,
  PiStackFill,
  PiWarningCircleDuotone,
} from "react-icons/pi";

export default function HeroFeatureCards() {
  return (
    <div className="grid group">
      <div className="col-start-1 row-start-1 transform-none">
        <div className="[--row-height:11.3px]">
          <div className="relative grid grid-cols-[repeat(118,1fr)] grid-rows-[repeat(12,var(--row-height))] gap-y-[19px]">
            <Card className="relative flex flex-col rounded-[9.5px] border border-weak-stroke bg-background p-1 lg:rounded-lg lg:p-[11px] col-[span_27/span_27] row-span-6 xl:col-[span_22/span_22]">
              <CardHeader className="flex items-start justify-start border-subtle-stroke border-b px-1 py-0 pb-2">
                <div className="-tracking-[0.22px] flex items-center gap-x-[4.5px] font-semibold text-md text-foreground leading-[15.5px] lg:gap-x-1.5 lg:text-sm">
                  <PiGlobeHemisphereWestFill className="bg-amber-600 text-white p-1 w-6 h-6 rounded" />
                  <span>Labeling Standards</span>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiGavelDuotone size={14} />
                    <span className="truncate">Regulation Type</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiSealCheckDuotone size={14} />
                    <span className="truncate">Standard Applied</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiMapPinDuotone size={14} />
                    <span className="truncate">Market Region</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="py-0 px-0 place-content-start">
                <Badge variant="outline" className="mt-1.5">
                  Validated
                </Badge>
              </CardFooter>
            </Card>
            <Card className="relative flex flex-col rounded-[9.5px] border border-weak-stroke bg-background p-[7px] lg:rounded-xl lg:p-[11px] col-[span_27/span_27] col-start-92 row-span-6 xl:col-[span_22/span_22] xl:col-start-97">
              <CardHeader className="flex items-start justify-start border-subtle-stroke border-b px-1 py-0 pb-2">
                <div className="-tracking-[0.22px] flex items-center gap-x-[4.5px] font-semibold text-md text-foreground leading-[15.5px] lg:gap-x-1.5 lg:text-sm">
                  <PiDatabaseFill className="bg-blue-600 text-white p-1 w-6 h-6 rounded" />
                  <span>Technical Data</span>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiQrCodeDuotone size={14} />
                    <span className="truncate">UDI DI + PI</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiCubeDuotone size={14} />
                    <span className="truncate">Product Data</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiHashDuotone size={14} />
                    <span className="truncate">Mateirla Number and ...</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="py-0 px-0 place-content-start">
                <Badge variant="outline" className="mt-1.5">
                  Draft
                </Badge>
              </CardFooter>
            </Card>
            <Card className="relative flex flex-col rounded-[9.5px] border border-weak-stroke bg-background p-[7px] lg:rounded-xl lg:p-[11px] col-[span_27/span_27] col-start-11 row-span-5 row-start-8 xl:col-[span_22/span_22] xl:col-start-21">
              <CardHeader className="flex items-start justify-start border-subtle-stroke border-b px-1 py-0 pb-2">
                <div className="-tracking-[0.22px] flex items-center gap-x-[4.5px] font-semibold text-[10.9px] text-foreground leading-[15.5px] lg:gap-x-1.5 lg:text-sm">
                  <PiFolderFill className="bg-emerald-600 text-white p-1 w-6 h-6 rounded" />
                  <span>Source Files</span>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiPenNibDuotone size={14} />
                    <span className="truncate">Label Artworks</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiFilePngDuotone size={14} />
                    <span className="truncate">Stocks, Die-cut</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="py-0 px-0 place-content-start">
                <Badge variant="outline" className="mt-1.5">
                  Syncing
                </Badge>
              </CardFooter>
            </Card>
            <Card className="relative flex flex-col rounded-[9.5px] border border-weak-stroke bg-background p-[7px] lg:rounded-xl lg:p-[11px] col-[span_27/span_27] col-start-47 row-span-5 row-start-8 xl:col-[span_22/span_22] xl:col-start-49">
              <CardHeader className="flex items-start justify-start border-subtle-stroke border-b px-1 py-0 pb-2">
                <div className="-tracking-[0.22px] flex items-center gap-x-[4.5px] font-semibold text-[10.9px] text-foreground leading-[15.5px] lg:gap-x-1.5 lg:text-sm">
                  <PiStackFill className="bg-violet-600 text-white p-1 w-6 h-6 rounded" />
                  <span>Label Components</span>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiStackDuotone size={14} />
                    <span className="truncate">Label stocks</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiRulerDuotone size={14} />
                    <span className="truncate">Dimensions, Barcodes</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="py-0 px-0 place-content-start">
                <Badge variant="outline" className="mt-1.5">
                  Redlined
                </Badge>
              </CardFooter>
            </Card>
            <Card className="relative flex flex-col rounded-[9.5px] border border-weak-stroke bg-background p-[7px] lg:rounded-xl lg:p-[11px] col-[span_27/span_27] col-start-82 row-span-5 row-start-8 xl:col-[span_22/span_22] xl:col-start-77">
              <CardHeader className="flex items-start justify-start border-subtle-stroke border-b px-1 py-0 pb-2">
                <div className="-tracking-[0.22px] flex items-center gap-x-[4.5px] font-semibold text-[10.9px] text-foreground leading-[15.5px] lg:gap-x-1.5 lg:text-sm">
                  <PiShapesFill className="bg-orange-600 text-white p-1 w-6 h-6 rounded" />
                  <span>Symbols-Graphics</span>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiWarningCircleDuotone size={14} />
                    <span className="truncate">Symbols, Schematics</span>
                  </li>
                  <li className="flex w-full items-center gap-x-[4.5px] border-weak-stroke border-b px-[9.5px] pt-[4.5px] pb-[3.5px] text-[9.5px] text-tertiary-foreground max-lg:leading-[12.5px] lg:gap-x-1.5 lg:px-3 lg:pt-1.5 lg:pb-[5px] lg:text-xs">
                    <PiBarcodeDuotone size={14} />
                    <span className="truncate">Barcodes, Other Components</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="py-0 px-0 place-content-start">
                <Badge variant="outline" className="mt-1.5">
                  In Review
                </Badge>
              </CardFooter>
            </Card>

            <div className="absolute top-(--row-height) bottom-0 left-0 col-start-12 col-end-21 row-start-6 row-end-11 hidden h-[calc(100%-var(--row-height)*1.5)] w-full xl:block">
              <svg
                className="-translate-x-px h-[calc(100%+1px)] w-[calc(100%+1px)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 107 117"
              >
                <path
                  d="M1 0V52C1 74.4021 1 85.6031 5.35974 94.1596C9.19467 101.686 15.3139 107.805 22.8404 111.64C31.3968 116 42.5979 116 65 116H107"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-0 left-px bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute bottom-0 right-0 bg-muted"
                style={{ transform: "translate(50%, 50%)" }}
              ></div>
              {/* <svg
                className="absolute -top-1 left-px"
                style={{ transform: "translate(-50%, 5%)" }}
                width="40"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M3 3C3 6.72753 3 8.5913 3.60896 10.0615C4.42092 12.0217 5.97831 13.5791 7.93853 14.391C9.4087 15 11.2725 15 15 15H25C28.7275 15 30.5913 15 32.0615 14.391C34.0217 13.5791 35.5791 12.0217 36.391 10.0615C37 8.5913 37 6.72753 37 3"
                    stroke="#E4E7EC"
                  ></path>
                  <path
                    d="M22 3C22 4.10457 21.1046 5 20 5C18.8954 5 18 4.10457 18 3C18 1.89543 18.8954 1 20 1C21.1046 1 22 1.89543 22 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M5 3C5 4.10457 4.10457 5 3 5C1.89543 5 1 4.10457 1 3C1 1.89543 1.89543 1 3 1C4.10457 1 5 1.89543 5 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M39 3C39 4.10457 38.1046 5 37 5C35.8954 5 35 4.10457 35 3C35 1.89543 35.8954 1 37 1C38.1046 1 39 1.89543 39 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                </g>
              </svg> */}
            </div>
            <div className="absolute top-(--row-height) col-start-14 col-end-25 row-start-6 row-end-8 block h-[calc(100%+var(--row-height))] w-full xl:hidden">
              <svg
                className="-translate-x-px -translate-y-px w-[calc(100%+2px)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 84 49"
              >
                <path
                  d="M1 0L1 4.5C1 15.5457 9.95431 24.5 21 24.5L63 24.5C74.0457 24.5 83 33.4543 83 44.5L83 49"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <svg
                className="-translate-x-1/2 -translate-y-[3px] absolute top-0"
                width="40"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M3 3C3 6.72753 3 8.5913 3.60896 10.0615C4.42092 12.0217 5.97831 13.5791 7.93853 14.391C9.4087 15 11.2725 15 15 15H25C28.7275 15 30.5913 15 32.0615 14.391C34.0217 13.5791 35.5791 12.0217 36.391 10.0615C37 8.5913 37 6.72753 37 3"
                    stroke="#E4E7EC"
                  ></path>
                  <path
                    d="M22 3C22 4.10457 21.1046 5 20 5C18.8954 5 18 4.10457 18 3C18 1.89543 18.8954 1 20 1C21.1046 1 22 1.89543 22 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M5 3C5 4.10457 4.10457 5 3 5C1.89543 5 1 4.10457 1 3C1 1.89543 1.89543 1 3 1C4.10457 1 5 1.89543 5 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M39 3C39 4.10457 38.1046 5 37 5C35.8954 5 35 4.10457 35 3C35 1.89543 35.8954 1 37 1C38.1046 1 39 1.89543 39 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
              <svg
                className="absolute right-0 bottom-0 translate-x-1/2"
                width="40"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M37 13V13C37 9.27247 37 7.4087 36.391 5.93853C35.5791 3.97831 34.0217 2.42092 32.0615 1.60896C30.5913 1 28.7275 1 25 1L15 1C11.2725 1 9.4087 1 7.93853 1.60896C5.97831 2.42092 4.42091 3.97831 3.60896 5.93853C3 7.4087 3 9.27247 3 13V13"
                  stroke="#E4E7EC"
                ></path>
                <circle
                  cx="2"
                  cy="2"
                  r="2"
                  transform="matrix(-8.74228e-08 -1 -1 8.74228e-08 22 15)"
                  fill="white"
                  stroke="#E4E7EC"
                  stroke-width="2"
                ></circle>
                <circle
                  cx="2"
                  cy="2"
                  r="2"
                  transform="matrix(-8.74228e-08 -1 -1 8.74228e-08 39 15)"
                  fill="white"
                  stroke="#E4E7EC"
                  stroke-width="2"
                ></circle>
                <circle
                  cx="2"
                  cy="2"
                  r="2"
                  transform="matrix(-8.74228e-08 -1 -1 8.74228e-08 5 15)"
                  fill="white"
                  stroke="#E4E7EC"
                  stroke-width="2"
                ></circle>
              </svg>
            </div>
            <div className="absolute top-(--row-height) left-0 col-start-32 col-end-[-32] row-start-6 row-end-9 h-[calc(100%-2*var(--row-height))] w-full">
              <svg
                className="-translate-x-px w-[calc(100%+2px)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 661 50"
              >
                <path
                  d="M660 50L660 49C660 32.1984 660 23.7976 656.73 17.3803C653.854 11.7354 649.265 7.14598 643.62 4.26978C637.202 0.999972 628.802 0.999973 612 0.999973L49 0.999998C32.1984 0.999999 23.7976 0.999999 17.3803 4.2698C11.7354 7.14601 7.14601 11.7354 4.26981 17.3803C1 23.7976 1 32.1984 1 49L1 50"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-full left-px bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute top-full -right-px bg-muted"
                style={{ transform: "translate(50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute top-[calc(var(--row-height)/2)] left-0 col-start-28 col-end-44 row-start-4 row-end-7 h-[calc(100%-var(--row-height)/2)] w-full xl:col-start-23 xl:col-end-39">
              <svg
                className="-translate-y-px h-[calc(100%+2px)] translate-x-0.5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 191 68"
              >
                <path
                  d="M0 1L76 1C92.5685 1 106 14.4315 106 31L106 37C106 53.5685 119.431 67 136 67L191 67"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-px left-0 bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute top-(--row-height) bottom-0 left-0 col-start-99 col-end-108 row-start-6 row-end-11 hidden h-[calc(100%-var(--row-height)*1.5)] w-full xl:block">
              <svg
                className="h-[calc(100%+1px)] w-[calc(100%+1px)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 107 117"
              >
                <path
                  d="M106 0V52C106 74.4021 106 85.6031 101.64 94.1596C97.8053 101.686 91.6861 107.805 84.1596 111.64C75.6032 116 64.4021 116 42 116H-5.94008e-07"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-full left-0 bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute top-px right-0 bg-muted"
                style={{ transform: "translate(50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute col-start-55 col-end-92 row-span-4 row-start-4 w-full xl:col-end-97">
              <svg
                className="-translate-x-px -translate-y-px"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="75"
                viewBox="0 0 429 75"
              >
                <path
                  d="M0.5 75L0.500001 57.7013L0.500002 36.7987L0.500002 31C0.500003 14.4315 13.9315 1.00001 30.5 1.00002L429 1.00002"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-px right-0 bg-muted"
                style={{ transform: "translate(50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute top-(--row-height) col-start-95 col-end-106 row-start-6 row-end-8 block h-[calc(100%+var(--row-height))] w-full xl:hidden">
              <svg
                className="-translate-x-px -translate-y-px w-[calc(100%+2px)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 84 49"
              >
                <path
                  d="M83 0L83 4.5C83 15.5457 74.0457 24.5 63 24.5L21 24.5C9.9543 24.5 0.999996 33.4543 0.999996 44.5L0.999996 49"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <svg
                className="-translate-x-1/2 absolute bottom-0 left-0 translate-y-px"
                width="38"
                height="15"
                viewBox="0 0 38 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="2"
                  transform="matrix(-8.74228e-08 -1 -1 8.74228e-08 21 14)"
                  fill="white"
                  stroke="#E4E7EC"
                  stroke-width="2"
                ></circle>
              </svg>
              <svg
                className="-translate-y-[3px] absolute top-0 right-0 translate-x-1/2"
                width="40"
                height="16"
                viewBox="0 0 40 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M3 3C3 6.72753 3 8.5913 3.60896 10.0615C4.42092 12.0217 5.97831 13.5791 7.93853 14.391C9.4087 15 11.2725 15 15 15H25C28.7275 15 30.5913 15 32.0615 14.391C34.0217 13.5791 35.5791 12.0217 36.391 10.0615C37 8.5913 37 6.72753 37 3"
                    stroke="#E4E7EC"
                  ></path>
                  <path
                    d="M22 3C22 4.10457 21.1046 5 20 5C18.8954 5 18 4.10457 18 3C18 1.89543 18.8954 1 20 1C21.1046 1 22 1.89543 22 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M5 3C5 4.10457 4.10457 5 3 5C1.89543 5 1 4.10457 1 3C1 1.89543 1.89543 1 3 1C4.10457 1 5 1.89543 5 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M39 3C39 4.10457 38.1046 5 37 5C35.8954 5 35 4.10457 35 3C35 1.89543 35.8954 1 37 1C38.1046 1 39 1.89543 39 3Z"
                    fill="white"
                    stroke="#E4E7EC"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="absolute top-[calc(var(--row-height)/2-1.5px)] col-start-38 col-end-47 row-start-10 row-end-11 xl:col-start-43 xl:col-end-49">
              <svg
                className="translate-y-[0.5px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 70 2"
              >
                <path
                  d="M0 1L70 1.00001"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-px left-0 bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute top-px right-0 bg-muted"
                style={{ transform: "translate(50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute top-[calc(var(--row-height)/2-1.5px)] col-start-74 col-end-82 row-start-10 row-end-11 xl:col-start-71 xl:col-end-77">
              <svg
                className="translate-y-px"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                viewBox="0 0 70 2"
              >
                <path
                  d="M0 1L70 1.00001"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                  stroke-dashoffset="0px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-px left-0 bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute top-px right-0 bg-muted"
                style={{ transform: "translate(50%, -50%)" }}
              ></div>
            </div>
            <div className="absolute top-0 left-0 col-start-60 row-start-13">
              <svg
                className="-translate-x-px"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                width="2"
                height="80"
                viewBox="0 0 2 80"
              >
                <path
                  d="M1 0v80"
                  stroke="#E4E7EC"
                  pathLength="1"
                  stroke-dasharray="1px 1px"
                ></path>
              </svg>
              <div
                className="w-2 h-2 rounded-full border absolute top-0 left-px bg-muted"
                style={{ transform: "translate(-50%, -50%)" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border absolute bottom-0 left-px bg-muted"
                style={{ transform: "translate(-50%, 50%)" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
