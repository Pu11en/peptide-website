/**
 * Comprehensive Dual-Video Hero Section Testing Script
 * Tests desktop and mobile video loading, playback, and responsive behavior
 */

class DualVideoHeroTester {
  constructor() {
    this.testResults = {
      desktopVideo: {},
      mobileVideo: {},
      responsiveBehavior: {},
      videoAttributes: {},
      consoleErrors: [],
      positioning: {},
      networkRequests: []
    };
    
    this.desktopVideoUrl = "https://res.cloudinary.com/dmdjagtkx/video/upload/v1759408577/4fdd1c67-f89a-4766-964a-7ee2101630be_vfur0q.mp4";
    this.mobileVideoUrl = "https://res.cloudinary.com/dmdjagtkx/video/upload/v1758689443/social_defipullen_httpss.mj.run4owL1ng-Xks_website_lighting_hero_--a_5d363600-c6ef-4ebc-bd63-71ebde3c4da7_2_ptz2ph.mp4";
    
    this.setupConsoleMonitoring();
    this.setupNetworkMonitoring();
  }

  setupConsoleMonitoring() {
    // Override console.error to capture video-related errors
    const originalError = console.error;
    console.error = (...args) => {
      const errorText = args.join(' ');
      if (errorText.includes('video') || errorText.includes('Video') || 
          errorText.includes('media') || errorText.includes('play') ||
          errorText.includes('load') || errorText.includes('source')) {
        this.testResults.consoleErrors.push({
          timestamp: new Date().toISOString(),
          message: errorText,
          type: 'error'
        });
      }
      originalError.apply(console, args);
    };

    // Override console.warn to capture video-related warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const warnText = args.join(' ');
      if (warnText.includes('video') || warnText.includes('Video') || 
          warnText.includes('media') || warnText.includes('play') ||
          warnText.includes('load') || warnText.includes('autoplay')) {
        this.testResults.consoleErrors.push({
          timestamp: new Date().toISOString(),
          message: warnText,
          type: 'warning'
        });
      }
      originalWarn.apply(console, args);
    };
  }

  setupNetworkMonitoring() {
    // Monitor network requests for video loading
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      if (typeof url === 'string' && (url.includes('.mp4') || url.includes('video'))) {
        const startTime = performance.now();
        try {
          const response = await originalFetch.apply(window, args);
          const endTime = performance.now();
          this.testResults.networkRequests.push({
            url: url,
            status: response.status,
            loadTime: endTime - startTime,
            timestamp: new Date().toISOString(),
            success: response.ok
          });
          return response;
        } catch (error) {
          const endTime = performance.now();
          this.testResults.networkRequests.push({
            url: url,
            status: 'error',
            loadTime: endTime - startTime,
            timestamp: new Date().toISOString(),
            success: false,
            error: error.message
          });
          throw error;
        }
      }
      return originalFetch.apply(window, args);
    };
  }

  async testVideoElements() {
    console.log('🧪 Testing video elements...');
    
    // Test desktop video
    const desktopVideo = document.querySelector('video:not(.md\\:hidden)');
    if (desktopVideo) {
      this.testResults.desktopVideo = await this.analyzeVideoElement(desktopVideo, 'desktop');
    } else {
      this.testResults.desktopVideo = {
        found: false,
        error: 'Desktop video element not found'
      };
    }

    // Test mobile video
    const mobileVideo = document.querySelector('video.md\\:hidden');
    if (mobileVideo) {
      this.testResults.mobileVideo = await this.analyzeVideoElement(mobileVideo, 'mobile');
    } else {
      this.testResults.mobileVideo = {
        found: false,
        error: 'Mobile video element not found'
      };
    }
  }

  async analyzeVideoElement(videoElement, type) {
    const analysis = {
      found: true,
      type: type,
      element: videoElement,
      attributes: {},
      source: null,
      networkState: null,
      readyState: null,
      dimensions: {},
      playback: {},
      events: []
    };

    // Check attributes
    const expectedAttributes = ['autoplay', 'muted', 'loop', 'playsinline', 'preload'];
    expectedAttributes.forEach(attr => {
      analysis.attributes[attr] = videoElement.hasAttribute(attr);
      if (attr === 'preload') {
        analysis.attributes[attr + 'Value'] = videoElement.getAttribute(attr);
      }
    });

    // Check source
    const sourceElement = videoElement.querySelector('source');
    if (sourceElement) {
      analysis.source = {
        src: sourceElement.getAttribute('src'),
        type: sourceElement.getAttribute('type'),
        media: sourceElement.getAttribute('media')
      };
    }

    // Check network and ready states
    analysis.networkState = videoElement.networkState;
    analysis.readyState = videoElement.readyState;

    // Get video dimensions
    analysis.dimensions = {
      videoWidth: videoElement.videoWidth,
      videoHeight: videoElement.videoHeight,
      offsetWidth: videoElement.offsetWidth,
      offsetHeight: videoElement.offsetHeight,
      clientWidth: videoElement.clientWidth,
      clientHeight: videoElement.clientHeight
    };

    // Test playback capabilities
    try {
      analysis.playback.canPlay = typeof videoElement.play === 'function';
      analysis.playback.paused = videoElement.paused;
      analysis.playback.ended = videoElement.ended;
      analysis.playback.currentTime = videoElement.currentTime;
      analysis.playback.duration = videoElement.duration;
      analysis.playback.muted = videoElement.muted;
      analysis.playback.volume = videoElement.volume;
    } catch (error) {
      analysis.playback.error = error.message;
    }

    // Set up event listeners for testing
    const events = ['loadstart', 'loadeddata', 'canplay', 'play', 'pause', 'error'];
    events.forEach(eventType => {
      const handler = (event) => {
        analysis.events.push({
          type: eventType,
          timestamp: new Date().toISOString()
        });
      };
      videoElement.addEventListener(eventType, handler);
      
      // Remove event listeners after 5 seconds to avoid memory leaks
      setTimeout(() => {
        videoElement.removeEventListener(eventType, handler);
      }, 5000);
    });

    return analysis;
  }

  async testResponsiveBehavior() {
    console.log('📱 Testing responsive behavior...');
    
    const originalWidth = window.innerWidth;
    const testResults = {
      originalWidth: originalWidth,
      tests: []
    };

    // Test different viewport sizes
    const viewportSizes = [
      { width: 480, name: 'mobile', expectedVideo: 'mobile' },
      { width: 768, name: 'tablet', expectedVideo: 'desktop' },
      { width: 1024, name: 'desktop', expectedVideo: 'desktop' },
      { width: 1200, name: 'large-desktop', expectedVideo: 'desktop' }
    ];

    for (const size of viewportSizes) {
      const testResult = await this.testViewportSize(size);
      testResults.tests.push(testResult);
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Restore original width
    window.resizeTo(originalWidth, window.innerHeight);
    await new Promise(resolve => setTimeout(resolve, 500));

    this.testResults.responsiveBehavior = testResults;
  }

  async testViewportSize(size) {
    // Resize window
    window.resizeTo(size.width, window.innerHeight);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Check which video is visible
    const desktopVideo = document.querySelector('video:not(.md\\:hidden)');
    const mobileVideo = document.querySelector('video.md\\:hidden');

    const desktopVisible = desktopVideo && 
                         desktopVideo.offsetParent !== null && 
                         window.getComputedStyle(desktopVideo).display !== 'none';
    
    const mobileVisible = mobileVideo && 
                         mobileVideo.offsetParent !== null && 
                         window.getComputedStyle(mobileVideo).display !== 'none';

    const actualVideo = desktopVisible ? 'desktop' : (mobileVisible ? 'mobile' : 'none');
    const testPassed = actualVideo === size.expectedVideo;

    return {
      viewportSize: size,
      desktopVisible: desktopVisible,
      mobileVisible: mobileVisible,
      actualVideo: actualVideo,
      expectedVideo: size.expectedVideo,
      testPassed: testPassed,
      timestamp: new Date().toISOString()
    };
  }

  testVideoAttributes() {
    console.log('🔍 Testing video attributes...');
    
    const videos = document.querySelectorAll('video');
    const attributeTests = [];

    videos.forEach((video, index) => {
      const videoType = video.classList.contains('md:hidden') ? 'mobile' : 'desktop';
      const test = {
        videoIndex: index,
        type: videoType,
        attributes: {}
      };

      // Test required attributes
      const requiredAttributes = {
        autoplay: { required: true, present: video.hasAttribute('autoplay') },
        muted: { required: true, present: video.hasAttribute('muted') },
        loop: { required: true, present: video.hasAttribute('loop') },
        playsinline: { required: true, present: video.hasAttribute('playsinline') },
        preload: { required: true, present: video.hasAttribute('preload'), value: video.getAttribute('preload') }
      };

      test.attributes = requiredAttributes;
      test.allRequiredPresent = Object.values(requiredAttributes).every(attr => attr.present);
      test.preloadCorrect = requiredAttributes.preload.value === 'none';

      attributeTests.push(test);
    });

    this.testResults.videoAttributes = {
      totalVideos: videos.length,
      tests: attributeTests,
      allTestsPassed: attributeTests.every(test => test.allRequiredPresent && test.preloadCorrect)
    };
  }

  testVideoPositioning() {
    console.log('📐 Testing video positioning and coverage...');
    
    const videos = document.querySelectorAll('video');
    const positioningTests = [];

    videos.forEach((video, index) => {
      const videoType = video.classList.contains('md:hidden') ? 'mobile' : 'desktop';
      const styles = window.getComputedStyle(video);
      const rect = video.getBoundingClientRect();
      
      const test = {
        videoIndex: index,
        type: videoType,
        positioning: {
          position: styles.position,
          top: styles.top,
          left: styles.left,
          width: styles.width,
          height: styles.height,
          objectFit: styles.objectFit,
          zIndex: styles.zIndex
        },
        dimensions: {
          rectWidth: rect.width,
          rectHeight: rect.height,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          coversViewport: rect.width >= window.innerWidth && rect.height >= window.innerHeight
        },
        classes: video.className
      };

      // Check if video covers the full viewport
      test.positioning.coversViewport = test.dimensions.coversViewport;
      test.positioning.absolutePositioned = test.positioning.position === 'absolute';
      test.positioning.insetZero = test.positioning.top === '0px' && test.positioning.left === '0px';

      positioningTests.push(test);
    });

    this.testResults.positioning = {
      totalVideos: videos.length,
      tests: positioningTests,
      allTestsPassed: positioningTests.every(test => 
        test.positioning.coversViewport && 
        test.positioning.absolutePositioned && 
        test.positioning.insetZero
      )
    };
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive dual-video hero section tests...');
    
    const startTime = performance.now();
    
    try {
      // Wait for page to fully load
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve);
        });
      }

      // Wait additional time for videos to potentially load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Run all tests
      await this.testVideoElements();
      await this.testResponsiveBehavior();
      this.testVideoAttributes();
      this.testVideoPositioning();

      const endTime = performance.now();
      const totalTestTime = endTime - startTime;

      this.testResults.summary = {
        totalTestTime: totalTestTime,
        timestamp: new Date().toISOString(),
        overallStatus: this.calculateOverallStatus()
      };

      console.log('✅ All tests completed!');
      return this.testResults;

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      this.testResults.error = error.message;
      return this.testResults;
    }
  }

  calculateOverallStatus() {
    const hasErrors = this.testResults.consoleErrors.length > 0;
    const desktopVideoOk = this.testResults.desktopVideo.found !== false;
    const mobileVideoOk = this.testResults.mobileVideo.found !== false;
    const responsiveOk = this.testResults.responsiveBehavior.tests?.every(test => test.testPassed) || false;
    const attributesOk = this.testResults.videoAttributes.allTestsPassed || false;
    const positioningOk = this.testResults.positioning.allTestsPassed || false;

    if (hasErrors || !desktopVideoOk || !mobileVideoOk) {
      return 'FAILED';
    } else if (!responsiveOk || !attributesOk || !positioningOk) {
      return 'WARNING';
    } else {
      return 'PASSED';
    }
  }

  generateReport() {
    const report = {
      title: 'Dual-Video Hero Section Testing Report',
      timestamp: new Date().toISOString(),
      summary: this.testResults.summary,
      results: this.testResults,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    // Check for console errors
    if (this.testResults.consoleErrors.length > 0) {
      recommendations.push({
        type: 'error',
        message: `Found ${this.testResults.consoleErrors.length} console errors/warnings related to video loading`,
        details: this.testResults.consoleErrors
      });
    }

    // Check desktop video
    if (!this.testResults.desktopVideo.found) {
      recommendations.push({
        type: 'error',
        message: 'Desktop video element not found in DOM'
      });
    }

    // Check mobile video
    if (!this.testResults.mobileVideo.found) {
      recommendations.push({
        type: 'error',
        message: 'Mobile video element not found in DOM'
      });
    }

    // Check responsive behavior
    const responsiveTests = this.testResults.responsiveBehavior.tests;
    if (responsiveTests) {
      const failedTests = responsiveTests.filter(test => !test.testPassed);
      if (failedTests.length > 0) {
        recommendations.push({
          type: 'warning',
          message: `${failedTests.length} responsive behavior tests failed`,
          details: failedTests
        });
      }
    }

    // Check video attributes
    if (!this.testResults.videoAttributes.allTestsPassed) {
      recommendations.push({
        type: 'warning',
        message: 'Some video attributes are missing or incorrect',
        details: this.testResults.videoAttributes.tests.filter(test => !test.allRequiredPresent || !test.preloadCorrect)
      });
    }

    // Check positioning
    if (!this.testResults.positioning.allTestsPassed) {
      recommendations.push({
        type: 'warning',
        message: 'Video positioning issues detected',
        details: this.testResults.positioning.tests.filter(test => 
          !test.positioning.coversViewport || 
          !test.positioning.absolutePositioned || 
          !test.positioning.insetZero
        )
      });
    }

    // Check network requests
    const failedRequests = this.testResults.networkRequests.filter(req => !req.success);
    if (failedRequests.length > 0) {
      recommendations.push({
        type: 'error',
        message: `${failedRequests.length} video network requests failed`,
        details: failedRequests
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: 'All tests passed successfully! The dual-video hero section is working correctly.'
      });
    }

    return recommendations;
  }
}

// Auto-run tests when script is loaded
(async function() {
  console.log('🎬 Dual-Video Hero Section Tester Loaded');
  console.log('Run: window.dualVideoTester.runAllTests() to start testing');
  
  // Create global instance
  window.dualVideoTester = new DualVideoHeroTester();
  
  // Optionally auto-run after page load
  if (document.readyState === 'complete') {
    console.log('Page already loaded, tests ready to run');
  } else {
    window.addEventListener('load', () => {
      console.log('Page loaded, tests ready to run');
    });
  }
})();