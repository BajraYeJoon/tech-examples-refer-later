import { useFormContext } from "react-hook-form";
import { type AirbnbFormData } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useState, useEffect } from "react";

export function PricingStep() {
  const { control, watch } = useFormContext<AirbnbFormData>();
  const pricing = watch("pricing");
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price when pricing values change
  useEffect(() => {
    const basePrice = pricing?.basePrice || 0;
    const cleaningFee = pricing?.cleaningFee || 0;
    const serviceFee = pricing?.serviceFee || 0;
    const taxes = pricing?.taxes || 0;

    const total = basePrice + cleaningFee + serviceFee + taxes;
    setTotalPrice(total);
  }, [pricing]);

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="pricing.basePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Price per Night</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Enter the base price per night"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>Set your standard nightly rate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing.cleaningFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cleaning Fee</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Enter the cleaning fee"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              One-time fee for cleaning services
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing.serviceFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Fee</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Enter the service fee"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Additional fee for services provided
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing.taxes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taxes</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Enter applicable taxes"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>Local taxes and fees</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing.weeklyDiscount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weekly Discount (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter weekly discount percentage"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Discount for stays of 7 nights or more
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing.monthlyDiscount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Discount (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter monthly discount percentage"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Discount for stays of 28 nights or more
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Price Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span>${pricing?.basePrice || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Cleaning Fee:</span>
            <span>${pricing?.cleaningFee || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee:</span>
            <span>${pricing?.serviceFee || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes:</span>
            <span>${pricing?.taxes || 0}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
