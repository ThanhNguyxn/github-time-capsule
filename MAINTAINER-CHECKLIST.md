# 🔧 Maintainer Checklist

Use this checklist when setting up or maintaining The GitHub Time Capsule.

---

## 🚀 Initial Setup

### 1. GPG Key Generation
- [ ] Install GPG on your system
- [ ] Generate 4096-bit RSA key pair
- [ ] Set recipient as `time-capsule-2035`
- [ ] Set no expiration date
- [ ] Create strong passphrase
- [ ] Document key ID and fingerprint

### 2. Key Storage
- [ ] Export public key to `public-key.asc`
- [ ] Export private key to `private-key.asc`
- [ ] Add public key to GitHub Secrets as `GPG_PUBLIC_KEY`
- [ ] Store private key in safe deposit box (location 1)
- [ ] Store private key on encrypted USB (location 2)
- [ ] Store private key on encrypted USB (location 3)
- [ ] Print private key on paper (fireproof safe)
- [ ] Store in encrypted cloud backup (optional)
- [ ] Store passphrase separately (password manager)
- [ ] Document all storage locations
- [ ] Delete local copies of keys

### 3. GitHub Configuration
- [ ] Add GPG_PUBLIC_KEY to repository secrets
- [ ] Enable GitHub Actions
- [ ] Test workflow with dummy PR
- [ ] Configure branch protection rules (optional)
- [ ] Set up repository description and topics
- [ ] Add repository social image (optional)

### 4. Documentation Review
- [ ] Verify README.md is complete
- [ ] Verify CONTRIBUTING.md has clear instructions
- [ ] Verify SETUP.md has correct setup steps
- [ ] Update CODE_OF_CONDUCT.md with contact info
- [ ] Review all example files
- [ ] Check all links work

### 5. Community Setup
- [ ] Enable Discussions
- [ ] Enable Issues
- [ ] Set up issue templates
- [ ] Set up PR template
- [ ] Create initial discussion topics
- [ ] Set up labels for organization

---

## 📅 Annual Maintenance (October Each Year)

### Security Check
- [ ] Verify private key backups are accessible
- [ ] Test decryption with one backup
- [ ] Verify passphrase is still accessible
- [ ] Check physical storage locations
- [ ] Rotate USB drives if needed (every 5 years)
- [ ] Update encryption if standards change

### Repository Health
- [ ] Review and close stale issues
- [ ] Update documentation if needed
- [ ] Check GitHub Actions are still running
- [ ] Verify sealed messages count
- [ ] Review community guidelines
- [ ] Update maintainer contact info

### Community Management
- [ ] Welcome new contributors
- [ ] Respond to questions and issues
- [ ] Moderate for Code of Conduct compliance
- [ ] Share project updates
- [ ] Celebrate milestones

---

## 🔍 Weekly/Monthly Checks

### PR Processing
- [ ] Monitor incoming PRs
- [ ] Verify GitHub Action is sealing messages
- [ ] Check for any failed encryptions
- [ ] Review PR comments for issues
- [ ] Thank contributors

### Issue Management
- [ ] Respond to new issues within 48 hours
- [ ] Label issues appropriately
- [ ] Close resolved issues
- [ ] Update documentation based on common questions

### Statistics Tracking (Optional)
- [ ] Count total sealed messages
- [ ] Track contributor countries/time zones
- [ ] Note any interesting patterns or milestones
- [ ] Share stats with community

---

## 🎆 The Unveiling Preparation (2034)

### 6 Months Before (June 2034)
- [ ] Retrieve all private key backups
- [ ] Verify all backups can decrypt messages
- [ ] Test decryption scripts
- [ ] Prepare announcement plan
- [ ] Set up unveiling event (virtual/physical)
- [ ] Contact active maintainers
- [ ] Archive final statistics

### 3 Months Before (September 2034)
- [ ] Stop accepting new messages
- [ ] Final backup of all sealed messages
- [ ] Test decryption process end-to-end
- [ ] Prepare unveiling website/viewer
- [ ] Draft unveiling announcement
- [ ] Plan social media campaign

### 1 Month Before (December 2034)
- [ ] Announce unveiling date reminder
- [ ] Invite original contributors back
- [ ] Set up live unveiling event
- [ ] Prepare decryption key publication
- [ ] Test all systems
- [ ] Create countdown timer

### Unveiling Day (January 1, 2035)
- [ ] Publish private key
- [ ] Publish passphrase
- [ ] Run decryption script
- [ ] Publish decrypted messages
- [ ] Host unveiling event
- [ ] Share results with community
- [ ] Create highlight reels
- [ ] Archive entire project

---

## 🚨 Emergency Procedures

### Private Key Lost
- [ ] Check all documented backup locations
- [ ] Contact all maintainers with backup access
- [ ] Attempt recovery from secret shares
- [ ] Document incident
- [ ] Communicate transparently with community
- [ ] Consider key regeneration and re-encryption

### Private Key Compromised
- [ ] Generate new key pair immediately
- [ ] Update GitHub Secret
- [ ] Re-encrypt all existing messages
- [ ] Securely store new private key
- [ ] Document incident
- [ ] Announce to community (if necessary)

### GitHub Actions Failure
- [ ] Check Actions logs for errors
- [ ] Verify GPG_PUBLIC_KEY secret exists
- [ ] Test encryption manually
- [ ] Fix workflow YAML if needed
- [ ] Re-run failed workflows
- [ ] Document solution

### Maintainer Unavailable
- [ ] Have backup maintainers identified
- [ ] Share key storage locations with trusted backups
- [ ] Document access procedures
- [ ] Set up "dead man's switch" for key release
- [ ] Legal arrangements for key access

---

## 📊 Metrics to Track

### Project Health
- Total messages sealed
- Contributors count
- Countries represented
- Languages used
- Stars/forks count
- Community engagement

### Technical Metrics
- Encryption success rate
- Average PR processing time
- Storage used
- Actions minutes used

---

## 🤝 Maintainer Responsibilities

### Code of Conduct Enforcement
- Review reported violations
- Take appropriate action
- Communicate decisions
- Document incidents
- Update guidelines as needed

### Community Building
- Welcome new contributors
- Respond to questions
- Foster positive environment
- Celebrate milestones
- Share interesting messages (with permission)

### Technical Maintenance
- Keep workflows updated
- Monitor for security issues
- Update dependencies
- Test encryption regularly
- Maintain documentation

---

## 📞 Important Contacts

### Primary Maintainer
- Name: [Your Name]
- Email: [Your Email]
- GitHub: [@username]
- Backup Contact: [Phone/Other]

### Backup Maintainers
- Maintainer 2: [Info]
- Maintainer 3: [Info]

### Legal/Emergency
- Legal Counsel: [If applicable]
- Key Executor: [Person with access in emergency]

### Key Storage Locations
- Location 1: [Details]
- Location 2: [Details]
- Location 3: [Details]

---

## 🎯 Success Criteria

By unveiling day, we should have:
- [ ] 1,000+ sealed messages
- [ ] 100+ countries represented
- [ ] Active community engagement
- [ ] All keys secure and accessible
- [ ] Successful test decryption
- [ ] Documentation complete
- [ ] Unveiling event planned
- [ ] Media coverage (optional)

---

## 📝 Notes

Add any project-specific notes, decisions, or context here:

---

**Last Updated:** [Date]  
**Next Review:** [Date]  
**Maintainer:** [Name]
