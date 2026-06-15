import InfoLayout from "../../components/layout/InfoLayout";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: `By accessing or using the SaucamPro platform and services, you agree to be bound by these Terms of Use, our Privacy Policy, and any additional terms and conditions that apply to specific features of our services. If you do not agree to these terms, you must not access or use our services.

These Terms of Use constitute a legally binding agreement between you and SaucamPro, a licensed global digital asset exchange operator.`
  },
  {
    title: "2. Eligibility",
    body: `To use SaucamPro, you must be at least 18 years of age, a resident of an eligible jurisdiction, capable of entering into a legally binding contract, not be a person prohibited from using our services under applicable law, and successfully complete our identity verification (KYC) process.

By creating an account, you represent and warrant that you meet all of the eligibility requirements listed above.`
  },
  {
    title: "3. Account registration",
    body: `You must create an account to access most of our services. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately at support@saucampro.com if you suspect any unauthorised access to your account.`
  },
  {
    title: "4. Identity verification (KYC)",
    body: `In compliance with applicable AML/CFT regulations, you are required to verify your identity before using certain features of our platform. This may include providing a valid government-issued ID, proof of address, and selfie or biometric verification. We reserve the right to refuse or suspend service where KYC requirements are not met.`
  },
  {
    title: "5. Prohibited activities",
    body: `You agree not to use SaucamPro to engage in any illegal activity, including but not limited to money laundering, terrorism financing, tax evasion, or fraud; circumvent, disable, or interfere with security features; use the platform to transmit any unsolicited advertising or spam; impersonate any person or entity; access or use another user's account without authorisation; or violate any applicable laws or regulations.

Violation of these prohibitions may result in immediate termination of your account and referral to competent authorities.`
  },
  {
    title: "6. Trading and transactions",
    body: `All trades and transactions executed on SaucamPro are final and irreversible once confirmed on the blockchain or in our internal ledger. You acknowledge that cryptocurrency markets are highly volatile and that the value of any asset may increase or decrease significantly. SaucamPro does not provide financial, investment, or tax advice. You trade at your own risk.

SaucamPro charges fees as disclosed on our platform. We reserve the right to change fees at any time with reasonable notice.`
  },
  {
    title: "7. Risk disclosures",
    body: `Cryptocurrency trading involves substantial risk of loss. Digital assets are not legal tender and are not backed by any government or central bank. Past performance is not indicative of future results. You may lose some or all of your invested capital. You should only trade with funds you can afford to lose. SaucamPro is not responsible for any loss you may incur as a result of market movements, technical failures, or your own trading decisions.`
  },
  {
    title: "8. Limitation of liability",
    body: `To the fullest extent permitted by applicable law, SaucamPro and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of our services, even if we have been advised of the possibility of such damages.

Our total liability to you for any claim arising from the use of our services shall not exceed the amount of fees paid by you to SaucamPro in the twelve (12) months preceding the claim.`
  },
  {
    title: "9. Governing law",
    body: `These Terms of Use shall be governed by and construed in accordance with the applicable laws of the jurisdiction in which SaucamPro operates. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in the relevant jurisdiction.`
  },
  {
    title: "10. Changes to terms",
    body: `We reserve the right to modify these Terms of Use at any time. We will provide notice of material changes by posting the updated terms on our platform and, where appropriate, by email. Your continued use of our services after the effective date of any changes constitutes your acceptance of the modified terms.`
  },
  {
    title: "11. Contact",
    body: `If you have any questions about these Terms of Use, please contact us at:\n\nEmail: legal@saucampro.com`
  },
];

export default function TermsPage() {
  return (
    <InfoLayout>
      <section className="px-5 sm:px-10 py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
          <p className="text-gray-400 text-sm">Last updated: 1 June 2026</p>
        </div>
      </section>

      <section className="px-5 sm:px-10 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500 leading-relaxed mb-10">
            Please read these Terms of Use carefully before using the SaucamPro platform. These terms govern your access to and use of our website, mobile application, and associated services. By using SaucamPro, you accept these terms in full.
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
