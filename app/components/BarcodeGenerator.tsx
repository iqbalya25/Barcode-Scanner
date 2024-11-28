"use client";
import React, { useState } from "react";
import { useBarcode } from "react-barcodes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const BarcodeGenerator = () => {
  const [barcodeData, setBarcodeData] = useState("");
  const { inputRef } = useBarcode({
    value: barcodeData || "SAMPLE-123|2024-01-01|JOHN DOE",
    options: {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: true,
    },
  });

  const generateTestData = () => {
    const partNumber = `PART-${Math.floor(Math.random() * 1000)}`;
    const date = new Date().toISOString().split("T")[0];
    const supervisors = ["John Doe", "Jane Smith", "Mike Johnson"];
    const supervisor =
      supervisors[Math.floor(Math.random() * supervisors.length)];

    setBarcodeData(`${partNumber}|${date}|${supervisor}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Barcode Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="barcodeInput">Barcode Data</Label>
            <div className="flex gap-2">
              <Input
                id="barcodeInput"
                value={barcodeData}
                onChange={(e) => setBarcodeData(e.target.value)}
                placeholder="Enter barcode data"
                className="flex-1"
              />
              <Button onClick={generateTestData}>Generate Test Data</Button>
            </div>
          </div>

          <div className="flex justify-center p-4 bg-white">
            <svg ref={inputRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
/////
export default BarcodeGenerator;
