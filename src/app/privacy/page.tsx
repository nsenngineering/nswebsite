'use client';

import React from 'react';
import { Shield, Mail, Eye, FileText, Lock, Users, Server, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <Shield className="w-16 h-16 text-white mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
              <p className="text-sm text-purple-200 mt-4">
                Last Updated: January 6, 2026
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <FadeIn>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>
                        NS Engineering & Geotechnical Services Pvt. Ltd. (&quot;we,&quot; &quot;our,&quot; or &quot;NSEGS&quot;) is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>www.nsengineering.com.np</strong> or use our services.
                      </p>
                      <p>
                        We comply with the laws of Nepal and follow GDPR-inspired principles to ensure the highest standards of data protection, even though we are not subject to EU regulations.
                      </p>
                      <p>
                        By using our website, you consent to the data practices described in this policy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Information We Collect */}
          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Eye className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">1. Personal Information You Provide</h3>
                    <p className="text-gray-600 mb-3">
                      When you submit a quotation request or contact us through our website, we collect:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Contact Information:</strong> Full name, email address, phone number</li>
                      <li><strong>Company Information:</strong> Company/organization name (optional)</li>
                      <li><strong>Project Details:</strong> Project name, location, timeline, service requirements, and description</li>
                      <li><strong>Communication Records:</strong> Any messages or inquiries you send to us</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">2. Automatically Collected Information</h3>
                    <p className="text-gray-600 mb-3">
                      We automatically collect certain information when you visit our website:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
                      <li><strong>Usage Data:</strong> Pages visited, time spent on pages, navigation paths, referring website</li>
                      <li><strong>Analytics Data:</strong> Aggregated statistics via Cloudflare Analytics and similar services</li>
                      <li><strong>Security Verification:</strong> Data from Cloudflare Turnstile for spam protection</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">3. Cookies and Tracking Technologies</h3>
                    <p className="text-gray-600 mb-3">
                      We use cookies and similar technologies for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Functional Cookies:</strong> Essential for website operation and form functionality</li>
                      <li><strong>Analytics Cookies:</strong> To understand how visitors use our website</li>
                      <li><strong>Security Cookies:</strong> For Turnstile verification and bot protection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* How We Use Your Information */}
          <FadeIn delay={0.2}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Server className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                    <p className="text-gray-600 mb-3">
                      We use the information we collect for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Service Delivery:</strong> To respond to quotation requests and provide engineering services</li>
                      <li><strong>Communication:</strong> To contact you about your project, send proposals, and answer inquiries</li>
                      <li><strong>Business Operations:</strong> To maintain records for project management and client relationships</li>
                      <li><strong>Website Improvement:</strong> To analyze usage patterns and enhance user experience</li>
                      <li><strong>Security:</strong> To protect against spam, fraud, and unauthorized access</li>
                      <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations in Nepal</li>
                      <li><strong>ISO 9001:2015 Compliance:</strong> To maintain our quality management system certification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Data Sharing */}
          <FadeIn delay={0.3}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Users className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Share Your Information</h2>
                    <p className="text-gray-600 mb-3">
                      We do not sell, rent, or trade your personal information. We may share your data only with:
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Service Providers</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Email Services:</strong> Resend (for transactional emails)</li>
                      <li><strong>Cloud Hosting:</strong> Cloudflare (CDN, security, analytics), GitHub Pages (website hosting)</li>
                      <li><strong>Infrastructure:</strong> Cloudflare R2 (media storage)</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-2 ml-4">
                      These providers are contractually obligated to protect your data and use it only for the services they provide to us.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, government agencies in Nepal).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Data Retention */}
          <FadeIn delay={0.4}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Lock className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Retention</h2>
                    <p className="text-gray-600 mb-3">
                      We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Quotation Requests:</strong> Retained indefinitely with your consent for business relationship management</li>
                      <li><strong>Project Records:</strong> Maintained for the duration of the project plus applicable legal retention periods</li>
                      <li><strong>Analytics Data:</strong> Aggregated and anonymized after 24 months</li>
                      <li><strong>Cookies:</strong> Expire according to their individual retention periods (typically 1 year or less)</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">
                      You may request deletion of your data at any time, subject to legal and contractual obligations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Your Rights */}
          <FadeIn delay={0.5}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Shield className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Data Rights</h2>
                    <p className="text-gray-600 mb-3">
                      You have the following rights regarding your personal data:
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-gray-600 ml-4">
                      <li>
                        <strong>Right to Access:</strong> Request a copy of the personal information we hold about you
                      </li>
                      <li>
                        <strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information
                      </li>
                      <li>
                        <strong>Right to Deletion:</strong> Request deletion of your personal data (subject to legal obligations)
                      </li>
                      <li>
                        <strong>Right to Data Portability:</strong> Request your data in a machine-readable format
                      </li>
                      <li>
                        <strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time
                      </li>
                      <li>
                        <strong>Right to Object:</strong> Object to processing of your data for certain purposes
                      </li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      To exercise any of these rights, please contact us at <a href="mailto:info@nsengineering.com.np" className="text-primary-600 hover:text-primary-700 font-medium">info@nsengineering.com.np</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Data Security */}
          <FadeIn delay={0.6}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Lock className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security</h2>
                    <p className="text-gray-600 mb-3">
                      We implement appropriate technical and organizational measures to protect your personal data:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li><strong>Encryption:</strong> All data transmission uses HTTPS/TLS encryption</li>
                      <li><strong>Spam Protection:</strong> Cloudflare Turnstile prevents automated bot submissions</li>
                      <li><strong>Access Control:</strong> Restricted access to personal data on a need-to-know basis</li>
                      <li><strong>Secure Infrastructure:</strong> Enterprise-grade hosting with Cloudflare security features</li>
                      <li><strong>Regular Updates:</strong> Ongoing security monitoring and software updates</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3">
                      While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* International Data Transfers */}
          <FadeIn delay={0.7}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Server className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                    <p className="text-gray-600 mb-3">
                      Your data may be transferred to and processed in countries outside of Nepal where our service providers operate (e.g., United States, European Union). These transfers are necessary for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Email delivery services (Resend)</li>
                      <li>Cloud hosting and CDN services (Cloudflare, GitHub)</li>
                      <li>Website infrastructure and security</li>
                    </ul>
                    <p className="text-gray-600 mt-3">
                      We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Third-Party Links */}
          <FadeIn delay={0.8}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <AlertCircle className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
                    <p className="text-gray-600">
                      Our website may contain links to external websites (e.g., standard codes, research papers, industry resources). We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before providing any personal information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Children's Privacy */}
          <FadeIn delay={0.9}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Shield className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                    <p className="text-gray-600">
                      Our website is intended for business and professional use. We do not knowingly collect personal information from children under 16. If you believe we have inadvertently collected information from a child, please contact us immediately at <a href="mailto:info@nsengineering.com.np" className="text-primary-600 hover:text-primary-700 font-medium">info@nsengineering.com.np</a>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Changes to This Policy */}
          <FadeIn delay={1.0}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                    <p className="text-gray-600">
                      We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-3">
                      <li>Updating the &quot;Last Updated&quot; date at the top of this page</li>
                      <li>Posting a notice on our website homepage</li>
                      <li>Sending an email notification (for significant changes)</li>
                    </ul>
                    <p className="text-gray-600 mt-3">
                      Your continued use of our website after changes are posted constitutes your acceptance of the revised policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact Information */}
          <FadeIn delay={1.1}>
            <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 flex-shrink-0 mt-1 opacity-90" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-purple-100 mb-4">
                      If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us:
                    </p>
                    <div className="space-y-2 text-purple-100">
                      <p><strong className="text-white">NS Engineering & Geotechnical Services Pvt. Ltd.</strong></p>
                      <p>Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal</p>
                      <p>Phone: +977-01-5260121, +977-9851228995</p>
                      <p>
                        Email: <a href="mailto:info@nsengineering.com.np" className="text-white hover:underline font-medium">info@nsengineering.com.np</a>
                      </p>
                      <p>Website: <a href="https://www.nsengineering.com.np" className="text-white hover:underline font-medium">www.nsengineering.com.np</a></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Governing Law */}
          <FadeIn delay={1.2}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Governing Law</h2>
                    <p className="text-gray-600">
                      This Privacy Policy is governed by the laws of Nepal. Any disputes arising from this policy or our data practices shall be subject to the exclusive jurisdiction of the courts in Lalitpur, Nepal.
                    </p>
                    <p className="text-gray-600 mt-3">
                      While we follow GDPR-inspired principles for data protection, we are not subject to EU regulations as we operate solely in Nepal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
