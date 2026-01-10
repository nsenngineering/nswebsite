'use client';

import React from 'react';
import { FileText, AlertTriangle, Scale, Building2, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';

export default function TermsOfUsePage() {
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
              <Scale className="w-16 h-16 text-white mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Terms of Use
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Please read these terms carefully before using our website and services.
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>
                        Welcome to the website of <strong>NS Engineering & Geotechnical Services Pvt. Ltd.</strong> (&quot;NSEGS,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website at <strong>www.nsengineering.com.np</strong> (the &quot;Website&quot;), you agree to be bound by these Terms of Use (&quot;Terms&quot;).
                      </p>
                      <p>
                        If you do not agree to these Terms, please do not use this Website. We reserve the right to modify these Terms at any time, and your continued use of the Website constitutes acceptance of any changes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Website Purpose */}
          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Building2 className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Website Purpose</h2>
                    <p className="text-gray-600 mb-3">
                      This Website serves as an informational platform to showcase our geotechnical and engineering services, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Pile testing services (PDA, PIT, Static Load, Cross-Hole Sonic Logging)</li>
                      <li>Soil and rock laboratory testing</li>
                      <li>Drilling services (up to 700m depth)</li>
                      <li>Geophysical surveys and investigations</li>
                      <li>Non-destructive testing (NDT) services</li>
                      <li>Project portfolios and case studies</li>
                      <li>Company information and expertise</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      The Website allows prospective clients to submit quotation requests, but <strong>formal contracts govern the actual provision of services</strong>. The information on this Website does not constitute a binding offer or contract.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Use of Website */}
          <FadeIn delay={0.2}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
                    <p className="text-gray-600 mb-3">
                      You agree to use this Website only for lawful purposes and in compliance with these Terms. You agree NOT to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Use the Website in any way that violates applicable laws or regulations in Nepal</li>
                      <li>Attempt to gain unauthorized access to the Website, servers, or networks</li>
                      <li>Submit false, misleading, or fraudulent information through forms</li>
                      <li>Use automated tools (bots, scrapers) to extract content without permission</li>
                      <li>Interfere with or disrupt the Website&apos;s functionality or security</li>
                      <li>Transmit viruses, malware, or any harmful code</li>
                      <li>Impersonate any person or entity, or misrepresent your affiliation</li>
                      <li>Use the Website for spam, phishing, or other malicious activities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Intellectual Property */}
          <FadeIn delay={0.3}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Shield className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Our Content</h3>
                    <p className="text-gray-600 mb-3">
                      All content on this Website, including but not limited to text, graphics, logos, images, photographs, project data, technical documents, and software, is the property of NSEGS or its licensors and is protected by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Copyright laws of Nepal and international treaties</li>
                      <li>Trademark laws and regulations</li>
                      <li>Trade secret and proprietary rights</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Limited License</h3>
                    <p className="text-gray-600 mb-3">
                      You are granted a limited, non-exclusive, non-transferable license to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Access and view the Website for personal or business evaluation purposes</li>
                      <li>Download or print individual pages for legitimate business inquiries</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Restrictions</h3>
                    <p className="text-gray-600 mb-3">
                      You may NOT:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Reproduce, distribute, or publicly display content without written permission</li>
                      <li>Modify, adapt, or create derivative works from Website content</li>
                      <li>Remove copyright, trademark, or proprietary notices</li>
                      <li>Use content for commercial purposes without authorization</li>
                    </ul>

                    <p className="text-sm text-gray-500 mt-4">
                      The NSEGS name, logo, and &quot;Constantly Evolving, Foundation You Can Trust&quot; tagline are trademarks of NS Engineering & Geotechnical Services Pvt. Ltd.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Third-Party Content */}
          <FadeIn delay={0.4}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Links and Content</h2>
                    <p className="text-gray-600 mb-3">
                      Our Website may contain links to external websites, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Industry standard codes and specifications</li>
                      <li>Technical publications and research papers</li>
                      <li>Regulatory bodies and certification organizations</li>
                      <li>Partner organizations and suppliers</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      <strong>We do not endorse, control, or assume responsibility</strong> for the content, accuracy, privacy policies, or practices of any third-party websites. Accessing these links is at your own risk. We recommend reviewing the terms and privacy policies of any external sites you visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Disclaimer of Warranties */}
          <FadeIn delay={0.5}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Informational Purpose</h3>
                    <p className="text-gray-600 mb-3">
                      This Website is provided for <strong>informational purposes only</strong>. While we strive to maintain accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, regarding:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>The accuracy, completeness, or reliability of Website content</li>
                      <li>The availability or uninterrupted operation of the Website</li>
                      <li>The suitability of information for your specific needs</li>
                      <li>The timeliness or currency of project data and case studies</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">ISO 9001:2015 Certification</h3>
                    <p className="text-gray-600 mb-3">
                      While NSEGS maintains ISO 9001:2015 certification for quality management, this applies to our <strong>service delivery processes</strong>, not the Website itself. Website content is informational and does not constitute professional advice or formal service commitments.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">&quot;As Is&quot; Provision</h3>
                    <p className="text-gray-600">
                      THE WEBSITE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Limitation of Liability */}
          <FadeIn delay={0.6}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Scale className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                    <p className="text-gray-600 mb-3">
                      To the fullest extent permitted by law, NSEGS, its directors, employees, and affiliates shall NOT be liable for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Any indirect, incidental, special, or consequential damages</li>
                      <li>Loss of profits, data, business opportunities, or revenue</li>
                      <li>Damages arising from reliance on Website information</li>
                      <li>Interruptions, errors, or omissions in Website operation</li>
                      <li>Unauthorized access to or alteration of your transmissions or data</li>
                      <li>Actions of third-party websites linked from our Website</li>
                    </ul>

                    <p className="text-gray-600 mt-4">
                      <strong>Important:</strong> The Website provides general information about our services. <strong>Formal written contracts govern actual service provision</strong>, including scope, deliverables, warranties, and liability terms. Always refer to signed contracts for binding agreements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Professional Services */}
          <FadeIn delay={0.7}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Building2 className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Services and Contracts</h2>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Quotation Requests</h3>
                    <p className="text-gray-600 mb-3">
                      Submitting a quotation request through this Website:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Does NOT constitute a binding contract or agreement</li>
                      <li>Does NOT guarantee acceptance or service provision</li>
                      <li>Is subject to our evaluation of project feasibility and capacity</li>
                      <li>May result in a formal quotation, but is not a commitment</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Formal Agreements</h3>
                    <p className="text-gray-600 mb-3">
                      Actual provision of engineering and geotechnical services requires:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Execution of a formal written service contract</li>
                      <li>Detailed scope of work and deliverables</li>
                      <li>Agreed payment terms and schedule</li>
                      <li>Project-specific terms, warranties, and liabilities</li>
                      <li>Compliance with applicable engineering standards and regulations</li>
                    </ul>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Professional Standards</h3>
                    <p className="text-gray-600">
                      All engineering services are performed in accordance with ISO 9001:2015 quality standards and applicable engineering codes. Service-specific terms, warranties, and professional liability are defined in individual contracts, not in these Website Terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* User Submissions */}
          <FadeIn delay={0.8}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">User Submissions and Communications</h2>
                    <p className="text-gray-600 mb-3">
                      By submitting information through our Website (e.g., quotation requests, contact forms), you:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>Represent that the information is accurate and truthful</li>
                      <li>Grant us permission to use the information to respond to your inquiry</li>
                      <li>Consent to storage and processing as described in our Privacy Policy</li>
                      <li>Agree to receive communications from NSEGS regarding your inquiry</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      We respect your privacy and handle all submissions in accordance with our <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Indemnification */}
          <FadeIn delay={0.9}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Shield className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Indemnification</h2>
                    <p className="text-gray-600">
                      You agree to indemnify, defend, and hold harmless NSEGS, its directors, officers, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-3">
                      <li>Your violation of these Terms of Use</li>
                      <li>Your violation of any laws or regulations</li>
                      <li>Your infringement of any third-party rights</li>
                      <li>Your misuse of the Website or its content</li>
                      <li>False or misleading information you submit</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Termination */}
          <FadeIn delay={1.0}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Termination of Access</h2>
                    <p className="text-gray-600">
                      We reserve the right to terminate or suspend your access to the Website, without prior notice or liability, for any reason, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-3">
                      <li>Violation of these Terms of Use</li>
                      <li>Fraudulent, abusive, or illegal activity</li>
                      <li>Automated scraping or bot usage</li>
                      <li>Any conduct that harms or threatens the Website or NSEGS</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Upon termination, your right to use the Website will immediately cease. All provisions of these Terms that by their nature should survive termination shall remain in effect.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Governing Law */}
          <FadeIn delay={1.1}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Scale className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Governing Law and Jurisdiction</h2>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Applicable Law</h3>
                    <p className="text-gray-600 mb-3">
                      These Terms of Use are governed by and construed in accordance with the <strong>laws of Nepal</strong>, without regard to conflict of law principles.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Dispute Resolution</h3>
                    <p className="text-gray-600 mb-3">
                      Any disputes arising from or relating to these Terms or the Website shall be subject to the <strong>exclusive jurisdiction of the courts in Lalitpur, Nepal</strong>.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Service Contracts</h3>
                    <p className="text-gray-600">
                      Disputes regarding actual service contracts may be governed by separate dispute resolution provisions specified in those contracts (e.g., arbitration, mediation).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Changes to Terms */}
          <FadeIn delay={1.2}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to These Terms</h2>
                    <p className="text-gray-600 mb-3">
                      We reserve the right to modify or replace these Terms at any time at our sole discretion. Changes will be effective immediately upon posting to this page.
                    </p>
                    <p className="text-gray-600 mb-3">
                      We will update the &quot;Last Updated&quot; date at the top of this page when changes are made. For significant changes, we may provide additional notice through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>A prominent notice on the Website homepage</li>
                      <li>Email notification to registered users</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Your continued use of the Website after any modifications constitutes acceptance of the updated Terms. If you do not agree to the new Terms, you must stop using the Website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Severability */}
          <FadeIn delay={1.3}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Scale className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Severability</h2>
                    <p className="text-gray-600">
                      If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Entire Agreement */}
          <FadeIn delay={1.4}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
                    <p className="text-gray-600">
                      These Terms of Use, together with our Privacy Policy, constitute the entire agreement between you and NSEGS regarding the use of this Website, superseding any prior agreements or understandings.
                    </p>
                    <p className="text-gray-600 mt-3">
                      <strong>Note:</strong> Formal service contracts are separate agreements and take precedence over these Website Terms for matters related to service delivery.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Contact Information */}
          <FadeIn delay={1.5}>
            <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 flex-shrink-0 mt-1 opacity-90" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-purple-100 mb-4">
                      If you have any questions about these Terms of Use, please contact us:
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

          {/* Acknowledgment */}
          <FadeIn delay={1.6}>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Acknowledgment</h2>
                    <p className="text-gray-600">
                      BY USING THIS WEBSITE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, PLEASE DO NOT USE THIS WEBSITE.
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
