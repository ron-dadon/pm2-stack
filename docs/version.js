// Load version dynamically from GitHub
function loadVersion() {
  fetch('https://raw.githubusercontent.com/ron-dadon/pm2-stack/master/package.json')
    .then(response => response.json())
    .then(data => {
      const versionElement = document.getElementById('version');
      if (versionElement) {
        versionElement.textContent = `v${data.version}`;
      }
    })
    .catch(error => {
      console.log('Could not load version from GitHub, using default');
    });
}

// Load version when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadVersion);
} else {
  loadVersion();
}
