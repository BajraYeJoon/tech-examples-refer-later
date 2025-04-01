import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { airbnbFormSchema, type AirbnbFormData } from "./schema";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";

// Import step components
import { PropertyDetailsStep } from "./steps/PropertyDetailsStep";
import { LocationStep } from "./steps/LocationStep";
import { AmenitiesStep } from "./steps/AmenitiesStep";
import { PhotosStep } from "./steps/PhotosStep";
import { RulesStep } from "./steps/RulesStep";
import { AvailabilityStep } from "./steps/AvailabilityStep";
import { HostStep } from "./steps/HostStep";
import { CancellationStep } from "./steps/CancellationStep";
import { SafetyStep } from "./steps/SafetyStep";
import { PricingStep } from "./steps/PricingStep";

const FORM_STEPS = [
  { id: "property", label: "Property Details", component: PropertyDetailsStep },
  { id: "location", label: "Location", component: LocationStep },
  { id: "amenities", label: "Amenities", component: AmenitiesStep },
  { id: "photos", label: "Photos", component: PhotosStep },
  { id: "rules", label: "House Rules", component: RulesStep },
  { id: "availability", label: "Availability", component: AvailabilityStep },
  { id: "host", label: "Host Info", component: HostStep },
  { id: "pricing", label: "Pricing", component: PricingStep },
  { id: "cancellation", label: "Cancellation", component: CancellationStep },
  { id: "safety", label: "Safety", component: SafetyStep },
] as const;

const STEP_VALIDATION_FIELDS = {
  property: [
    "property.title",
    "property.description",
    "property.type",
    "property.bedrooms",
    "property.bathrooms",
    "property.maxGuests",
  ],
  location: [
    "location.address",
    "location.city",
    "location.state",
    "location.country",
    "location.zipCode",
    "location.latitude",
    "location.longitude",
  ],
  amenities: ["amenities"],
  photos: ["photos"],
  rules: ["rules"],
  availability: ["availability"],
  host: ["host.name", "host.email", "host.phone"],
  pricing: [
    "pricing.basePrice",
    "pricing.cleaningFee",
    "pricing.serviceFee",
    "pricing.taxes",
  ],
  cancellation: ["cancellation.policy"],
  safety: ["safety"],
} as const;

export function AirbnbForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  // Initialize form with React Hook Form and Zod resolver
  const methods = useForm<AirbnbFormData>({
    resolver: zodResolver(airbnbFormSchema),
    mode: "onChange",
    defaultValues: {
      property: {
        type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
      },
      amenities: [],
      rules: {
        smoking: false,
        pets: false,
        parties: false,
      },
      availability: {
        minStay: 1,
        instantBook: true,
      },
      safety: {
        smokeDetector: false,
        firstAidKit: false,
        fireExtinguisher: false,
        carbonMonoxideDetector: false,
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  // Calculate progress percentage
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  // Handle form submission
  const onSubmit = async (data: AirbnbFormData) => {
    try {
      console.log("Form submitted with data:", {
        property: data.property,
        location: data.location,
        amenities: data.amenities,
        photos: data.photos,
        rules: data.rules,
        availability: data.availability,
        host: data.host,
        pricing: data.pricing,
        cancellation: data.cancellation,
        safety: data.safety,
      });

      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Property listed successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to list property. Please try again.");
    }
  };

  // Add this function to check for specific field errors
  const getFieldErrors = () => {
    const errorMessages: string[] = [];
    for (const [key, value] of Object.entries(errors)) {
      if (value && "message" in value) {
        errorMessages.push(`${key}: ${value.message}`);
      }
    }
    return errorMessages;
  };

  // Add useEffect to validate all fields when on the last step
  useEffect(() => {
    if (currentStep === FORM_STEPS.length - 1) {
      trigger(); // Validate all fields
    }
  }, [currentStep, trigger]);

  // Get current step errors
  const currentStepId = FORM_STEPS[currentStep]
    .id as keyof typeof STEP_VALIDATION_FIELDS;
  const currentStepFields = STEP_VALIDATION_FIELDS[currentStepId];
  const hasCurrentStepErrors = currentStepFields.some((field) => {
    const [parent, child] = field.split(".");
    return child
      ? errors[parent as keyof AirbnbFormData]?.[child]
      : errors[parent as keyof AirbnbFormData];
  });

  // Get all form errors for the final submit button
  const hasFormErrors = Object.keys(errors).length > 0;

  // Navigation handlers
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setShowErrors(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowErrors(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = FORM_STEPS[currentStep].component;

  // Validate current step fields
  const validateStep = async () => {
    const currentStepId = FORM_STEPS[currentStep]
      .id as keyof typeof STEP_VALIDATION_FIELDS;
    const fieldsToValidate = STEP_VALIDATION_FIELDS[currentStepId];

    const isValid = await trigger(fieldsToValidate);
    setShowErrors(!isValid);
    return isValid;
  };

  return (
    <FormProvider {...methods}>
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">List Your Property</h1>
          <p className="text-gray-600 mb-4">
            Step {currentStep + 1} of {FORM_STEPS.length}:{" "}
            {FORM_STEPS[currentStep].label}
          </p>
          <Progress value={progress} className="h-2" />
        </div>

        {showErrors &&
          (hasCurrentStepErrors || currentStep === FORM_STEPS.length - 1) && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                <div className="space-y-2">
                  <p>Please fix the following errors:</p>
                  <ul className="list-disc pl-4">
                    {getFieldErrors().map((error) => (
                      <li key={error} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <CurrentStepComponent />

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}

            <div className="ml-auto">
              {currentStep < FORM_STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || hasFormErrors}
                  onClick={() => {
                    if (hasFormErrors) {
                      setShowErrors(true);
                      trigger();
                    }
                  }}
                >
                  {isSubmitting ? "Submitting..." : "List Property"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </FormProvider>
  );
}
