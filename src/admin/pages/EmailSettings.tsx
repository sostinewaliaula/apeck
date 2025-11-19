import { FormEvent, useState } from 'react';
import { Mail, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAuth } from '../auth-context';

export function AdminEmailSettingsPage() {
  const { accessToken } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testSubject, setTestSubject] = useState('APECK Email Configuration Test');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSendTest = async (e: FormEvent) => {
    e.preventDefault();
    if (!testEmail || !accessToken) {
      setTestResult({
        success: false,
        message: 'Please enter an email address and ensure you are logged in.',
      });
      return;
    }

    setIsSending(true);
    setTestResult(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_CMS_API_URL ?? 'http://localhost:4000/api';
      const response = await fetch(`${API_BASE_URL}/email/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          to: testEmail,
          subject: testSubject || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send test email');
      }

      setTestResult({
        success: data.success,
        message: data.message,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email. Please check server logs.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AdminLayout
      title="Email Settings"
      description="Test your email configuration to ensure membership application notifications are working"
    >
      <div className="space-y-6">
        {/* Email Configuration Info */}
        <section className="rounded-xl border border-[#CAB9A7] bg-white/80 p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A] flex items-center gap-2">
            <Mail size={20} />
            Email Configuration
          </h2>
          <div className="space-y-2 text-sm text-[#6B4E3D]">
            <p>
              <strong>SMTP Server:</strong> Configured via environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, etc.)
            </p>
            <p>
              <strong>From Address:</strong> Set via SMTP_FROM environment variable
            </p>
            <p className="text-xs text-[#6B4E3D]/70 mt-4">
              To update email settings, modify the environment variables in your server's <code>.env</code> file and restart the server.
            </p>
          </div>
        </section>

        {/* Test Email Form */}
        <section className="rounded-xl border border-[#CAB9A7] bg-white/80 p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A] flex items-center gap-2">
            <Send size={20} />
            Send Test Email
          </h2>
          <p className="text-sm text-[#6B4E3D] mb-4">
            Send a test email to verify that your email configuration is working correctly. The test email will be sent to the address you specify below.
          </p>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B4E3D]">
                Recipient Email Address *
              </label>
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#6B4E3D]">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={testSubject}
                onChange={(e) => setTestSubject(e.target.value)}
                placeholder="APECK Email Configuration Test"
                className="w-full rounded-xl border border-[#CAB9A7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2332]"
              />
            </div>

            {testResult && (
              <div
                className={`rounded-xl border p-4 flex items-start gap-3 ${
                  testResult.success
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {testResult.success ? 'Test Email Sent!' : 'Test Email Failed'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {testResult.message}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSending || !testEmail}
                className="rounded-xl bg-[#8B2332] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#7A1E2A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </form>

          {testResult?.success && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Next Steps</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Check the recipient's inbox (and spam folder) for the test email</li>
                    <li>If the email was received, your configuration is working correctly</li>
                    <li>If the email was not received, check the server logs for error details</li>
                    <li>Verify your SMTP credentials and server settings in the .env file</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Troubleshooting */}
        <section className="rounded-xl border border-[#CAB9A7] bg-white/80 p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#2F1E1A]">Troubleshooting</h2>
          <div className="space-y-3 text-sm text-[#6B4E3D]">
            <div>
              <p className="font-medium mb-1">If the test email fails:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check that SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD are set in your .env file</li>
                <li>Verify the SMTP server address and port are correct</li>
                <li>Ensure SMTP_SECURE is set correctly (true for port 465, false for port 587)</li>
                <li>Check server logs for detailed error messages</li>
                <li>Verify your email account password is correct</li>
                <li>Ensure your firewall allows outbound connections on the SMTP port</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Common SMTP ports:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Port 465: SSL/TLS (SMTP_SECURE=true)</li>
                <li>Port 587: STARTTLS (SMTP_SECURE=false)</li>
                <li>Port 25: Usually blocked by ISPs</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

