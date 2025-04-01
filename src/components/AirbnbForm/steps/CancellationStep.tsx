import { useFormContext } from "react-hook-form";
import { type AirbnbFormData, CANCELLATION_POLICIES } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";

const POLICY_DESCRIPTIONS = {
  flexible: "Full refund 1 day prior to arrival",
  moderate: "Full refund 5 days prior to arrival",
  strict: "Full refund 14 days prior to arrival",
} as const;

export function CancellationStep() {
  const { control, setValue, watch } = useFormContext<AirbnbFormData>();
  const [customRule, setCustomRule] = useState("");
  const customRules = watch("cancellation.customRules") || [];

  const handleAddCustomRule = () => {
    if (customRule.trim()) {
      setValue("cancellation.customRules", [...customRules, customRule.trim()]);
      setCustomRule("");
    }
  };

  const handleRemoveCustomRule = (index: number) => {
    setValue(
      "cancellation.customRules",
      customRules.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="cancellation.policy"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Cancellation Policy</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-4"
              >
                {CANCELLATION_POLICIES.map((policy) => (
                  <FormItem
                    key={policy}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={policy} />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-base capitalize">
                        {policy}
                      </FormLabel>
                      <FormDescription>
                        {POLICY_DESCRIPTIONS[policy]}
                      </FormDescription>
                    </div>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Custom Cancellation Rules</FormLabel>
        <FormDescription>
          Add any additional rules or exceptions to your cancellation policy
        </FormDescription>

        <div className="flex space-x-2">
          <Input
            placeholder="Enter a custom rule"
            value={customRule}
            onChange={(e) => setCustomRule(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleAddCustomRule}
            disabled={!customRule.trim()}
          >
            Add Rule
          </Button>
        </div>

        {customRules.length > 0 && (
          <div className="space-y-2">
            {customRules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span>{rule}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomRule(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
