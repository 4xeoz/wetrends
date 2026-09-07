import { EDDY_PROFILE } from '@/lib/connect-profile';

const vCard = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  `N:;${EDDY_PROFILE.name};;;`,
  `FN:${EDDY_PROFILE.name}`,
  `ORG:${EDDY_PROFILE.company}`,
  `TITLE:${EDDY_PROFILE.role}`,
  `TEL;TYPE=CELL,VOICE:${EDDY_PROFILE.phoneE164}`,
  `EMAIL;TYPE=INTERNET,WORK:${EDDY_PROFILE.email}`,
  `URL:${EDDY_PROFILE.businessCardUrl}`,
  'NOTE:Creative direction, brand, digital and event production.',
  'END:VCARD',
].join('\r\n');

export function GET() {
  return new Response(vCard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="eddy-wetrends.vcf"',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
