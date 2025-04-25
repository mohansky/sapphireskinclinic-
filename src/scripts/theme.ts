type Theme = 'garden' | 'black';
 
function initializeTheme(): void { 
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (savedTheme && (savedTheme === 'garden' || savedTheme === 'black')) { 
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else { 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme: Theme = prefersDark ? 'black' : 'garden';
    document.documentElement.setAttribute('data-theme', systemTheme);
    localStorage.setItem('theme', systemTheme);
  }
}
 
function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
  const newTheme: Theme = currentTheme === 'garden' ? 'black' : 'garden';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
   
  const themeController = document.getElementById('theme-controller') as HTMLInputElement | null;
  if (themeController) {
    themeController.checked = newTheme === 'black';
  }
}
 
function setupSystemThemeListener(): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => { 
    if (!localStorage.getItem('theme')) {
      const newTheme: Theme = e.matches ? 'black' : 'garden';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });
}
 
document.addEventListener('DOMContentLoaded', () => { 
  const themeController = document.getElementById('theme-controller') as HTMLInputElement | null;
  if (themeController) { 
    const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
    themeController.checked = currentTheme === 'black';
     
    themeController.addEventListener('change', toggleTheme);
  }
 
  setupSystemThemeListener();
});
 
initializeTheme();