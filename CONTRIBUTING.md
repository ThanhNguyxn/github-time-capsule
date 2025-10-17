# 🤝 Contributing to GitHub Time Capsule

Thank you for your interest in contributing! This project welcomes contributions from developers of all skill levels.

---

## 📋 Types of Contributions

### 1. 💬 Submit Your Message (User Contribution)
This is the primary way to participate! See the [main README](README.md) for instructions.

### 2. 🔧 Technical Contributions (Developer Contribution)
Improve the infrastructure, automation, security, or documentation.

---

## 🚀 Getting Started (Developers)

### Prerequisites

- Git installed
- GitHub account
- GPG/GnuPG installed (for testing encryption)
- GitHub CLI (`gh`) recommended

### Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/github-time-capsule-ho-c-dev-time-capsule.git
cd github-time-capsule-ho-c-dev-time-capsule

# Add upstream remote
git remote add upstream https://github.com/ThanhNguyxn/github-time-capsule-ho-c-dev-time-capsule.git
```

---

## 💡 Areas to Contribute

### 🔒 Security Improvements
- Review encryption implementation
- Suggest security enhancements
- Report vulnerabilities (see [Security Policy](#security-policy))

### ⚙️ Automation Enhancements
- Improve GitHub Actions workflows
- Add error handling
- Optimize performance

### 📖 Documentation
- Fix typos or unclear instructions
- Add translations
- Create tutorials or guides

### 🎨 UI/UX Improvements
- Improve README design
- Create visual diagrams
- Enhance user experience

### 🧪 Testing
- Add test coverage
- Create test scripts
- Verify edge cases

---

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

Follow these guidelines:
- ✅ Write clear commit messages
- ✅ Test your changes locally
- ✅ Update documentation if needed
- ✅ Follow existing code style

### 3. Test Your Changes

```bash
# Test workflow locally (if applicable)
act -j seal-message  # Requires 'act' tool

# Or test manually
./scripts/decrypt-capsule.sh  # Linux/Mac
./scripts/decrypt-capsule.ps1  # Windows
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "✨ Add: Your feature description"

# Commit message prefixes:
# ✨ Add: New feature
# 🐛 Fix: Bug fix
# 📖 Docs: Documentation
# 🎨 Style: Formatting
# ♻️ Refactor: Code restructuring
# 🧪 Test: Adding tests
# 🔒 Security: Security improvements
```

### 5. Push & Create PR

```bash
git push origin feature/your-feature-name

# Create PR via GitHub CLI (recommended)
gh pr create --title "Your PR Title" --body "Description of changes"

# Or create PR manually on GitHub
```

---

## 📝 Pull Request Guidelines

### PR Title Format

```
[Type] Brief description
```

**Examples:**
- `[Feature] Add support for multiple languages`
- `[Fix] Resolve file preservation issue in workflow`
- `[Docs] Improve setup instructions`
- `[Security] Strengthen encryption implementation`

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Motivation
Why is this change needed?

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots or GIFs if relevant.

## Checklist
- [ ] Code follows existing style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## 🧪 Testing Guidelines

### Manual Testing

```bash
# 1. Test encryption
echo "Test message" > messages/testuser.txt
gpg --encrypt \
    --recipient "GitHub Time Capsule" \
    --armor \
    --trust-model always \
    --output sealed/testuser.txt.gpg \
    messages/testuser.txt

# 2. Verify file size
ls -lh sealed/testuser.txt.gpg

# 3. Test decryption (requires private key)
gpg --decrypt sealed/testuser.txt.gpg
```

### Workflow Testing

```bash
# Create test PR to trigger workflow
git checkout -b test/seal-workflow-$(date +%s)
echo "Test at $(date)" > messages/$(gh api user -q .login).txt
git add messages/
git commit -m "Test seal workflow"
git push origin HEAD
gh pr create --title "Test: Seal workflow" --body "Automated test"

# Monitor workflow
gh run watch

# Verify result
gh pr view --json state,comments

# Cleanup
gh pr close
git checkout main
git branch -D test/seal-workflow-*
```

---

## 🎨 Code Style

### YAML (Workflows)

```yaml
# Use 2 spaces for indentation
name: Workflow Name

on:
  pull_request:
    types: [opened]

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Step name
        run: |
          command1
          command2
```

### Bash Scripts

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Use descriptive variable names
encrypted_file="sealed/${username}.txt.gpg"

# Add comments for complex logic
# This loop decrypts all sealed messages
for file in sealed/*.gpg; do
    # Extract filename without extension
    filename=$(basename "$file" .gpg)
    echo "Decrypting: $filename"
done
```

### Markdown

```markdown
# Use ATX-style headers (# not underlines)

# Top-level heading
## Second-level heading

# Use fenced code blocks with language
```bash
echo "Hello"
```

# Use emoji sparingly but consistently
✅ Do this
❌ Not this
```

---

## 🔒 Security Policy

### Reporting Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.

Instead:
1. Email the maintainers at [security contact]
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Security Best Practices

- ✅ Never commit secrets or private keys
- ✅ Use GitHub Secrets for sensitive data
- ✅ Review PRs carefully for security implications
- ✅ Test encryption/decryption thoroughly
- ✅ Follow principle of least privilege

---

## 📖 Documentation Standards

### README Files

- Start with a clear description
- Include step-by-step instructions
- Add examples and screenshots
- Use consistent formatting
- Keep language simple and accessible

### Code Comments

```bash
# Good: Explains WHY, not just WHAT
# Save file to /tmp to preserve it across branch checkout
cp "$file" "/tmp/$file"

# Bad: Just repeats the code
# Copy file to tmp
cp "$file" "/tmp/$file"
```

### Technical Documentation

- Include architecture diagrams
- Document all workflows and APIs
- Provide troubleshooting guides
- Keep up-to-date with code changes

---

## 🎯 Project Priorities

### High Priority
- 🔒 Security and encryption robustness
- 🤖 Workflow reliability and automation
- 📖 Clear, accessible documentation

### Medium Priority
- 🌍 Internationalization (translations)
- 📊 Statistics and analytics
- 🎨 UI/UX improvements

### Low Priority
- 🎉 Nice-to-have features
- 🔧 Code optimizations
- 📝 Extended documentation

---

## 🚫 What NOT to Contribute

### ❌ Don't Submit
- Breaking changes without discussion
- Features that complicate the user experience
- Unnecessary dependencies
- Code that violates the license
- Offensive or inappropriate content

### ⚠️ Discuss First
- Major architectural changes
- New dependencies or tools
- Changes to encryption/security
- Feature additions

**Open an issue first** to discuss significant changes!

---

## 🌍 Translation Contributions

We welcome translations to make this project accessible globally!

### Adding a New Language

1. Create `README.<lang>.md` (e.g., `README.fr.md` for French)
2. Translate the main README content
3. Keep technical terms consistent
4. Add link to translation in main README

### Translation Guidelines

- ✅ Maintain the same structure as English version
- ✅ Adapt idioms and expressions appropriately
- ✅ Keep code examples unchanged
- ✅ Update language in PR to match translation

---

## 💬 Communication

### Where to Ask Questions

- 💡 **General questions**: Open a [GitHub Discussion]
- 🐛 **Bug reports**: Open a [GitHub Issue]
- 💬 **Feature requests**: Open a [GitHub Issue] with `[Feature Request]` prefix
- 🔒 **Security issues**: Email maintainers directly

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person
- Assume good intentions

---

## 🏆 Recognition

All contributors will be:
- ✨ Listed in the project contributors
- 🎉 Mentioned in release notes
- 💙 Appreciated and thanked!

---

## 📚 Additional Resources

- [Technical Documentation](TECHNICAL.md)
- [Setup Guide](SETUP.md)
- [Automation Details](AUTOMATION.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GPG Documentation](https://gnupg.org/documentation/)

---

<div align="center">

## 🎉 Ready to Contribute?

### [Fork the Repository](../../fork) | [Open an Issue](../../issues/new)

**Every contribution matters! Thank you for helping make this project better.** ❤️

</div>

---

**Questions?** Feel free to open a [Discussion](../../discussions) or reach out to the maintainers.

**Happy Contributing!** 🚀
