import { describe, it, expect } from "vitest";
import { ContactFormSchema } from "@/schemas/contact";

describe("ContactFormSchema Validation Suite", () => {
  it("should validate complete and correct form data", () => {
    const validPayload = {
      name: "Arthur Gregorius Pongoh",
      email: "arthurgregorius333@gmail.com",
      subject: "Architectural Collaboration Inquiry",
      message: "Hello Arthur, we would like to collaborate with you on a deep learning and systems architecture contract.",
    };

    const result = ContactFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("arthurgregorius333@gmail.com");
      expect(result.data.name).toBe("Arthur Gregorius Pongoh");
    }
  });

  it("should reject invalid email formats", () => {
    const invalidPayload = {
      name: "Arthur",
      email: "invalid-email-string",
      subject: "Testing",
      message: "This is a valid long message for testing.",
    };

    const result = ContactFormSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailErrors = result.error.issues.filter((i) => i.path.includes("email"));
      expect(emailErrors.length).toBeGreaterThan(0);
    }
  });

  it("should reject message shorter than 10 characters", () => {
    const invalidPayload = {
      name: "Arthur",
      email: "test@domain.com",
      subject: "Hi",
      message: "Short",
    };

    const result = ContactFormSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messageErrors = result.error.issues.filter((i) => i.path.includes("message"));
      expect(messageErrors.length).toBeGreaterThan(0);
    }
  });
});
