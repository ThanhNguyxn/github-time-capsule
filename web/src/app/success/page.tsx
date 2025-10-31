'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const prNumber = searchParams.get('pr');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 border-4 border-green-500 rounded-full">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Message Sealed!
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Your message to the future has been successfully submitted and will be encrypted shortly.
        </p>

        {/* What Happens Next */}
        <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔒 What Happens Next:
          </h2>
          <div className="space-y-3 text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold text-white">1. Automated Processing</p>
                <p className="text-sm">GitHub Actions will verify your submission (~30 seconds)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-semibold text-white">2. Encryption</p>
                <p className="text-sm">Your message will be encrypted with GPG</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-white">3. Sealed</p>
                <p className="text-sm">Stored in the sealed folder, unreadable until 2035</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-semibold text-white">4. Wait 10 Years</p>
                <p className="text-sm">Your message will automatically unlock on January 1, 2035!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pull Request Link */}
        {prNumber && (
          <div className="mb-8">
            <a
              href={`https://github.com/ThanhNguyxn/github-time-capsule/pull/${prNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-200"
            >
              📋 View Pull Request #{prNumber}
            </a>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Security Card */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔒</span>
              <h3 className="font-bold text-green-100 text-lg">Secured</h3>
            </div>
            <div className="space-y-2 text-sm text-green-200">
              <p>✓ <strong>Encrypted</strong> with AES-256</p>
              <p>✓ <strong>Client-side</strong> encryption</p>
              <p>✓ <strong>Private</strong> until 2035</p>
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">⏰</span>
              <h3 className="font-bold text-blue-100 text-lg">Countdown</h3>
            </div>
            <div className="text-sm text-blue-200">
              <p className="mb-2">Unlocks on:</p>
              <p className="text-xl font-bold text-white">January 1, 2035</p>
              <p className="mt-2 text-xs opacity-75">~10 years from now</p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-bold text-yellow-100 mb-2">Important Notice</p>
              <div className="text-sm text-yellow-200 space-y-1">
                <p>• Your message is now <strong>permanently sealed</strong></p>
                <p>• It <strong>cannot be edited or deleted</strong></p>
                <p>• <strong>No one</strong> can read it (not even you!) until 2035</p>
                <p>• GitHub Actions will auto-unlock it on January 1, 2035</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Receive */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-purple-100 text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">📬</span>
            How to Receive Your Message in 2035
          </h3>
          <div className="space-y-3 text-sm text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⭐</span>
              <div>
                <p className="font-semibold text-white">Star the Repository</p>
                <p className="text-xs opacity-90">Get notified when activity happens</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">👁️</span>
              <div>
                <p className="font-semibold text-white">Watch → All Activity</p>
                <p className="text-xs opacity-90">Receive email notifications</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔔</span>
              <div>
                <p className="font-semibold text-white">Set a Reminder</p>
                <p className="text-xs opacity-90">Calendar reminder for January 1, 2035</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            🏠 Back to Home
          </Link>
          <a
            href="https://github.com/ThanhNguyxn/github-time-capsule"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-200"
          >
            ⭐ Star on GitHub
          </a>
        </div>

        {/* Social Share */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-purple-200 mb-4">
            Share this time capsule with your friends! 🚀
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('I just sealed a message to my future self in the GitHub Time Capsule! It will unlock on January 1, 2035. 🕰️✨')}&url=${encodeURIComponent('https://github.com/ThanhNguyxn/github-time-capsule')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              🐦 Tweet
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://github.com/ThanhNguyxn/github-time-capsule');
                alert('Link copied to clipboard!');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/30"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
