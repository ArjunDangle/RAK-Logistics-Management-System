import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator as CalcIcon, Truck } from "lucide-react";

interface ShippingRate {
  carrier: string;
  cost: number;
  deliveryTime: string;
  chargedWeight: number;
}

const Calculator = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [volumetricWeight, setVolumetricWeight] = useState<number | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);

  const calculateVolumetric = (length: number, width: number, height: number) => {
    const volumetric = (length * width * height) / 5000;
    setVolumetricWeight(volumetric);
    return volumetric;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Auto-calculate volumetric weight when dimensions change
    if (["length", "width", "height"].includes(id)) {
      const updatedData = { ...formData, [id]: value };
      const l = parseFloat(updatedData.length) || 0;
      const w = parseFloat(updatedData.width) || 0;
      const h = parseFloat(updatedData.height) || 0;
      if (l && w && h) {
        calculateVolumetric(l, w, h);
      }
    }
  };

  const calculateRates = (e: React.FormEvent) => {
    e.preventDefault();
    
    const grossWeight = parseFloat(formData.weight);
    const volWeight = volumetricWeight || 0;
    const chargedWeight = Math.max(grossWeight, volWeight);

    // Mock shipping rates
    const mockRates: ShippingRate[] = [
      {
        carrier: "FedEx Express",
        cost: chargedWeight * 12.5,
        deliveryTime: "1-2 business days",
        chargedWeight,
      },
      {
        carrier: "UPS Ground",
        cost: chargedWeight * 8.3,
        deliveryTime: "3-5 business days",
        chargedWeight,
      },
      {
        carrier: "DHL Express",
        cost: chargedWeight * 14.2,
        deliveryTime: "1-3 business days",
        chargedWeight,
      },
      {
        carrier: "USPS Priority",
        cost: chargedWeight * 6.5,
        deliveryTime: "2-3 business days",
        chargedWeight,
      },
    ];

    setRates(mockRates);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Logistics Cost Calculator</h1>
        <p className="text-muted-foreground mt-1">Calculate shipping costs across multiple carriers</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="h-5 w-5 text-primary" />
              Shipping Cost Estimator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateRates} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin Postal Code</Label>
                  <Input
                    id="origin"
                    placeholder="e.g., 10001"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination Postal Code</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., 90001"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Package Gross Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5.5"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label className="mb-2 block">Package Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-xs text-muted-foreground">
                      Length
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      placeholder="L"
                      value={formData.length}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-xs text-muted-foreground">
                      Width
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="W"
                      value={formData.width}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-xs text-muted-foreground">
                      Height
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="H"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {volumetricWeight !== null && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Volumetric Weight</p>
                  <p className="text-2xl font-bold">{volumetricWeight.toFixed(2)} kg</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated using dimensional weight formula (L × W × H ÷ 5000)
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Calculate Shipping Costs
              </Button>
            </form>
          </CardContent>
        </Card>

        {rates.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Available Shipping Options</h2>
            {rates.map((rate, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{rate.carrier}</h3>
                        <p className="text-sm text-muted-foreground">{rate.deliveryTime}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Charged weight: {rate.chargedWeight.toFixed(2)} kg
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">${rate.cost.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Estimated cost</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
