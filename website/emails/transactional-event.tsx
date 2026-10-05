import type { CSSProperties } from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

type GuidanceStep = {
  title: string;
  description: string;
};

type TransactionalEventEmailProps = {
  preview: string;
  eyebrow: string;
  heading: string;
  greeting: string;
  body: string;
  buttonLabel?: string;
  buttonUrl?: string;
  detailLines?: string[];
  guidanceTitle?: string;
  guidanceSteps?: GuidanceStep[];
  actionNote?: string;
};

const lightMesh = 'https://wetrends.co.uk/images/events-mesh-light.png';
const brandMark = 'https://wetrends.co.uk/images/email/wetrends-brand-mesh.png';

export default function TransactionalEventEmail({
  preview,
  eyebrow,
  heading,
  greeting,
  body,
  buttonLabel,
  buttonUrl,
  detailLines = [],
  guidanceTitle = 'What happens next',
  guidanceSteps = [],
  actionNote,
}: TransactionalEventEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <style>{responsiveStyles}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body className="wt-email-body" style={styles.body}>
        <Container className="wt-email-container" style={styles.container}>
          <Section className="wt-email-hero" style={styles.hero}>
            <Row style={styles.brandRow}>
              <Column style={styles.logoColumn}>
                <Img alt="WeTrends" height="46" src={brandMark} width="46" style={styles.logo} />
              </Column>
              <Column>
                <Text style={styles.wordmark}>WETRENDS</Text>
              </Column>
            </Row>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Heading className="wt-email-heading" style={styles.heading}>{heading}</Heading>
            <Section style={styles.accent} />
          </Section>

          <Section className="wt-email-content" style={styles.content}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.copy}>{body}</Text>

            {detailLines.length > 0 && (
              <Section style={styles.details}>
                <Text style={styles.detailsLabel}>YOUR DETAILS</Text>
                {detailLines.map((line) => <Text key={line} style={styles.detail}>{line}</Text>)}
              </Section>
            )}

            {guidanceSteps.length > 0 && (
              <Section style={styles.guidance}>
                <Text style={styles.guidanceTitle}>{guidanceTitle}</Text>
                {guidanceSteps.map((step, index) => (
                  <Row key={`${step.title}-${index}`} style={styles.step}>
                    <Column style={styles.stepNumberColumn}>
                      <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
                    </Column>
                    <Column>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {buttonLabel && buttonUrl && (
              <Section style={styles.action}>
                <Button href={buttonUrl} style={styles.button}>{buttonLabel}<span style={styles.arrow}>→</span></Button>
                {actionNote && <Text style={styles.actionNote}>{actionNote}</Text>}
              </Section>
            )}

            <Hr style={styles.rule} />
            <Text style={styles.footer}>If you need anything, reply to this email.<br /><strong>WeTrends</strong></Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const responsiveStyles = `
  .wt-email-container { width: 100% !important; max-width: 580px !important; }
  @media only screen and (max-width: 480px) {
    .wt-email-body { padding: 12px 0 !important; }
    .wt-email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
    .wt-email-hero { padding: 25px 22px 26px !important; }
    .wt-email-content { padding: 25px 22px !important; }
    .wt-email-heading { font-size: 32px !important; line-height: 1.08 !important; }
  }
`;

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: '#F7F1F3',
    backgroundImage: `url(${lightMesh})`,
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: '#21191D',
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: 0,
    padding: '34px 12px',
  },
  container: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EADFE3',
    borderRadius: '18px',
    margin: '0 auto',
    maxWidth: '580px',
    overflow: 'hidden',
    width: '100%',
  },
  hero: {
    backgroundColor: '#FCF6F8',
    backgroundImage: `url(${lightMesh})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    padding: '28px 38px 32px',
  },
  brandRow: { margin: '0 0 32px' },
  logoColumn: { verticalAlign: 'middle', width: '60px' },
  logo: { border: 0, borderRadius: '12px', display: 'block', height: '46px', width: '46px' },
  wordmark: { color: '#261D21', fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', margin: 0 },
  eyebrow: { color: '#B4234E', fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', margin: 0, textTransform: 'uppercase' },
  heading: { color: '#181316', fontSize: '47px', fontWeight: 800, letterSpacing: '-0.065em', lineHeight: '0.98', margin: '12px 0 21px' },
  accent: { backgroundColor: '#C72C5B', height: '5px', width: '64px' },
  content: { padding: '29px 38px 33px' },
  greeting: { color: '#181316', fontSize: '16px', fontWeight: 700, lineHeight: '1.5', margin: '0 0 10px' },
  copy: { color: '#5F555A', fontSize: '15px', lineHeight: '1.65', margin: 0 },
  details: { backgroundColor: '#FBF8F9', border: '1px solid #EEE5E8', borderRadius: '12px', margin: '23px 0', padding: '16px 18px 12px' },
  detailsLabel: { color: '#8A7C82', fontSize: '10px', fontWeight: 700, letterSpacing: '0.13em', margin: '0 0 10px' },
  detail: { color: '#342B30', fontSize: '14px', fontWeight: 600, lineHeight: '1.5', margin: '5px 0' },
  guidance: { margin: '23px 0' },
  guidanceTitle: { color: '#21191D', fontSize: '16px', fontWeight: 700, margin: '0 0 8px' },
  step: { borderTop: '1px solid #F0E9EB', padding: '12px 0 10px' },
  stepNumberColumn: { verticalAlign: 'top', width: '42px' },
  stepNumber: { color: '#C72C5B', fontSize: '10px', fontWeight: 800, letterSpacing: '0.09em', margin: '1px 0 0' },
  stepTitle: { color: '#272025', fontSize: '14px', fontWeight: 700, lineHeight: '1.4', margin: 0 },
  stepDescription: { color: '#766A70', fontSize: '13px', lineHeight: '1.5', margin: '3px 0 0' },
  action: { margin: '23px 0 24px' },
  button: { backgroundColor: '#C72C5B', borderRadius: '999px', color: '#FFFFFF', display: 'block', fontSize: '14px', fontWeight: 700, lineHeight: '1.2', padding: '16px 22px', textAlign: 'center', textDecoration: 'none' },
  arrow: { paddingLeft: '10px' },
  actionNote: { color: '#84777D', fontSize: '12px', lineHeight: '1.5', margin: '10px 0 0' },
  rule: { borderColor: '#EEE7E9', margin: '0 0 18px' },
  footer: { color: '#82767C', fontSize: '12px', lineHeight: '1.8', margin: 0 },
};
