import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export const FilterSidebar = () => {
  const busTypes = ["AC", "Non AC", "Seater", "Sleeper", "Semi Sleeper"];
  const departureTimes = ["Before 6 AM", "6 AM to 12 PM", "12 PM to 6 PM", "After 6 PM"];
  const amenities = ["WiFi", "Water Bottle", "Charging Point", "Reading Light", "Emergency Exit"];
  return (
    <div className="bg-card rounded-lg p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">FILTERS</h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">BUS TYPES</h4>
        <div className="space-y-3">
          {busTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} />
              <Label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm">DEPARTURE TIME</h4>
        <div className="space-y-3">
          {departureTimes.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox id={time} />
              <Label htmlFor={time} className="text-sm cursor-pointer">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm">PRICE RANGE</h4>
        <div className="px-2">
          <Slider defaultValue={[500, 2000]} max={3000} step={100} className="my-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹500</span>
            <span>₹2000</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium text-sm">AMENITIES</h4>
        <div className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={amenity} />
              <Label htmlFor={amenity} className="text-sm cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
