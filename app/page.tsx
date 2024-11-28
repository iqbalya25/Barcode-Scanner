import BarcodeGenerator from "./components/BarcodeGenerator";
import BarcodeScanner from "./components/BarcodeScanner";

export default function Home() {
  return (
    <main className="p-4">
      <BarcodeGenerator />
      <div className="h-8" /> {/* spacing */}
      <BarcodeScanner />
    </main>
  );
}