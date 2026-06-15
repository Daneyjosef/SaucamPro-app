import InfoLayout from "../../components/layout/InfoLayout";

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: `We collect information you provide directly to us when you create an account, complete identity verification, make transactions, or contact our support team. This includes your name, email address, phone number, date of birth, government-issued identity documents, bank account details, and any other information you choose to provide.

We also automatically collect certain information when you use our services, including log data (IP address, browser type, pages visited, time and date of your visit), device information, cookies and similar tracking technologies, and transaction data including amounts, asset types, timestamps, and wallet addresses.`
  },
  {
    title: "2. How we use your information",
    body: `We use the information we collect to provide, maintain, and improve our services; process transactions and send related information including confirmations and receipts; verify your identity and prevent fraud; comply with legal obligations including AML/CFT requirements imposed by applicable regulatory authorities; send technical notices, updates, security alerts, and support messages; respond to your comments and questions; and monitor and analyse usage trends.`
  },
  {
    title: "3. Sharing of information",
    body: `We do not sell your personal information. We may share your information with third-party service providers that perform services on our behalf, such as payment processing, identity verification, data analysis, customer service, and fraud prevention. We may disclose your information if required by law, regulation, or legal process, including requests from competent regulatory or government authorities in any jurisdiction we operate.`
  },
  {
    title: "4. Data retention",
    body: `We retain personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. In accordance with applicable AML/CFT regulations, transaction records and KYC documentation are retained for a minimum of five (5) years after the end of a customer relationship.`
  },
  {
    title: "5. Security",
    body: `We use industry-standard encryption (AES-256 at rest, TLS 1.3 in transit) and security practices to protect your personal information. We implement multi-factor authentication, cold storage for digital assets, regular security audits, and access controls. However, no security system is impenetrable and we cannot guarantee absolute security.`
  },
  {
    title: "6. Your rights",
    body: `Subject to applicable law, you have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your personal information (subject to our legal retention obligations), opt out of marketing communications, and withdraw consent where processing is based on consent. To exercise any of these rights, please contact us at privacy@saucampro.com.`
  },
  {
    title: "7. Cookies",
    body: `We use cookies and similar tracking technologies to improve your experience on our platform, remember your preferences, analyse site usage, and assist in our marketing efforts. You can control cookies through your browser settings, though disabling cookies may affect certain features of our services.`
  },
  {
    title: "8. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and, where appropriate, by sending you an email notification. Your continued use of our services after any changes constitutes your acceptance of the new policy.`
  },
  {
    title: "9. Contact us",
    body: `If you have any questions about this Privacy Policy or our privacy practices, please contact our Data Protection Officer at:\n\nEmail: privacy@saucampro.com`
  },
];

export default function PrivacyPage() {
  return (
    <InfoLayout>
      <section className="px-5 sm:px-10 py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: 1 June 2026</p>
        </div>
      </section>

      <section className="px-5 sm:px-10 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500 leading-relaxed mb-10">
            SaucamPro ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. Please read this policy carefully. By accessing or using SaucamPro, you agree to this Privacy Policy.
          </p>

          <div className="space-y-10">
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h2>
                <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </InfoLayout>
  );
}
