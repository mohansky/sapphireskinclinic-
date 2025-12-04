type Theme = 'ssac' | 'ssacdark';
 
function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme') as Theme | null;

  if (savedTheme && (savedTheme === 'ssac' || savedTheme === 'ssacdark')) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme: Theme = prefersDark ? 'ssacdark' : 'ssac';
    document.documentElement.setAttribute('data-theme', systemTheme);
    // Don't save to localStorage so it continues following system preference
  }
}
 
function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
  const newTheme: Theme = currentTheme === 'ssac' ? 'ssacdark' : 'ssac';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
   
  const themeController = document.getElementById('theme-controller') as HTMLInputElement | null;
  if (themeController) {
    themeController.checked = newTheme === 'ssacdark';
  }
}
 
function setupSystemThemeListener(): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme: Theme = e.matches ? 'ssacdark' : 'ssac';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });
}
 
document.addEventListener('DOMContentLoaded', () => { 
  const themeController = document.getElementById('theme-controller') as HTMLInputElement | null;
  if (themeController) {
    const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
    themeController.checked = currentTheme === 'ssacdark';
     
    themeController.addEventListener('change', toggleTheme);
  }
 
  setupSystemThemeListener();
});
 
initializeTheme();