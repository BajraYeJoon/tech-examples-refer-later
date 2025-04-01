import { useFormContext } from "react-hook-form";
import { type AirbnbFormData } from "../schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { Switch } from "../../ui/switch";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";

export function RulesStep() {
  const { control, setValue, watch } = useFormContext<AirbnbFormData>();
  const [customRule, setCustomRule] = useState("");
  const rules = watch("rules");

  const handleCustomRuleAdd = () => {
    if (customRule.trim()) {
      const currentRules = { ...rules };
      currentRules[customRule.trim()] = false;
      setValue("rules", currentRules);
      setCustomRule("");
    }
  };

  const handleRuleToggle = (ruleName: string) => {
    const currentRules = { ...rules };
    currentRules[ruleName] = !currentRules[ruleName];
    setValue("rules", currentRules);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="rules"
        render={() => (
          <FormItem>
            <FormLabel>House Rules</FormLabel>
            <FormDescription>
              Set your house rules to ensure guests know what to expect
            </FormDescription>

            <div className="space-y-4 mt-4">
              {/* Standard rules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>No Smoking</FormLabel>
                    <FormDescription>
                      Prohibit smoking inside the property
                    </FormDescription>
                  </div>
                  <Switch
                    checked={rules?.smoking === false}
                    onCheckedChange={() => handleRuleToggle("smoking")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Pets Allowed</FormLabel>
                    <FormDescription>
                      Allow guests to bring their pets
                    </FormDescription>
                  </div>
                  <Switch
                    checked={rules?.pets === true}
                    onCheckedChange={() => handleRuleToggle("pets")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Parties Allowed</FormLabel>
                    <FormDescription>
                      Allow parties or events at the property
                    </FormDescription>
                  </div>
                  <Switch
                    checked={rules?.parties === true}
                    onCheckedChange={() => handleRuleToggle("parties")}
                  />
                </div>
              </div>

              {/* Custom rules */}
              <div className="pt-6 border-t">
                <FormLabel>Add Custom Rule</FormLabel>
                <div className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Enter a custom rule"
                    value={customRule}
                    onChange={(e) => setCustomRule(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleCustomRuleAdd}
                    disabled={!customRule.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Display custom rules */}
              {Object.entries(rules || {}).map(([rule, value]) => {
                if (
                  rule !== "smoking" &&
                  rule !== "pets" &&
                  rule !== "parties"
                ) {
                  return (
                    <div
                      key={rule}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <FormLabel>{rule}</FormLabel>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={() => handleRuleToggle(rule)}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
