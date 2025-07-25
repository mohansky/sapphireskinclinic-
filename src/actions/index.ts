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
      location: z.string()
        .min(1, { message: "Location is required" })
        .refine(value => value === "Koramangala" || value === "JPNagar", {
          message: "Please select a valid location"
        }),
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
            location: formData.location,
            message: formData.message,
            siteUrl: "https://mohankumar.dev",
            siteName: "Sapphire Skin & Aesthetics Clinic"
          })
        );
       
        const { data, error } = await resend.emails.send({
          from: "Sapphire Skin & Aesthetics Clinic <mail@mohankumar.dev>",
          to: ["mohansky@gmail.com", "sapphireskinkoramangala@gmail.com", "drsheelavathi@gmail.com"],
          subject: `Enquiry from ${formData.firstName} for ${formData.location} clinic`,
          html: emailHtml,
          text: `
            Enquiry from ${formData.firstName}
            Name: ${formData.firstName}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Location: ${formData.location}
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




// Simple mail diversion between locations *******************************************************
// import type { APIRoute } from "astro";
// import { Resend } from "resend";
// import { getSecret } from "astro:env/server";
// import { ActionError, defineAction } from "astro:actions";
// import { z } from "astro:schema";
// import { renderAsync } from "@react-email/render";
// import ContactFormEmail from "../emails/contact-form-email";

// const resend = new Resend(getSecret("RESEND_API_KEY"));

// export const server = {
//   contactForm: defineAction({
//     accept: "form",
//     input: z.object({
//       firstName: z.string().min(1, { message: "Name is required" }),
//       phone: z.string()
//         .min(7, { message: "Phone number must be at least 7 digits" })
//         .max(20, { message: "Phone number is too long" })
//         .regex(/^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/, {
//           message: "Please enter a valid Indian phone number"
//         }),
//       email: z.string()
//         .email({ message: "Please enter a valid email address" }),
//       location: z.string()
//         .min(1, { message: "Location is required" })
//         .refine(value => value === "Koramangala" || value === "JPNagar", {
//           message: "Please select a valid location"
//         }),
//       message: z.string()
//         .min(1, { message: "Message is required" })
//         .max(1000, { message: "Message is too long (1000 characters maximum)" }),
//       // Include honeypot but don't validate it (handled in client)
//       a_password: z.string().optional(),
//     }),
//     handler: async (formData) => {
//       try {
//         // Secondary honeypot check on server side
//         if (formData.a_password && formData.a_password.trim() !== "") {
//           // Silent success for bots
//           return { success: true };
//         }
//         console.log("Form submission:", formData);
         
//         const emailHtml = await renderAsync(
//           ContactFormEmail({
//             firstName: formData.firstName,
//             email: formData.email,
//             phone: formData.phone,
//             location: formData.location,
//             message: formData.message,
//             siteUrl: "https://mohankumar.dev",
//             siteName: "Sapphire Skin & Aesthetics Clinic"
//           })
//         );
       
//         // Determine recipient email based on location
//         const recipientEmail = formData.location === "Koramangala" 
//           ? "koramangala@sapphireclinic.com" // Replace with actual Koramangala email
//           : "jpnagar@sapphireclinic.com";    // Replace with actual JP Nagar email
        
//         const { data, error } = await resend.emails.send({
//           from: "Sapphire Skin & Aesthetics Clinic <mail@mohankumar.dev>",
//           to: recipientEmail,
//           cc: "mohansky@gmail.com", // Keeping the original email as CC for backup
//           subject: `Enquiry from ${formData.firstName} - ${formData.location}`,
//           html: emailHtml,
//           text: `
//             Enquiry from ${formData.firstName}
//             Name: ${formData.firstName}
//             Email: ${formData.email}
//             Phone: ${formData.phone}
//             Location: ${formData.location}
//             Message:
//             ${formData.message}
//           `
//         });
//         if (error) {
//           console.error("Email sending error:", error);
//           throw new ActionError({
//             code: "INTERNAL_SERVER_ERROR",
//             message: "Failed to send email. Please try again later.",
//           });
//         }
//         return {
//           success: true,
//           message: "Thank you for your message. We'll be in touch soon!",
//           data
//         };
//       } catch (error) {
//         console.error("Server action error:", error);
       
//         if (error instanceof ActionError) {
//           throw error;
//         }
       
//         throw new ActionError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "An unexpected error occurred. Please try again later.",
//         });
//       }
//     },
//   }),
// };




// Using Environment Variables for mail diversion **************************************************************************

// import type { APIRoute } from "astro";
// import { Resend } from "resend";
// import { getSecret } from "astro:env/server";
// import { ActionError, defineAction } from "astro:actions";
// import { z } from "astro:schema";
// import { renderAsync } from "@react-email/render";
// import ContactFormEmail from "../emails/contact-form-email";

// const resend = new Resend(getSecret("RESEND_API_KEY"));

// // Get emails from environment variables or use defaults
// const KORAMANGALA_EMAIL = getSecret("KORAMANGALA_EMAIL") || "koramangala@sapphireclinic.com";
// const JPNAGAR_EMAIL = getSecret("JPNAGAR_EMAIL") || "jpnagar@sapphireclinic.com";
// const ADMIN_EMAIL = getSecret("ADMIN_EMAIL") || "mohansky@gmail.com";

// export const server = {
//   contactForm: defineAction({
//     accept: "form",
//     input: z.object({
//       firstName: z.string().min(1, { message: "Name is required" }),
//       phone: z.string()
//         .min(7, { message: "Phone number must be at least 7 digits" })
//         .max(20, { message: "Phone number is too long" })
//         .regex(/^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/, {
//           message: "Please enter a valid Indian phone number"
//         }),
//       email: z.string()
//         .email({ message: "Please enter a valid email address" }),
//       location: z.string()
//         .min(1, { message: "Location is required" })
//         .refine(value => value === "Koramangala" || value === "JPNagar", {
//           message: "Please select a valid location"
//         }),
//       message: z.string()
//         .min(1, { message: "Message is required" })
//         .max(1000, { message: "Message is too long (1000 characters maximum)" }),
//       // Include honeypot but don't validate it (handled in client)
//       a_password: z.string().optional(),
//     }),
//     handler: async (formData) => {
//       try {
//         // Secondary honeypot check on server side
//         if (formData.a_password && formData.a_password.trim() !== "") {
//           // Silent success for bots
//           return { success: true };
//         }
//         console.log("Form submission:", formData);
         
//         const emailHtml = await renderAsync(
//           ContactFormEmail({
//             firstName: formData.firstName,
//             email: formData.email,
//             phone: formData.phone,
//             location: formData.location,
//             message: formData.message,
//             siteUrl: "https://mohankumar.dev",
//             siteName: "Sapphire Skin & Aesthetics Clinic"
//           })
//         );
       
//         // Determine recipient email based on location
//         const recipientEmail = formData.location === "Koramangala" 
//           ? KORAMANGALA_EMAIL
//           : JPNAGAR_EMAIL;
        
//         const { data, error } = await resend.emails.send({
//           from: "Sapphire Skin & Aesthetics Clinic <mail@mohankumar.dev>",
//           to: recipientEmail,
//           cc: ADMIN_EMAIL, // Send a copy to the admin email for record keeping
//           subject: `Enquiry from ${formData.firstName} - ${formData.location}`,
//           html: emailHtml,
//           text: `
//             Enquiry from ${formData.firstName}
//             Name: ${formData.firstName}
//             Email: ${formData.email}
//             Phone: ${formData.phone}
//             Location: ${formData.location}
//             Message:
//             ${formData.message}
//           `
//         });
        
//         if (error) {
//           console.error("Email sending error:", error);
//           throw new ActionError({
//             code: "INTERNAL_SERVER_ERROR",
//             message: "Failed to send email. Please try again later.",
//           });
//         }
//         return {
//           success: true,
//           message: "Thank you for your message. We'll be in touch soon!",
//           data
//         };
//       } catch (error) {
//         console.error("Server action error:", error);
       
//         if (error instanceof ActionError) {
//           throw error;
//         }
       
//         throw new ActionError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "An unexpected error occurred. Please try again later.",
//         });
//       }
//     },
//   }),
// };