// Responsive utility — defines window.useIsMobile(bp?)
// Load after React but before any component that calls it.
(function () {
  /**
   * useIsMobile(bp = 900)
   * Returns true when window.innerWidth < bp; re-evaluates on resize.
   * Call inside a React component (same rules as any hook).
   */
  window.useIsMobile = function useIsMobile(bp) {
    if (bp === undefined) bp = 900;
    var pair     = React.useState(window.innerWidth < bp);
    var isMobile = pair[0];
    var setMob   = pair[1];
    React.useEffect(function () {
      function onResize() { setMob(window.innerWidth < bp); }
      window.addEventListener('resize', onResize);
      return function () { window.removeEventListener('resize', onResize); };
    }, []);
    return isMobile;
  };
}());
