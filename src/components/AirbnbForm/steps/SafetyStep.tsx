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
import { Switch } from "../../ui/switch";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { AlertTriangle } from "lucide-react";

export function SafetyStep() {
  const { control, watch } = useFormContext<AirbnbFormData>();
  const safety = watch("safety");

  // Check if at least one safety feature is enabled
  const hasAnySafetyFeature = Object.values(safety || {}).some(
    (value) => value === true
  );

  return (
    <div className="space-y-6">
      {!hasAnySafetyFeature && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Safety Features Required</AlertTitle>
          <AlertDescription>
            You must enable at least one safety feature to list your property
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={control}
        name="safety.smokeDetector"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Smoke Detector</FormLabel>
              <FormDescription>
                Working smoke detector in every room
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
        name="safety.firstAidKit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">First Aid Kit</FormLabel>
              <FormDescription>Easily accessible first aid kit</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="safety.fireExtinguisher"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Fire Extinguisher</FormLabel>
              <FormDescription>
                Working fire extinguisher in an accessible location
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
        name="safety.carbonMonoxideDetector"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Carbon Monoxide Detector
              </FormLabel>
              <FormDescription>
                Working carbon monoxide detector in every room
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Safety Checklist</h3>
        <ul className="list-disc list-inside space-y-2">
          <li
            className={
              safety?.smokeDetector ? "text-green-600" : "text-red-600"
            }
          >
            Smoke Detector
          </li>
          <li
            className={safety?.firstAidKit ? "text-green-600" : "text-red-600"}
          >
            First Aid Kit
          </li>
          <li
            className={
              safety?.fireExtinguisher ? "text-green-600" : "text-red-600"
            }
          >
            Fire Extinguisher
          </li>
          <li
            className={
              safety?.carbonMonoxideDetector ? "text-green-600" : "text-red-600"
            }
          >
            Carbon Monoxide Detector
          </li>
        </ul>
      </div>
    </div>
  );
}
