# Contributing to Bird Clicker Game 🐦

First off, thank you for considering contributing to Bird Clicker Game! It's people like you that make this game better for everyone. 🎮

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code:

- **Be respectful**: Treat everyone with respect. Harassment and abusive language are not tolerated.
- **Be collaborative**: Work together and help each other learn and grow.
- **Be patient**: Remember that everyone has different skill levels and experience.
- **Be constructive**: Provide helpful feedback and suggestions.

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, please include:

- **Clear title**: Use a descriptive title for the issue
- **Description**: Describe the bug in detail
- **Steps to reproduce**: List the exact steps to reproduce the problem
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable, add screenshots
- **Environment**: Browser version, OS, device type
- **Additional context**: Any other relevant information

**Example:**

```markdown
### Bug: Upgrades not saving after refresh

**Description:** When I purchase upgrades and refresh the page, my upgrades reset to 0.

**Steps to Reproduce:**
1. Purchase 5 Auto Click upgrades
2. Refresh the page
3. Check upgrade count

**Expected:** Upgrades should be saved
**Actual:** Upgrades reset to 0
**Browser:** Chrome 120.0
**OS:** Windows 11
```

### Suggesting Features ✨

We love feature suggestions! Here's how to suggest a feature:

- **Check existing suggestions**: Search issues to see if it's already been suggested
- **Be specific**: Clearly describe the feature and its benefits
- **Use cases**: Explain when/how the feature would be used
- **Mockups**: If possible, include mockups or examples

**Feature Request Template:**

```markdown
### Feature Request: Offline Earnings

**Description:** Allow players to earn coins while offline

**Use Case:** Players who can't actively play for extended periods can still progress

**Proposed Implementation:**
- Calculate time offline
- Award percentage of auto-income
- Cap at 8 hours maximum

**Benefits:**
- Better player retention
- More rewarding gameplay
- Encourages regular play sessions
```

### Code Contributions 💻

We welcome code contributions! Here are areas where you can help:

1. **Bug Fixes**: Fix reported bugs
2. **New Features**: Implement requested features
3. **Performance**: Optimize existing code
4. **Documentation**: Improve README, comments, guides
5. **Testing**: Add tests, improve coverage
6. **UI/UX**: Enhance design and user experience
7. **Accessibility**: Make the game more accessible
8. **Localization**: Add language support

## 🛠️ Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code, Sublime Text, etc.)
- Basic knowledge of HTML, CSS, JavaScript
- Git for version control

### Setup Instructions

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Bird-Clicker-Game.git
   cd Bird-Clicker-Game
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Open the game**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

5. **Make your changes**
   - Edit the files
   - Test thoroughly
   - Ensure everything works

6. **Test your changes**
   - Test on multiple browsers
   - Test on mobile devices
   - Check console for errors
   - Verify all features work

## 🔄 Pull Request Process

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Check console for errors
- [ ] Test on mobile and desktop
- [ ] Follow the code style guidelines
- [ ] Add comments to complex code
- [ ] Remove any debug code

### Creating a Pull Request

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Pull Request Template

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] UI/UX enhancement

## Changes Made
- List the main changes
- Be specific about what was modified

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] No console errors
- [ ] All features work correctly

## Screenshots
If applicable, add screenshots

## Related Issues
Fixes #issue_number
```

### Review Process

- Maintainers will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged
- You'll be added to the contributors list! 🎉

## 🎨 Style Guidelines

### JavaScript

```javascript
// Use camelCase for variables and functions
let playerScore = 0;
function updateScore() { }

// Use const for constants
const MAX_LEVEL = 100;

// Add comments for complex logic
// Calculate prestige bonus based on level and multiplier
const bonus = level * prestigeMultiplier;

// Use meaningful variable names
let clickMultiplier = 1; // Good
let cm = 1; // Bad

// Keep functions focused and small
// Good: Does one thing
function saveScore() {
    localStorage.setItem('score', score);
}

// Bad: Does too many things
function saveAndUpdateAndNotify() { }
```

### HTML

```html
<!-- Use semantic HTML -->
<button class="upgrade-btn">Upgrade</button>

<!-- Use descriptive IDs and classes -->
<div id="achievements-modal">
<div class="glass-dark">

<!-- Keep it organized and indented -->
<div class="container">
    <div class="row">
        <div class="col">
            Content
        </div>
    </div>
</div>
```

### CSS / Tailwind

```css
/* Use Tailwind utility classes */
<div class="bg-gradient-to-r from-amber-500 to-orange-500">

/* Group related classes -->
<button class="
    bg-blue-500 hover:bg-blue-600 
    text-white font-bold 
    py-2 px-4 
    rounded
">

/* Use responsive classes -->
<div class="w-full md:w-1/2 lg:w-1/3">
```

### Commit Messages

```bash
# Good commit messages
git commit -m "Add daily reward system"
git commit -m "Fix save/load bug on mobile"
git commit -m "Improve mini-game performance"
git commit -m "Update README with new features"

# Bad commit messages
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

## 📁 Project Structure

```
Bird-Clicker-Game/
├── index.html              # Main HTML file
├── script.js               # Game logic
├── assets/                 # Images, sounds, etc.
│   ├── Backgrounds/        # Background images
│   ├── *.png              # Game images
│   └── *.mp3              # Sound effects
├── README.md              # Project documentation
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # This file
├── CHANGELOG.md           # Version history
└── RELEASE_NOTES.md       # Release information
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Mobile touch controls improvement
- [ ] Offline earnings system
- [ ] Cloud save functionality
- [ ] More mini-games
- [ ] Achievement expansion

### Medium Priority
- [ ] Sound effect variety
- [ ] More bird skins
- [ ] Particle effect enhancements
- [ ] Social features
- [ ] Leaderboards

### Low Priority
- [ ] Themes/skins system
- [ ] Easter eggs
- [ ] Holiday events
- [ ] Advanced statistics
- [ ] Export/import save data

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Test all upgrade purchases
- [ ] Test all power-ups
- [ ] Test level progression
- [ ] Test achievements unlock
- [ ] Test save/load functionality
- [ ] Test all modals open/close
- [ ] Test on mobile devices
- [ ] Test on different screen sizes
- [ ] Test audio on/off
- [ ] Test background theme changes
- [ ] Test mini-games
- [ ] Test premium store
- [ ] Test prestige system
- [ ] Test daily rewards

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## 📱 Mobile-Specific Guidelines

When contributing mobile features:

- Test on actual devices, not just emulators
- Ensure touch targets are at least 44x44px
- Test in both portrait and landscape
- Optimize for performance on slower devices
- Consider data usage and battery consumption

## 🌍 Localization

Want to add language support?

1. Create a language file: `lang/[language-code].json`
2. Translate all strings
3. Add language selector to UI
4. Test thoroughly
5. Submit PR

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 💬 Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Pull Requests**: For code contributions

### Recognition

Contributors will be:
- Added to the README contributors section
- Mentioned in release notes
- Recognized in the game credits (if applicable)

## 🎉 First-Time Contributors

New to open source? No problem! Here are some good first issues:

- Documentation improvements
- Fixing typos
- Adding comments to code
- UI tweaks and improvements
- Adding sound effects
- Creating new achievements

Look for issues tagged with `good-first-issue` or `help-wanted`!

## ❓ Questions?

If you have questions:

1. Check existing issues and discussions
2. Read the documentation
3. Ask in GitHub Discussions
4. Open an issue if needed

## 🙏 Thank You!

Thank you for taking the time to contribute! Every contribution, no matter how small, makes a difference. Together, we're building an amazing game that thousands of people enjoy! 🎮🐦

---

**Happy Contributing!** 🚀

Made with ❤️ by the Bird Clicker Community