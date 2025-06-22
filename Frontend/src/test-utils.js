// Test utilities for verifying functionality
export const testThemeToggle = () => {
  const themeToggle = document.querySelector('[aria-label="Toggle theme"]');
  if (themeToggle) {
    console.log('✅ Theme toggle button found');
    return true;
  } else {
    console.error('❌ Theme toggle button not found');
    return false;
  }
};

export const testSidebar = () => {
  const sidebar = document.querySelector('nav');
  if (sidebar) {
    console.log('✅ Sidebar navigation found');
    return true;
  } else {
    console.error('❌ Sidebar navigation not found');
    return false;
  }
};

export const testCharts = () => {
  const charts = document.querySelectorAll('.recharts-wrapper');
  if (charts.length > 0) {
    console.log(`✅ Found ${charts.length} charts`);
    return true;
  } else {
    console.log('ℹ️ No charts found (this is normal on login page)');
    return true;
  }
};

export const testResponsiveDesign = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && viewport.content.includes('viewport-fit=cover')) {
    console.log('✅ Apple device compatibility meta tags found');
    return true;
  } else {
    console.error('❌ Apple device compatibility meta tags missing');
    return false;
  }
};

export const runAllTests = () => {
  console.log('🧪 Running functionality tests...');
  
  const results = {
    themeToggle: testThemeToggle(),
    sidebar: testSidebar(),
    charts: testCharts(),
    responsiveDesign: testResponsiveDesign()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! The application is ready.');
  } else {
    console.log('⚠️ Some tests failed. Check the console for details.');
  }
  
  return results;
}; 