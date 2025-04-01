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
import { Switch } from "../../ui/switch";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function AvailabilityStep() {
  const { control, setValue, watch } = useFormContext<AirbnbFormData>();
  const availability = watch("availability");

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="availability.startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Available From</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={`w-[240px] pl-3 text-left font-normal ${
                      !field.value && "text-muted-foreground"
                    }`}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() ||
                    (availability?.endDate && date > availability.endDate)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              When is your property available for booking?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="availability.endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Available Until</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={`w-[240px] pl-3 text-left font-normal ${
                      !field.value && "text-muted-foreground"
                    }`}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() ||
                    (availability?.startDate && date < availability.startDate)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              When does your property's availability end?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="availability.minStay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Stay (nights)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              What is the minimum number of nights guests must book?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="availability.maxStay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Stay (nights)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              What is the maximum number of nights guests can book? (Optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="availability.instantBook"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Instant Book</FormLabel>
              <FormDescription>
                Allow guests to book instantly without requiring your approval
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
