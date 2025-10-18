'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { validation } from '@/lib/validation';
import AuthButton from '@/components/AuthButton';
import { encryptMessage } from '@/lib/encrypt';

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate message
    const validationResult = validation.validateMessage(message);
    if (!validationResult.valid) {
      setError(validationResult.error || 'Invalid message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Encrypt message client-side
      const encrypted = await encryptMessage(message);
      const encryptedBase64 = btoa(String.fromCharCode(...encrypted));

      const response = await fetch('/api/submit-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encrypted: encryptedBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      // Success! Redirect to success page or show modal
      router.push(`/success?pr=${data.prNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Removed the redirect logic to allow access without login
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-white text-2xl font-bold">
              🕰️ Time Capsule
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 text-center">
          <p className="text-red-300 text-xl mb-4">⚠️ Please log in to submit your message.</p>
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </main>
      </div>
    );
  }

  const characterCount = message.length;
  const maxChars = 1000000;
  const minChars = 10;
  const isValid = characterCount >= minChars && characterCount <= maxChars;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            🕰️ Time Capsule
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Main Form */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">
            ✍️ Write Your Message
          </h1>
          <p className="text-purple-200 mb-8">
            Write a message to your future self (or the world) in 2035
          </p>

          <form onSubmit={handleSubmit}>
            {/* Toggle Preview */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !showPreview
                    ? 'bg-white text-purple-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ✍️ Write
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showPreview
                    ? 'bg-white text-purple-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                👀 Preview
              </button>
            </div>

            {/* Textarea or Preview */}
            {!showPreview ? (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dear future me...

What are your dreams right now?
What predictions do you have for 2035?
What advice would you give yourself?

Write anything you want - this message will be sealed until January 1, 2035!"
                className="w-full h-96 px-4 py-3 bg-white/5 border-2 border-white/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 resize-none font-mono"
                disabled={isSubmitting}
              />
            ) : (
              <div className="w-full h-96 px-4 py-3 bg-white/5 border-2 border-white/30 rounded-xl text-white overflow-y-auto whitespace-pre-wrap font-mono">
                {message || (
                  <span className="text-purple-300/50">
                    Your message preview will appear here...
                  </span>
                )}
              </div>
            )}

            {/* Character Count */}
            <div className="mt-4 flex justify-between items-center">
              <div
                className={`text-sm font-medium ${
                  isValid ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {characterCount} / {maxChars} characters
                {characterCount < minChars && (
                  <span className="ml-2">
                    (need {minChars - characterCount} more)
                  </span>
                )}
              </div>
              <div className="text-purple-200 text-sm">
                Min: {minChars} | Max: {maxChars}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                ❌ {error}
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-200">
              <p className="font-semibold mb-2">🔒 What happens next:</p>
              <ul className="text-sm space-y-1">
                <li>✅ Your message will be encrypted immediately</li>
                <li>
                  ✅ Saved as:{' '}
                  <code className="bg-white/10 px-1 rounded">
                    messages/{session?.user?.username || 'anonymous'}.txt
                  </code>
                </li>
                <li>✅ Sealed until January 1, 2035</li>
                <li>✅ Nobody can read it (not even you!) until then</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                isValid && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Sealing Your Message...
                </>
              ) : (
                '🔒 Seal My Message'
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 text-purple-200 text-sm">
            <p className="font-semibold mb-2">💡 Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Be honest and authentic</li>
              <li>Include predictions about technology or life in 2035</li>
              <li>Share your current dreams and goals</li>
              <li>Write advice for your future self</li>
              <li>You can edit until you submit (but not after!)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
