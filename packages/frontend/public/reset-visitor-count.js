// Reset visitor count to 1110
// Run this in browser console to reset the counter immediately

function resetVisitorCountTo1110() {
  localStorage.setItem('portfolio-visitor-count', '1110');
  localStorage.removeItem('portfolio-visited');
  localStorage.removeItem('portfolio-last-visit');
  
  console.log('✅ Visitor count reset to 1110');
  console.log('🔄 Refresh the page to see the updated count');
  
  // Automatically refresh the page
  window.location.reload();
}

// Auto-execute the reset
resetVisitorCountTo1110();