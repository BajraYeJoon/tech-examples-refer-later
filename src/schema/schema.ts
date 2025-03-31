import { z } from "zod"

export const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    price: z.coerce.number().min(0, {
      message: "Price must be a positive number.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    category: z.enum(["electronics", "jewelery", "men's clothing", "women's clothing"], {
      required_error: "Please select a category.",
    }),
    image: z.string().url({
      message: "Please enter a valid URL.",
    }),
    rating: z.coerce.number().min(0).max(5, {
      message: "Rating must be between 0 and 5.",
    }),
    count: z.coerce.number().min(0, {
      message: "Count must be a positive number.",
    }),
  })
  
  export type FormValues = z.infer<typeof formSchema>