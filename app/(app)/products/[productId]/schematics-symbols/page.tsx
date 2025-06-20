import SchematicsSymbolsTabs from "../../../../../features/products/product/graphics-other-components/SchematicsSymbolsTabs";

const SchematicData = [
  {
    id: "1",
    componentName: "Main Schematic",
    componentDescription: "Main power distribution schematic.",
    componentImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
    note: "Main power distribution schematic.",
  },
  {
    id: "2",
    componentName: "Auxiliary Schematic",
    componentDescription: "Auxiliary systems wiring.",
    componentImage:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
    note: "Auxiliary systems wiring.",
  },
];

const BarcodesData = [
  {
    id: "3",
    componentName: "Project Alpha Barcode",
    componentDescription: "Legacy project barcode schematic.",
    componentImage:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80",
    note: "Legacy project barcode.",
  },
];

const otherComponentsData = [
  {
    id: "4",
    componentName: "Package A",
    componentDescription: "Medical device symbol set.",
    componentImage:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=200&q=80",
    note: "Medical device symbol set.",
  },
];

const SymbolsData = [
  {
    id: "5",
    componentName: "Electrical Symbols",
    componentDescription: "Standard electrical symbols set.",
    componentImage:
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=200&q=80",
    note: "Standard electrical symbols set.",
  },
  {
    id: "6",
    componentName: "Mechanical Symbols",
    componentDescription: "Mechanical engineering symbols.",
    componentImage:
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=200&q=80",
    note: "Mechanical engineering symbols.",
  },
];

export default function Page() {
  return (
    <SchematicsSymbolsTabs
      schematicData={SchematicData}
      barcodesData={BarcodesData}
      otherComponentsData={otherComponentsData}
      symbolsData={SymbolsData}
    />
  );
}
