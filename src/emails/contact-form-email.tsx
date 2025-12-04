import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
  Img,
} from "@react-email/components";

interface Props {
  firstName: string;
  email?: string;
  phone: string;
  location: string;
  datePreference: string;
  message?: string;
  siteUrl: string;
  siteName: string;
}

const baseUrl = process.env.NETLIFY_URL
  ? `https://${process.env.NETLIFY_URL}`
  : "";

export const ContactFormEmail = ({
  firstName,
  email,
  phone,
  location,
  datePreference,
  message,
  siteUrl = "https://sapphireskin.in/",
  siteName = "Sapphire Skin & Aesthetics Clinic",
}: Props) => {
  const textColor = "#333333";
  const accentColor = "#ff5858";
  const backgroundColor = "#f9fafb";
  const footerColor = "#f3f4f6";

  return (
    <Html>
      <Head />
      <Preview>New enquiry from {firstName} for {location}</Preview>
      <Body
        style={{
          backgroundColor,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "20px 0",
            maxWidth: "600px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header */}
          <Section
            style={{
              borderBottom: `1px solid ${footerColor}`,
              padding: "20px 40px",
              textAlign: "center",
            }}
          >
            {/* <Img
              src={`${baseUrl}/images/SapphireLogo.svg`}
              width="49"
              height="21"
              alt="Sapphire Skin & Aesthetics Clinic"
            /> */}
            <Heading
              as="h1"
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: accentColor,
                margin: "10px 0",
              }}
            >
              {siteName}
            </Heading>

            <Heading
              as="h1"
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: accentColor,
                margin: "10px 0",
              }}
            >
              {" "}
              New Contact Form Submission
            </Heading>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: "20px 40px" }}>
            <Heading
              as="h2"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                color: textColor,
                marginBottom: "20px",
              }}
            >
              You've received a new message from {firstName} for {location}
            </Heading>

            <Text
              style={{ fontSize: "16px", margin: "8px 0", color: textColor }}
            >
              <strong>Name:</strong> {firstName}
            </Text>

            {email && (
              <Text
                style={{ fontSize: "16px", margin: "8px 0", color: textColor }}
              >
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${email}`} style={{ color: accentColor }}>
                  {email}
                </Link>
              </Text>
            )}

            <Text
              style={{ fontSize: "16px", margin: "8px 0", color: textColor }}
            >
              <strong>Phone:</strong>{" "}
              <Link href={`tel:${phone}`} style={{ color: accentColor }}>
                {phone}
              </Link>
            </Text>

            <Text
              style={{ fontSize: "16px", margin: "8px 0", color: textColor }}
            >
              <strong>Preferred Appointment Date:</strong> {new Date(datePreference).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>

            <Hr
              style={{
                borderColor: footerColor,
                borderStyle: "solid",
                margin: "20px 0",
              }}
            />

            {message && (
              <>
                <Heading
                  as="h3"
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: textColor,
                  }}
                >
                  <strong>Message:</strong>
                </Heading>

                <Text
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: textColor,
                    padding: "12px 16px",
                    backgroundColor: backgroundColor,
                    borderRadius: "6px",
                    borderLeft: `2px solid ${accentColor}`,
                  }}
                >
                  {message}
                </Text>
              </>
            )}
            <Hr style={{ borderColor: "#e6ebf1", margin: "20px 0" }} />
            <Text
              style={{ color: "#8898aa", fontSize: "12px", lineHeight: "16px" }}
            >
              Sapphire Skin & Aesthetics Clinic, 1st Floor, 24th Main Rd, JP
              Nagar 6th Phase, Bengaluru, Karnataka 560078 | +91 80 2654 9666 |
              +91 974 178 3333 | drsheelavathi@gmail.com
            </Text>
            <Text
              style={{ color: "#8898aa", fontSize: "12px", lineHeight: "16px" }}
            >
              Sapphire Skin & Aesthetics Clinic, OA Towers, 5th Cross Road, KHB
              Colony, 5th Block, Koramangala, Bengaluru - 560095 | +9180 296 36
              666 | +91 707 070 3152 | sapphireskinkoramangala@gmail.com
            </Text>
          </Section>

          {/* Footer */}
          {/* <Section
            style={{
              backgroundColor: footerColor,
              borderTop: `1px solid ${footerColor}`,
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              padding: "20px 40px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#666666",
                margin: "0",
              }}
            >
              This message was sent from the contact form on{" "}
              <Link href={siteUrl} style={{ color: accentColor }}>
                {siteName}
              </Link>
            </Text>
          </Section> */}
        </Container>
      </Body>
    </Html>
  );
};

export default ContactFormEmail;
