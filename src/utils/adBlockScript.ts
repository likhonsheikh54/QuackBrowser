/**
 * Ad blocking script for WebView
 * This script is injected into websites to block common ad networks and trackers
 */

export const AD_BLOCK_SCRIPT = `
(function() {
  // Common ad-related class names and IDs to hide
  const adSelectors = [
    // Common ad container class names
    '.ad', '.ads', '.adsbygoogle', '.adContainer', '.ad-container', '.ad-wrapper',
    '.banner-ads', '.banner_ad', '.displayAd', '.sponsored-ads', '.sponsored',
    
    // Common ad container IDs
    '#ad', '#ads', '#adContainer', '#ad-container', '#banner-ad', '#sponsored',
    '#carbonads', '#adBox', '#ad-wrapper', '#adFooter',
    
    // Common ad network elements
    'ins.adsbygoogle', 'div[data-ad-slot]', 'div[data-ad]',
    'div[data-ad-client]', 'div[id^="google_ads_"]',
    'div[id^="div-gpt-ad"]', 'div[id^="ad_position_"]',

    // Common popup and overlay ads
    '.popup-ad', '.modal-ad', '.overlay-ad', '#popupAd', '#overlayAd',
    '.popupAd', '.overlayAd', 'div[class*="popup"][class*="ad"]',
    
    // Social media sponsored content
    '[data-testid="tweet"][data-promoted="true"]',
    '[data-ad-comet-preview="message_sponsors"]',
    '[data-pagelet="FeedUnit"]:has(div[data-testid="fbFeedAdMeta"])',
    
    // Video ads
    '.video-ads', '.videoAd', '.pre-roll-ad', '.preroll-ad-container',
    '.post-roll-ad', '#prerollAd', '#postrollAd'
  ];
  
  // Function to hide ad elements
  function hideAds() {
    try {
      let adCount = 0;
      
      // Iterate through all selectors and hide matching elements
      adSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el && el.style) {
              el.style.display = 'none';
              el.style.opacity = '0';
              el.style.visibility = 'hidden';
              el.style.height = '0';
              el.style.minHeight = '0';
              el.style.maxHeight = '0';
              el.style.overflow = 'hidden';
              el.style.pointerEvents = 'none';
              el.setAttribute('aria-hidden', 'true');
              adCount++;
            }
          });
        } catch (e) {
          // Ignore errors for individual selectors
        }
      });
      
      // Remove common ad iframes
      try {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          try {
            const src = iframe.src || '';
            if (src.includes('doubleclick.net') || 
                src.includes('googleadservices') || 
                src.includes('adsystem') || 
                src.includes('adnxs') || 
                src.includes('amazon-adsystem') ||
                src.includes('/ads/') ||
                src.includes('banner') && src.includes('ad')) {
              iframe.style.display = 'none';
              adCount++;
            }
          } catch (e) {
            // Skip this iframe if there's an error
          }
        });
      } catch (e) {
        // Ignore iframe errors
      }
      
      // Clean up URL tracking parameters
      try {
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 
                              'utm_content', 'fbclid', 'gclid', 'msclkid', 'zanpid'];
        
        if (window.location.search && window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          let modified = false;
          
          trackingParams.forEach(param => {
            if (url.searchParams.has(param)) {
              url.searchParams.delete(param);
              modified = true;
            }
          });
          
          if (modified) {
            window.history.replaceState({}, document.title, url.toString());
          }
        }
      } catch (e) {
        // Ignore URL cleaning errors
      }
      
      return adCount;
    } catch (e) {
      // Return 0 if the entire function fails
      return 0;
    }
  }
  
  // Initial ad blocking
  let totalBlocked = hideAds();
  
  // Set up observer to block dynamically loaded ads
  try {
    const observer = new MutationObserver(mutations => {
      if (mutations.length > 0) {
        totalBlocked += hideAds();
      }
    });
    
    // Start observing document for new nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  } catch (e) {
    // Fall back to timed checks if MutationObserver fails
    setInterval(hideAds, 3000);
  }
  
  // Prevent some common popup techniques
  try {
    // Override common popup methods
    window.open = function() { return null; };
    window.alert = function() { return null; };
    
    // Override common ad event listeners
    window.addEventListener('beforeunload', function(e) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    });
  } catch (e) {
    // Ignore errors in popup blocking
  }
  
  // Block console trackers
  const originalConsoleLog = console.log;
  console.log = function() {
    // Filter out tracking-related logs but allow normal logs
    if (arguments.length > 0 && 
        typeof arguments[0] === 'string' && 
        (arguments[0].includes('tracking') || 
         arguments[0].includes('analytics') || 
         arguments[0].includes('pixel'))) {
      return;
    }
    return originalConsoleLog.apply(console, arguments);
  };
  
  // Return true to indicate the script ran successfully
  true;
})();
`; 