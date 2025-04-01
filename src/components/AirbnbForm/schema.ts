import { z } from "zod";

// Example of .shape() - Define base property schema
const propertyBaseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  type: z.enum(["apartment", "house", "room", "unique_space"]),
  price: z.number().min(1, "Price must be greater than 0"),
});

// Example of .extend() - Extend the base schema with additional fields
const propertyDetailsSchema = propertyBaseSchema.extend({
  bedrooms: z.number().min(1, "Must have at least 1 bedroom"),
  bathrooms: z.number().min(1, "Must have at least 1 bathroom"),
  maxGuests: z.number().min(1, "Must accommodate at least 1 guest"),
});

// Example of .array() with .nonempty() and .min()/.max()
const amenitiesSchema = z
  .array(z.string())
  .nonempty("Select at least one amenity")
  .min(3, "Select at least 3 amenities")
  .max(20, "Cannot select more than 20 amenities");

// Example of .object() with .catchall() for dynamic key-value pairs
const rulesSchema = z
  .object({
    smoking: z.boolean(),
    pets: z.boolean(),
    parties: z.boolean(),
  })
  .catchall(z.boolean());

// Example of .intersection() to combine schemas
const locationSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
});

// Example of .partial() for optional fields in availability
const availabilitySchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    minStay: z.number().min(1),
    maxStay: z.number().optional(),
    instantBook: z.boolean(),
  })
  .partial();

// Example of .pick() to create a subset schema for photos
const photoSchema = z.object({
  url: z.string().url(),
  caption: z.string(),
  isPrimary: z.boolean(),
  order: z.number(),
});

const photoSubsetSchema = photoSchema.pick({
  url: true,
  caption: true,
});

// Example of .array() with .min()/.max() for photos
const photosSchema = z
  .array(photoSchema)
  .min(1, "Upload at least 1 photo")
  .max(20, "Cannot upload more than 20 photos");

// Example of .merge() to combine location with coordinates
const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const fullLocationSchema = locationSchema.merge(coordinatesSchema);

// Example of .keyof() for type-safe property access
const propertyKeys = propertyDetailsSchema.keyof();

// Example of .deepPartial() for draft saves
const draftSchema = propertyDetailsSchema.deepPartial();

// Example of .required() to make all fields required
const publishSchema = draftSchema.required();

// Example of .passthrough() for additional fields
const hostSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  })
  .passthrough();

// Example of .strip() to remove unknown fields
const guestSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
  })
  .strip();

// Main form schema combining all parts with validation
export const airbnbFormSchema = z.object({
  // Basic property details using the extended schema
  property: propertyDetailsSchema,

  // Location using the merged schema
  location: fullLocationSchema,

  // Amenities array with validation
  amenities: amenitiesSchema,

  // Photos array with validation
  photos: photosSchema,

  // House rules with dynamic fields
  rules: rulesSchema,

  // Availability settings
  availability: availabilitySchema,

  // Host information with passthrough
  host: hostSchema,

  // Pricing and fees
  pricing: z.object({
    basePrice: z.number().min(1),
    cleaningFee: z.number().min(0),
    serviceFee: z.number().min(0),
    taxes: z.number().min(0),
    weeklyDiscount: z.number().min(0).max(100).optional(),
    monthlyDiscount: z.number().min(0).max(100).optional(),
  }),

  // Cancellation policy
  cancellation: z.object({
    policy: z.enum(["flexible", "moderate", "strict"]),
    customRules: z.array(z.string()).optional(),
  }),

  // Safety features
  safety: z
    .object({
      smokeDetector: z.boolean(),
      firstAidKit: z.boolean(),
      fireExtinguisher: z.boolean(),
      carbonMonoxideDetector: z.boolean(),
    })
    .refine((data) => Object.values(data).some((value) => value === true), {
      message: "At least one safety feature must be available",
    }),
});

// Type inference from the schema
export type AirbnbFormData = z.infer<typeof airbnbFormSchema>;

// Example of using .omit() for a simplified view
const publicPropertySchema = propertyDetailsSchema.omit({
  price: true,
  description: true,
});

export type PublicPropertyView = z.infer<typeof publicPropertySchema>;

// Constants for form options
export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "room",
  "unique_space",
] as const;

export const AMENITIES_LIST = [
  "wifi",
  "tv",
  "kitchen",
  "washer",
  "dryer",
  "air_conditioning",
  "heating",
  "pool",
  "hot_tub",
  "gym",
  "elevator",
  "parking",
  "balcony",
  "workspace",
] as const;

export const CANCELLATION_POLICIES = [
  "flexible",
  "moderate",
  "strict",
] as const;
