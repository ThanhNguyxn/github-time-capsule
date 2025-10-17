import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-end">
          <AuthButton />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight">
              🕰️ GitHub Time Capsule
            </h1>
            <p className="text-xl sm:text-2xl text-purple-200 font-light">
              Send a Message to Your Future Self
            </p>
          </div>

          {/* Badge */}
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-sm font-medium">
              ✅ Open for Messages
            </span>
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm font-medium">
              🔓 Unlocks Jan 1, 2035
            </span>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Write a message today and GitHub will <span className="font-semibold text-white">automatically lock it</span>. 
            On <span className="font-semibold text-white">January 1, 2035</span>, your message (and thousands of others) 
            will <span className="font-semibold text-white">automatically unlock</span> for everyone to read!
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-col sm:flex-row pt-4">
            <Link
              href="/submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              ✍️ Write Your Message
            </Link>
            <a
              href="https://github.com/ThanhNguyxn/github-time-capsule"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-200 text-lg"
            >
              📖 Learn More
            </a>
          </div>

          {/* Countdown Timer */}
          <div className="pt-16">
            <CountdownTimer />
          </div>

          {/* How it works */}
          <div className="pt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Write</h3>
                <p className="text-purple-200">Sign in and write your message to the future</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Seal</h3>
                <p className="text-purple-200">Your message is encrypted and locked until 2035</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Read</h3>
                <p className="text-purple-200">On Jan 1, 2035, all messages unlock automatically</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-purple-300 text-sm">
        <p>Made with ❤️ for the future | <a href="https://github.com/ThanhNguyxn/github-time-capsule" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
      </footer>
    </div>
  );
}
