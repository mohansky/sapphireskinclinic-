import type { APIRoute } from "astro";
import { Resend } from "resend";
import { getSecret } from "astro:env/server";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { renderAsync } from "@react-email/render";
import ContactFormEmail from "../emails/contact-form-email";

const resend = new Resend(getSecret("RESEND_API_KEY"));

export const server = {
  contactForm: defineAction({
    accept: "form",
    input: z.object({
      firstName: z.string().min(1, { message: "Name is required" }),
      phone: z.string()
        .min(7, { message: "Phone number must be at least 7 digits" })
        .max(20, { message: "Phone number is too long" })
        .regex(/^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/, { 
          message: "Please enter a valid Indian phone number" 
        }),
      email: z.string()
        .email({ message: "Please enter a valid email address" }),
      message: z.string()
        .min(1, { message: "Message is required" })
        .max(1000, { message: "Message is too long (1000 characters maximum)" }),
      // Include honeypot but don't validate it (handled in client)
      a_password: z.string().optional(),
    }),
    handler: async (formData) => {
      try {
        // Secondary honeypot check on server side
        if (formData.a_password && formData.a_password.trim() !== "") {
          // Silent success for bots
          return { success: true };
        }

        console.log("Form submission:", formData);
         
        const emailHtml = await renderAsync(
          ContactFormEmail({
            firstName: formData.firstName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            siteUrl: "https://mohankumar.dev",
            siteName: "Sapphire Skin & Aesthetics Clinic"
          })
        );
        
        const { data, error } = await resend.emails.send({
          from: "Sapphire Skin & Aesthetics Clinic <mail@mohankumar.dev>",
          to: "mohansky@gmail.com",
          subject: `Enquiry from ${formData.firstName}`,
          html: emailHtml, 
          text: `
            Enquiry from ${formData.firstName} 
            Name: ${formData.firstName}
            Email: ${formData.email}
            Phone: ${formData.phone} 
            Message:
            ${formData.message}
          `
        });

        if (error) {
          console.error("Email sending error:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send email. Please try again later.",
          });
        }

        return {
          success: true,
          message: "Thank you for your message. We'll be in touch soon!",
          data
        };
      } catch (error) {
        console.error("Server action error:", error);
        
        if (error instanceof ActionError) {
          throw error;
        }
        
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    },
  }),
};