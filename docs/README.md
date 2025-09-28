# PM2Stack Documentation

This directory contains the documentation website for PM2Stack, deployed to GitHub Pages.

## Structure

- `index.html` - Main documentation page
- `styles.css` - CSS styling for the documentation
- `script.js` - JavaScript for interactive features

## Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Interactive Navigation** - Smooth scrolling and active section highlighting
- **Code Examples** - Syntax-highlighted code blocks with copy functionality
- **Tabbed Content** - Organized installation and example sections
- **Modern UI** - Clean, professional design with smooth animations

## Local Development

To view the documentation locally:

1. Open `index.html` in your web browser
2. Or use the npm scripts (recommended):
   ```bash
   # From the project root
   npm run docs:serve        # Python server
   npm run docs:serve:node   # Node.js server  
   npm run docs:dev          # Build + serve
   ```
3. Or serve it manually:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve docs
   
   # Using PHP
   php -S localhost:8000
   ```

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by the GitHub Actions workflow in `.github/workflows/deploy-docs.yml`.

## Customization

To customize the documentation:

1. **Content**: Edit `index.html` to update the documentation content
2. **Styling**: Modify `styles.css` to change the appearance
3. **Interactivity**: Update `script.js` to add or modify interactive features

## GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. The workflow will automatically deploy the docs folder

The documentation will be available at: `https://ron-dadon.github.io/pm2-stack`
