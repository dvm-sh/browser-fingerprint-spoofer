# 🤝 Contributing to Browser Fingerprint Spoofer

Thank you for your interest in contributing to Browser Fingerprint Spoofer! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Questions and Discussions](#questions-and-discussions)

## 📜 Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. By participating, you agree to:

- Be respectful and considerate of others
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 How Can I Contribute?

### Types of Contributions

- **Bug Reports**: Report bugs and issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests with code changes
- **Documentation**: Improve or add documentation
- **Testing**: Test the extension and report findings
- **Translation**: Help translate the extension to other languages

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Read the documentation** to understand how the extension works
3. **Set up your development environment** (see Development Setup below)

## 🛠️ Development Setup

### Prerequisites

- Node.js 14.0.0 or higher
- Chrome/Edge browser
- Git

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/browser-fingerprint-spoofer.git
   cd browser-fingerprint-spoofer
   ```

2. **Install dependencies** (if any are added in the future)
   ```bash
   npm install
   ```

3. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension` folder

4. **Make your changes** in the appropriate files

5. **Test your changes**
   - Reload the extension
   - Test the functionality
   - Check for any console errors

## 📝 Code Style Guidelines

### JavaScript

- Use **ES6+ features** when possible
- Follow **consistent naming conventions**
- Use **meaningful variable and function names**
- Add **comments** for complex logic
- Use **async/await** instead of callbacks when possible
- Follow **existing code patterns** in the project

### HTML

- Use **semantic HTML5** elements
- Ensure **accessibility** standards are met
- Use **consistent indentation** (2 spaces)
- Include **alt attributes** for images

### CSS

- Use **consistent naming conventions** (BEM methodology preferred)
- Organize styles **logically**
- Use **CSS variables** for colors and common values
- Ensure **responsive design** principles

### General

- **Keep functions small** and focused
- **Avoid code duplication**
- **Handle errors gracefully**
- **Write self-documenting code**

## 🧪 Testing Guidelines

### Manual Testing

1. **Test the extension** in different scenarios
2. **Check browser compatibility** (Chrome, Edge)
3. **Test with different privacy levels**
4. **Verify fingerprint spoofing** on test sites
5. **Check for console errors**

### Test Sites

Use these sites to test fingerprint protection:
- [BrowserLeaks](https://browserleaks.com/)
- [AmIUnique](https://amiunique.org/)
- [FingerprintJS](https://fingerprintjs.com/demo/)

### Automated Testing

When adding new features, consider:
- Unit tests for utility functions
- Integration tests for extension components
- End-to-end tests for critical user flows

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows** the style guidelines
2. **Test thoroughly** on different browsers and scenarios
3. **Update documentation** if needed
4. **Check that all tests pass** (if applicable)

### Pull Request Guidelines

1. **Use descriptive titles** that explain the change
2. **Provide detailed descriptions** of what was changed and why
3. **Include screenshots** for UI changes
4. **Reference related issues** using keywords like "Fixes #123"
5. **Keep changes focused** - one feature or fix per PR

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Edge
- [ ] Tested different privacy levels
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots here for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Reporting Bugs

### Before Reporting

1. **Check existing issues** to see if the bug is already reported
2. **Try to reproduce** the issue consistently
3. **Check browser console** for error messages
4. **Test on different browsers** to see if it's browser-specific

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- Browser: [e.g., Chrome 120.0.0.0]
- Extension Version: [e.g., 1.0.0]
- Privacy Level: [e.g., Standard]
- Configuration Profile: [e.g., Windows Chrome]

## Console Errors
Any error messages from the browser console.

## Screenshots
If applicable, add screenshots to help explain the problem.

## Additional Context
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** to see if the feature is already requested
2. **Think about the use case** and how it would benefit users
3. **Consider implementation complexity** and maintenance

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature you'd like to see.

## Use Case
Explain why this feature would be useful and how you would use it.

## Proposed Implementation
If you have ideas about how to implement this feature, share them.

## Alternatives Considered
Any alternative solutions you've considered.

## Additional Context
Any other context or screenshots about the feature request.
```

## ❓ Questions and Discussions

### Getting Help

- **GitHub Issues**: Use the issues page for questions
- **GitHub Discussions**: Use discussions for general questions
- **Documentation**: Check the README and other docs first

### Asking Questions

When asking questions:
- **Be specific** about what you're trying to do
- **Include relevant code** or error messages
- **Describe your environment** (browser, extension version)
- **Show what you've tried** so far

## 📚 Additional Resources

- [Chrome Extension Development Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Browser Fingerprinting Techniques](https://fingerprintjs.com/blog/browser-fingerprinting/)

## 🙏 Thank You

Thank you for contributing to Browser Fingerprint Spoofer! Your contributions help make the extension better for everyone.

---

**Happy coding! 🚀**
