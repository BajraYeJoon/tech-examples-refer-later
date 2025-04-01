import { useFormContext } from "react-hook-form";
import { type AirbnbFormData, AMENITIES_LIST } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";

export function AmenitiesStep() {
  const { control, setValue, watch } = useFormContext<AirbnbFormData>();
  const [customAmenity, setCustomAmenity] = useState("");
  const amenities = watch("amenities") || [];

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = new Set(amenities);
    if (currentAmenities.has(amenity)) {
      currentAmenities.delete(amenity);
    } else {
      currentAmenities.add(amenity);
    }
    setValue("amenities", Array.from(currentAmenities));
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity)) {
      setValue("amenities", [...amenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="amenities"
        render={() => (
          <FormItem>
            <FormLabel>Available Amenities</FormLabel>
            <FormDescription>
              Select all the amenities available at your property
            </FormDescription>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {AMENITIES_LIST.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity.charAt(0).toUpperCase() +
                      amenity.slice(1).replace("_", " ")}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel>Add Custom Amenity</FormLabel>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter a custom amenity"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleAddCustomAmenity}
            disabled={!customAmenity.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      {amenities.length > 0 && (
        <div>
          <FormLabel>Selected Amenities</FormLabel>
          <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
              >
                {amenity}
                <button
                  type="button"
                  className="ml-2 hover:text-destructive"
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
