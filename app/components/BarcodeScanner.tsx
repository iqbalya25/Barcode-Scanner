"use client";

import React, { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface WorkOrder {
  partNumber: string;
  date: string;
  supervisor: string;
}

const BarcodeScanner = () => {
  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    partNumber: "",
    date: "",
    supervisor: "",
  });
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setError("");
      }
    } catch (err) {
      setError("Failed to access camera");
      console.error("Camera Error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current) return;

    try {
      // Create canvas and draw video frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/jpeg",
          1.0
        );
      });

      // Create file from blob
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

      // Create QR scanner instance
      const html5QrCode = new Html5Qrcode("qr-reader");

      try {
        const result = await html5QrCode.scanFile(file, true);
        console.log("Scanned result:", result);

        const [partNumber, date, supervisor] = result.split("|");
        setWorkOrder({
          partNumber: partNumber || "",
          date: date || "",
          supervisor: supervisor || "",
        });
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("No barcode found in captured image");
        setError("No barcode detected. Please try again.");
      } finally {
        await html5QrCode.clear();
      }
    } catch (err) {
      console.error("Capture Error:", err);
      setError("Failed to capture image");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Barcode Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={scanning ? stopCamera : startCamera}
              className="w-full mb-4"
            >
              {scanning ? "Stop Camera" : "Start Camera"}
            </Button>

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              {scanning && (
                <Button
                  onClick={captureAndScan}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2
                           bg-white text-black hover:bg-gray-200"
                >
                  <Camera className="mr-2" /> Capture and Scan
                </Button>
              )}
            </div>

            {/* Hidden div for QR scanner */}
            <div id="qr-reader" style={{ display: "none" }}></div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label>Part Number</Label>
              <Input value={workOrder.partNumber} readOnly />
            </div>
            <div>
              <Label>Date</Label>
              <Input value={workOrder.date} readOnly />
            </div>
            <div>
              <Label>Supervisor</Label>
              <Input value={workOrder.supervisor} readOnly />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
