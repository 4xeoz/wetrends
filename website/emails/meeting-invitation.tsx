import type { CSSProperties } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type MeetingInvitationEmailProps = {
  clientName: string;
  bookingUrl: string;
};

const mesh = "https://wetrends.co.uk/images/events-mesh-light.png";
const brandMark = "https://wetrends.co.uk/images/email/wetrends-brand-mesh.png";

export default function MeetingInvitationEmail({ clientName, bookingUrl }: MeetingInvitationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <style>{responsiveStyles}</style>
      </Head>
      <Preview>Choose a day and time for your WeTrends call.</Preview>
      <Body className="meeting-email-body" style={styles.body}>
        <Container className="meeting-email-container" style={styles.container}>
          <Section className="meeting-email-hero" style={styles.hero}>
            <Img src={brandMark} width="54" height="54" alt="WeTrends" style={styles.logo} />
            <Text style={styles.eyebrow}>YOUR CALL</Text>
            <Heading className="meeting-email-heading" style={styles.heading}>Let&apos;s find a time.</Heading>
          </Section>
          <Section className="meeting-email-content" style={styles.content}>
            <Text style={styles.greeting}>Hi {clientName},</Text>
            <Text style={styles.copy}>We&apos;re looking forward to speaking with you. Choose the day and time that works best.</Text>
            <Section style={styles.action}>
              <Button href={bookingUrl} style={styles.button}>Choose a time <span style={styles.arrow}>→</span></Button>
            </Section>
            <Text style={styles.note}>Times are shown in UK time. Your private link can be used once to book the call.</Text>
            <Hr style={styles.rule} />
            <Text style={styles.footer}>Need another option? Reply to this email and we&apos;ll help.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const responsiveStyles = `
  .meeting-email-container { width: 100% !important; max-width: 560px !important; }
  @media only screen and (max-width: 480px) {
    .meeting-email-body { padding: 12px 0 !important; }
    .meeting-email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
    .meeting-email-hero { padding: 27px 23px 29px !important; }
    .meeting-email-content { padding: 27px 23px !important; }
    .meeting-email-heading { font-size: 37px !important; }
  }
`;

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: "#F7F1F3",
    backgroundImage: `url(${mesh})`,
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "#21191D",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #EADFE3",
    borderRadius: "20px",
    margin: "0 auto",
    maxWidth: "560px",
    overflow: "hidden",
    width: "100%",
  },
  hero: {
    backgroundColor: "#FCF6F8",
    backgroundImage: `url(${mesh})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    padding: "34px 42px 38px",
  },
  logo: { border: 0, borderRadius: "14px", display: "block", height: "54px", marginBottom: "26px", width: "54px" },
  eyebrow: { color: "#A52249", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", margin: 0 },
  heading: { color: "#21191D", fontSize: "48px", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: "1", margin: "12px 0 0" },
  content: { padding: "34px 42px 38px" },
  greeting: { color: "#21191D", fontSize: "17px", fontWeight: 700, lineHeight: "1.5", margin: "0 0 9px" },
  copy: { color: "#5F555A", fontSize: "15px", lineHeight: "1.65", margin: 0 },
  action: { margin: "26px 0 19px" },
  button: { backgroundColor: "#A52249", borderRadius: "999px", color: "#FFFFFF", display: "block", fontSize: "15px", fontWeight: 700, lineHeight: "1.2", padding: "17px 24px", textAlign: "center", textDecoration: "none" },
  arrow: { paddingLeft: "8px" },
  note: { color: "#766A70", fontSize: "12px", lineHeight: "1.6", margin: 0 },
  rule: { borderColor: "#EEE7E9", margin: "25px 0 17px" },
  footer: { color: "#766A70", fontSize: "12px", lineHeight: "1.6", margin: 0 },
};
