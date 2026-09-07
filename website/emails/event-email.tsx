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
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

type GuidanceStep = {
  title: string;
  description: string;
};

type EventEmailProps = {
  variant: 'offer' | 'transactional';
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

export default function EventEmail({
  variant,
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
}: EventEmailProps) {
  const isOffer = variant === 'offer';

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={isOffer ? styles.offerHero : styles.transactionalHero}>
            <Text style={isOffer ? styles.offerBrand : styles.brand}>WETRENDS</Text>
            <Text style={isOffer ? styles.offerEyebrow : styles.eyebrow}>{eyebrow}</Text>
            <Heading style={isOffer ? styles.offerHeading : styles.heading}>{heading}</Heading>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.copy}>{body}</Text>

            {detailLines.length > 0 && (
              <Section style={styles.details}>
                <Text style={styles.detailsLabel}>{isOffer ? 'Included for you' : 'Your details'}</Text>
                {detailLines.map((line, index) => (
                  <Row key={line} style={index > 0 ? styles.detailRowWithBorder : styles.detailRow}>
                    <Column>
                      <Text style={styles.detailLine}>{line}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {guidanceSteps.length > 0 && (
              <Section style={styles.guidance}>
                <Text style={styles.guidanceLabel}>{guidanceTitle}</Text>
                {guidanceSteps.map((step, index) => (
                  <Row key={`${step.title}-${index}`} style={index > 0 ? styles.stepWithBorder : styles.step}>
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
                <Button href={buttonUrl} style={styles.button}>{buttonLabel}</Button>
                {actionNote && <Text style={styles.actionNote}>{actionNote}</Text>}
              </Section>
            )}

            <Hr style={styles.rule} />
            <Text style={styles.help}>Questions? Reply to this email and we’ll help.</Text>
            <Text style={styles.signoff}>WeTrends</Text>
          </Section>
        </Container>

        {isOffer && (
          <Text style={styles.offerFooter}>Event photography across Surrey and London.</Text>
        )}
      </Body>
    </Html>
  );
}

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: '#F4F0F1',
    color: '#171214',
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: 0,
    padding: '36px 12px',
  },
  container: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E8DEE1',
    borderRadius: '22px',
    margin: '0 auto',
    maxWidth: '600px',
    overflow: 'hidden',
  },
  offerHero: {
    backgroundColor: '#C72C5B',
    padding: '34px 38px 38px',
  },
  transactionalHero: {
    backgroundColor: '#FFF4F7',
    borderTop: '6px solid #C72C5B',
    padding: '28px 38px 32px',
  },
  offerBrand: {
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.2em',
    margin: '0 0 34px',
  },
  brand: {
    color: '#171214',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.2em',
    margin: '0 0 28px',
  },
  offerEyebrow: {
    color: '#FFE0E9',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.17em',
    margin: '0 0 12px',
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: '#C72C5B',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.17em',
    margin: '0 0 12px',
    textTransform: 'uppercase',
  },
  offerHeading: {
    color: '#FFFFFF',
    fontSize: '38px',
    letterSpacing: '-0.045em',
    lineHeight: '1.08',
    margin: 0,
  },
  heading: {
    color: '#171214',
    fontSize: '31px',
    letterSpacing: '-0.035em',
    lineHeight: '1.12',
    margin: 0,
  },
  content: {
    padding: '34px 38px 38px',
  },
  greeting: {
    color: '#171214',
    fontSize: '17px',
    fontWeight: 700,
    lineHeight: '1.55',
    margin: '0 0 10px',
  },
  copy: {
    color: '#554C50',
    fontSize: '16px',
    lineHeight: '1.65',
    margin: '0 0 24px',
  },
  details: {
    backgroundColor: '#FAF7F8',
    border: '1px solid #EADFE2',
    borderRadius: '14px',
    margin: '0 0 28px',
    padding: '18px 20px 14px',
  },
  detailsLabel: {
    color: '#8A7C81',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.16em',
    margin: '0 0 10px',
    textTransform: 'uppercase',
  },
  detailRow: {
    padding: '4px 0',
  },
  detailRowWithBorder: {
    borderTop: '1px solid #EEE6E8',
    padding: '4px 0',
  },
  detailLine: {
    color: '#312A2D',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '1.5',
    margin: '5px 0',
  },
  guidance: {
    margin: '0 0 26px',
  },
  guidanceLabel: {
    color: '#171214',
    fontSize: '17px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    margin: '0 0 8px',
  },
  step: {
    padding: '14px 0',
  },
  stepWithBorder: {
    borderTop: '1px solid #EEE6E8',
    padding: '14px 0',
  },
  stepNumberColumn: {
    verticalAlign: 'top',
    width: '46px',
  },
  stepNumber: {
    backgroundColor: '#FBE6EC',
    borderRadius: '999px',
    color: '#C72C5B',
    fontSize: '10px',
    fontWeight: 800,
    height: '30px',
    lineHeight: '30px',
    margin: 0,
    textAlign: 'center',
    width: '30px',
  },
  stepTitle: {
    color: '#211B1E',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '1.45',
    margin: 0,
  },
  stepDescription: {
    color: '#786C71',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '3px 0 0',
  },
  action: {
    backgroundColor: '#171214',
    borderRadius: '14px',
    margin: '4px 0 28px',
    padding: '20px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#C72C5B',
    borderRadius: '999px',
    color: '#FFFFFF',
    display: 'block',
    fontSize: '15px',
    fontWeight: 700,
    padding: '15px 24px',
    textAlign: 'center',
    textDecoration: 'none',
  },
  actionNote: {
    color: '#C9BEC2',
    fontSize: '12px',
    lineHeight: '1.45',
    margin: '11px 0 0',
  },
  rule: {
    borderColor: '#EDE5E7',
    margin: '0 0 20px',
  },
  help: {
    color: '#74696D',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0 0 6px',
  },
  signoff: {
    color: '#171214',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '1.5',
    margin: 0,
  },
  offerFooter: {
    color: '#95898D',
    fontSize: '11px',
    lineHeight: '1.5',
    margin: '18px auto 0',
    maxWidth: '600px',
    textAlign: 'center',
  },
};
