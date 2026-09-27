(function() {
  'use strict';
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = window.innerWidth < 768;

  let tier = 'high';
  if (isMobile || mem < 2 || cores < 2) tier = 'low';
  else if (mem < 4 || cores < 4) tier = 'mid';

  window.DeviceTier = { tier, mem, cores, isMobile };
  document.documentElement.classList.add('tier-' + tier);
})();	