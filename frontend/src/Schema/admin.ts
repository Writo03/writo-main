import { z } from 'zod'

export const baseSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    fullName: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Full name can only contain letters and spaces'),
    phone: z
      .string()
      .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  });

export const serviceSchema = z.object({
    name: z
      .string()
      .min(3, "Service name must be at least 3 characters")
      .max(50, "Service name must not exceed 50 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters"),
    price: z
      .number()
      .min(0, "Price must be a positive number")
      .max(1000000, "Price must not exceed 1,000,000"),
    discount: z
      .number()
      .min(0, "Discount must be between 0 and 100")
      .max(100, "Discount must be between 0 and 100"),
  });


  export const questionSchema = z.object({
    question: z.string().optional(),
    image: z.string().optional(),
    options: z.array(z.string()).length(4, "Exactly 4 options are required"),
    correct: z.enum(["A", "B", "C", "D"], {
      required_error: "Please select the correct answer",
    }),
  });
  
 export const formSchema = z.object({
    name: z.string().min(3, "Quiz name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    duration: z.number().min(5, "Duration must be at least 5 minutes"),
    subjects: z.array(z.string()).min(1, "Select at least one subject"),
    isSubjectTest: z.boolean(),
    services: z.array(z.string()).min(1, "Select at least one service"),
    questions: z.array(questionSchema).min(1, "Add at least one question"),
  });