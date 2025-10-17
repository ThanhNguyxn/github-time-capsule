# 🕰️ GitHub Time Capsule

A collaborative time capsule for developers around the world. Messages sealed in 2025, to be opened January 1, 2035.

---

## 📂 Repository Structure

```
dev-time-capsule/
├── .github/
│   └── workflows/
│       └── seal-the-capsule.yml    # GitHub Action for automatic sealing
├── messages/                        # Your messages go here (temporary)
│   └── EXAMPLE-MESSAGE.txt         # Example message template
├── sealed/                          # Encrypted messages stored here
├── scripts/
│   ├── decrypt-capsule.sh          # Decryption script for Linux/macOS
│   └── decrypt-capsule.ps1         # Decryption script for Windows
├── CODE_OF_CONDUCT.md              # Community guidelines
├── CONTRIBUTING.md                 # How to contribute your message
├── LICENSE                          # MIT License
├── README.md                        # Main documentation
└── SETUP.md                         # Maintainer setup guide (GPG keys)
```

---

## 🚀 Quick Start

1. **Fork** this repository
2. **Create** `messages/<your-username>.txt` with your message
3. **Submit** a Pull Request
4. **Watch** as your message is automatically encrypted and sealed!

For detailed instructions, see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📅 Important Dates

- **Launch:** October 17, 2025
- **Contribution Period:** October 2025 - December 2034
- **Unveiling:** January 1, 2035

---

## 🔐 How It Works

1. You write a message to your future self or the developer community
2. Submit via Pull Request
3. GitHub Actions automatically encrypts your message using GPG
4. Encrypted message is stored in `sealed/` directory
5. Your original message remains private (not merged to main)
6. On January 1, 2035, the decryption key is published
7. Everyone can decrypt and read all messages at once

---

## 📖 Documentation

- **[README.md](README.md)** - Project overview and concept
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Detailed contribution guide
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines
- **[SETUP.md](SETUP.md)** - Maintainer setup instructions
- **[LICENSE](LICENSE)** - MIT License

---

## 🛠️ For Maintainers

If you're setting up your own time capsule:

1. Follow [SETUP.md](SETUP.md) to generate GPG keys
2. Add `GPG_PUBLIC_KEY` to GitHub Secrets
3. Store private key securely until unveiling date
4. Configure GitHub Actions workflow
5. Test with a dummy PR

---

## 🎯 Project Goals

- Create a snapshot of the developer community in 2025
- Preserve predictions, wisdom, and reflections
- Foster connection across time
- Build something meaningful and inspiring
- Demonstrate creative use of GitHub features

---

## ⭐ Contributing

We welcome contributions of:
- Your time capsule message (see [CONTRIBUTING.md](CONTRIBUTING.md))
- Documentation improvements
- Translation to other languages
- Bug fixes for automation scripts

---

## 📊 Statistics

- **Messages Sealed:** Check `sealed/` directory
- **Contributors:** See GitHub insights
- **Days Until Unveiling:** Calculate from today to Jan 1, 2035

---

## 🤝 Community

- **Questions?** Open a [Discussion](../../discussions)
- **Found a bug?** Open an [Issue](../../issues)
- **Want to chat?** Join our community channels

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

Individual messages remain the property of their authors.

---

## 🙏 Acknowledgments

Thank you to every developer who contributes their voice to this project. You're making history.

---

## 🌟 Star This Repository

Don't forget to **star ⭐** this repository so you remember to come back on January 1, 2035!

---

**See you in the future! 🕰️**
