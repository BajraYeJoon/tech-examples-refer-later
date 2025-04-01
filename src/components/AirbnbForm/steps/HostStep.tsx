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
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";

export function HostStep() {
  const { control } = useFormContext<AirbnbFormData>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="host.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Host Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your name as it should appear to guests"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This is the name that will be shown to guests
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="host.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter your contact email"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Used for booking notifications and guest communications
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="host.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder="Enter your contact phone number"
                {...field}
              />
            </FormControl>
            <FormDescription>
              For urgent communications and guest support
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="host.bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>About You</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell guests a bit about yourself"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Share your story and hosting style with potential guests
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="host.superhost"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Superhost Status</FormLabel>
              <FormDescription>
                Indicate if you have achieved Superhost status
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="host.responseTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Response Time (hours)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={24}
                placeholder="Enter your typical response time"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              How quickly do you typically respond to inquiries?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
