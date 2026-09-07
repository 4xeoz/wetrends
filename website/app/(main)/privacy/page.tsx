import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy & Cookies | WeTrends',
  description: 'How WeTrends handles enquiries, event and photography data, orders, website analytics and privacy choices.',
  alternates: { canonical: 'https://wetrends.co.uk/privacy/' },
};

const sections = [
  {
    title: 'What we collect',
    body: (
      <>
        <p>Depending on how you use the site or work with us, we may collect:</p>
        <ul>
          <li>your name, email address, selected service and the details you put in an enquiry;</li>
          <li>event, photoshoot and delivery information needed to plan or provide a service;</li>
          <li>private-gallery activity, image selections, order status and delivery details;</li>
          <li>payment status and transaction references from Stripe—we do not receive your full card number;</li>
          <li>technical security logs; and</li>
          <li>page, device, referral and campaign information only when you allow optional analytics.</li>
        </ul>
        <p>Photographs and video can be personal data when someone is identifiable. Client galleries are access-controlled, and real client work is made public only under the relevant agreement or permission.</p>
      </>
    ),
  },
  {
    title: 'Why we use it',
    body: (
      <ul>
        <li>to answer an enquiry and take steps you request before a contract;</li>
        <li>to plan, deliver and support contracted creative, event and photography work;</li>
        <li>to process orders, payments, delivery and accounting obligations;</li>
        <li>to protect private galleries, accounts and the site from misuse; and</li>
        <li>to understand site performance when you have consented to analytics.</li>
      </ul>
    ),
  },
  {
    title: 'Our lawful bases',
    body: (
      <p>We use personal data where it is necessary to take requested pre-contract steps or perform a contract, to meet legal obligations, or for proportionate legitimate interests such as service administration and security. Optional analytics rely on your consent, which you can withdraw through the Privacy choices control.</p>
    ),
  },
  {
    title: 'Who processes data for us',
    body: (
      <p>We use service providers only where needed to operate the business. These may include Vercel for hosting, database and application infrastructure providers, Cloudinary and Google Drive for media, Stripe for payments, Resend for transactional email, and Google Analytics and PostHog for consented analytics. Professional advisers or authorities may receive information where the law or a legitimate claim requires it.</p>
    ),
  },
  {
    title: 'International processing',
    body: (
      <p>Some providers may process information outside the UK. Where that happens, we rely on the provider&apos;s applicable UK transfer mechanism and contractual safeguards. Contact us if you want details relevant to your data.</p>
    ),
  },
  {
    title: 'How long we keep it',
    body: (
      <p>We keep information only while it is needed for the enquiry, service, gallery or order, and afterwards where accounting, tax, dispute, safeguarding or legal requirements justify retention. We review old enquiries and operational records and remove or anonymise them when those purposes no longer apply. Contract terms may set a more specific gallery or asset-retention period.</p>
    ),
  },
  {
    title: 'Cookies and analytics',
    body: (
      <p>The public site does not load Google Analytics or PostHog until you choose Allow analytics. Your choice is stored in your browser. If allowed, those services measure visits and interactions so we can understand which work produces useful enquiries. Essential storage may still be used for security, authentication, payments and private-gallery functions. You can reopen the choice at any time using the Privacy choices button; choosing Decline prevents further analytics loading and removes related browser identifiers that the site can access.</p>
    ),
  },
  {
    title: 'Your rights',
    body: (
      <p>Depending on the circumstances, you can ask for access, correction, deletion, restriction or portability of your personal data, object to certain processing, or withdraw consent. Email us to make a request. You can also complain to the UK Information Commissioner&apos;s Office at <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer">ico.org.uk</a>.</p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F4F2] px-5 pb-24 pt-32 text-[#171114] sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C72C5B]">Privacy notice</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Privacy and cookies, in plain English.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65">
          WeTrends is the controller for personal data it collects directly through this website and its client services. This notice explains the main processing visible in the current service.
        </p>
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <p className="font-semibold">Contact</p>
          <p className="mt-2 text-black/65">
            Email <a className="font-semibold text-[#A3244A] underline underline-offset-4" href="mailto:team@wetrends.co.uk">team@wetrends.co.uk</a> with a privacy question or rights request.
          </p>
          <p className="mt-3 text-sm text-black/45">Last updated: 7 September 2026</p>
        </div>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-black/10 pt-8 [&_a]:font-semibold [&_a]:text-[#A3244A] [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_li]:leading-7 [&_p]:leading-7 [&_p]:text-black/65 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:text-black/65">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.title}</h2>
              <div className="mt-4">{section.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-black/10 pt-8">
          <Link href="/" className="rounded-full bg-[#171114] px-5 py-3 text-sm font-semibold text-white">Back to WeTrends</Link>
          <a href="mailto:team@wetrends.co.uk" className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold">Ask a privacy question</a>
        </div>
      </article>
    </div>
  );
}
