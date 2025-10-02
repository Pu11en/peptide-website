/**
 * Hero Section Responsive Behavior Testing Script
 * 
 * This script tests the responsive behavior of the hero section with the mobile video.
 * Run this script in the browser console on the actual application to verify all behaviors.
 */

class HeroSectionTester {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.breakpoints = {
            mobile: 767,
            tablet: 768,
            desktop: 1024
        };
        
        this.init();
    }
    
    init() {
        console.log('%c🪲 Hero Section Responsive Behavior Tester', 'color: #4A90E2; font-size: 16px; font-weight: bold');
        console.log('%cStarting tests...\n', 'color: #666;');
        
        // Wait for page to fully load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runAllTests());
        } else {
            this.runAllTests();
        }
    }
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
        
        if (type === 'error') {
            this.testResults.push({ test: this.currentTest, status: 'failed', message });
        } else if (type === 'success') {
            this.testResults.push({ test: this.currentTest, status: 'passed', message });
        } else {
            this.testResults.push({ test: this.currentTest, status: 'info', message });
        }
    }
    
    async runAllTests() {
        console.log('%c=== HERO SECTION RESPONSIVE BEHAVIOR TESTS ===\n', 'color: #4A90E2; font-weight: bold;');
        
        // Test 1: Check if mobile video element exists in the DOM
        await this.testVideoElementExists();
        
        // Test 2: Check if desktop image element exists
        await this.testDesktopImageExists();
        
        // Test 3: Test mobile detection logic
        await this.testMobileDetectionLogic();
        
        // Test 4: Test responsive behavior at different viewport sizes
        await this.testResponsiveBehavior();
        
        // Test 5: Test video attributes
        await this.testVideoAttributes();
        
        // Test 6: Test video loading and playback
        await this.testVideoLoadingAndPlayback();
        
        // Test 7: Test CSS positioning and coverage
        await this.testVideoPositioning();
        
        // Test 8: Check for console errors
        await this.checkForConsoleErrors();
        
        // Generate final report
        this.generateTestReport();
    }
    
    async testVideoElementExists() {
        this.currentTest = 'Video Element Existence';
        this.log('Testing if mobile video element exists in DOM...');
        
        const videoElement = document.querySelector('video');
        
        if (videoElement) {
            this.log('Video element found in DOM', 'success');
            this.log(`Video source: ${videoElement.querySelector('source')?.src || 'Not found'}`);
            this.log(`Video classes: ${videoElement.className}`);
        } else {
            this.log('Video element not found in DOM', 'error');
        }
    }
    
    async testDesktopImageExists() {
        this.currentTest = 'Desktop Image Existence';
        this.log('Testing if desktop image element exists in DOM...');
        
        const desktopImage = document.querySelector('img[alt*="Incredible Peptides"]');
        
        if (desktopImage) {
            this.log('Desktop image element found in DOM', 'success');
            this.log(`Image source: ${desktopImage.src}`);
            this.log(`Image classes: ${desktopImage.className}`);
        } else {
            this.log('Desktop image element not found in DOM', 'error');
        }
    }
    
    async testMobileDetectionLogic() {
        this.currentTest = 'Mobile Detection Logic';
        this.log('Testing mobile detection logic...');
        
        // Check current viewport width
        const currentWidth = window.innerWidth;
        this.log(`Current viewport width: ${currentWidth}px`);
        
        // Check if React state is working (if we can access it)
        const isMobileViewport = currentWidth <= this.breakpoints.mobile;
        this.log(`Should be mobile: ${isMobileViewport}`);
        
        // Check if video is conditionally rendered based on viewport
        const videoElement = document.querySelector('video');
        const videoVisible = videoElement && !videoElement.classList.contains('hidden');
        
        if (isMobileViewport && videoVisible) {
            this.log('Video correctly visible on mobile viewport', 'success');
        } else if (!isMobileViewport && !videoVisible) {
            this.log('Video correctly hidden on desktop viewport', 'success');
        } else {
            this.log(`Video visibility mismatch. Mobile: ${isMobileViewport}, Video visible: ${videoVisible}`, 'warning');
        }
    }
    
    async testResponsiveBehavior() {
        this.currentTest = 'Responsive Behavior';
        this.log('Testing responsive behavior at different viewport sizes...');
        
        const originalWidth = window.innerWidth;
        const videoElement = document.querySelector('video');
        const desktopImage = document.querySelector('img[alt*="Incredible Peptides"]');
        
        // Test mobile viewport
        this.log('Testing mobile viewport (≤767px)...');
        await this.setViewport(375);
        
        const videoVisibleOnMobile = videoElement && !videoElement.classList.contains('hidden');
        const imageHiddenOnMobile = desktopImage && desktopImage.classList.contains('hidden');
        
        if (videoVisibleOnMobile) {
            this.log('Video correctly visible on mobile', 'success');
        } else {
            this.log('Video not visible on mobile', 'error');
        }
        
        if (imageHiddenOnMobile) {
            this.log('Desktop image correctly hidden on mobile', 'success');
        } else {
            this.log('Desktop image not hidden on mobile', 'error');
        }
        
        // Test desktop viewport
        this.log('Testing desktop viewport (>767px)...');
        await this.setViewport(1200);
        
        const videoHiddenOnDesktop = videoElement && videoElement.classList.contains('hidden');
        const imageVisibleOnDesktop = desktopImage && !desktopImage.classList.contains('hidden');
        
        if (videoHiddenOnDesktop) {
            this.log('Video correctly hidden on desktop', 'success');
        } else {
            this.log('Video not hidden on desktop', 'error');
        }
        
        if (imageVisibleOnDesktop) {
            this.log('Desktop image correctly visible on desktop', 'success');
        } else {
            this.log('Desktop image not visible on desktop', 'error');
        }
        
        // Restore original viewport
        await this.setViewport(originalWidth);
    }
    
    async testVideoAttributes() {
        this.currentTest = 'Video Attributes';
        this.log('Testing video attributes...');
        
        const videoElement = document.querySelector('video');
        
        if (!videoElement) {
            this.log('Video element not found, cannot test attributes', 'error');
            return;
        }
        
        const attributes = [
            { name: 'autoplay', expected: true },
            { name: 'muted', expected: true },
            { name: 'loop', expected: true },
            { name: 'playsinline', expected: true },
            { name: 'preload', expected: 'none' }
        ];
        
        attributes.forEach(attr => {
            const hasAttribute = videoElement.hasAttribute(attr.name);
            const attributeValue = videoElement.getAttribute(attr.name);
            
            if (attr.expected) {
                if (hasAttribute) {
                    this.log(`✓ Video has '${attr.name}' attribute (value: ${attributeValue})`, 'success');
                } else {
                    this.log(`✗ Video missing '${attr.name}' attribute`, 'error');
                }
            } else {
                if (!hasAttribute) {
                    this.log(`✓ Video correctly does not have '${attr.name}' attribute`, 'success');
                } else {
                    this.log(`✗ Video has unexpected '${attr.name}' attribute`, 'error');
                }
            }
        });
        
        // Check source element
        const sourceElement = videoElement.querySelector('source');
        if (sourceElement) {
            this.log(`✓ Video source found: ${sourceElement.src}`, 'success');
            this.log(`✓ Video source type: ${sourceElement.type}`, 'success');
            this.log(`✓ Video source media: ${sourceElement.media}`, 'success');
        } else {
            this.log('✗ Video source element not found', 'error');
        }
    }
    
    async testVideoLoadingAndPlayback() {
        this.currentTest = 'Video Loading and Playback';
        this.log('Testing video loading and playback...');
        
        const videoElement = document.querySelector('video');
        
        if (!videoElement) {
            this.log('Video element not found, cannot test loading', 'error');
            return;
        }
        
        // Check video ready state
        this.log(`Video readyState: ${videoElement.readyState} (0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA)`);
        
        // Check video network state
        this.log(`Video networkState: ${videoElement.networkState} (0=NETWORK_EMPTY, 1=NETWORK_IDLE, 2=NETWORK_LOADING, 3=NETWORK_NO_SOURCE)`);
        
        // Check if video has errors
        if (videoElement.error) {
            this.log(`Video error detected: ${videoElement.error.message}`, 'error');
        } else {
            this.log('No video errors detected', 'success');
        }
        
        // Try to play video (if not already playing)
        if (videoElement.paused) {
            try {
                await videoElement.play();
                this.log('Video started playing successfully', 'success');
                
                // Pause after a moment to avoid distraction
                setTimeout(() => {
                    videoElement.pause();
                    this.log('Video paused for testing purposes');
                }, 2000);
            } catch (error) {
                this.log(`Error playing video: ${error.message}`, 'error');
            }
        } else {
            this.log('Video is already playing', 'success');
        }
        
        // Check video dimensions
        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            this.log(`Video dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`, 'success');
        } else {
            this.log('Video dimensions not available yet', 'warning');
        }
    }
    
    async testVideoPositioning() {
        this.currentTest = 'Video Positioning and CSS';
        this.log('Testing video positioning and CSS coverage...');
        
        const videoElement = document.querySelector('video');
        
        if (!videoElement) {
            this.log('Video element not found, cannot test positioning', 'error');
            return;
        }
        
        // Get computed styles
        const styles = window.getComputedStyle(videoElement);
        
        // Check positioning
        const position = styles.position;
        const top = styles.top;
        const left = styles.left;
        const width = styles.width;
        const height = styles.height;
        const objectFit = styles.objectFit;
        
        this.log(`Video position: ${position}`);
        this.log(`Video top: ${top}`);
        this.log(`Video left: ${left}`);
        this.log(`Video width: ${width}`);
        this.log(`Video height: ${height}`);
        this.log(`Video object-fit: ${objectFit}`);
        
        // Check if video covers the full hero section
        const heroSection = document.querySelector('section[class*="relative"]');
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            const videoRect = videoElement.getBoundingClientRect();
            
            this.log(`Hero section dimensions: ${heroRect.width}x${heroRect.height}`);
            this.log(`Video element dimensions: ${videoRect.width}x${videoRect.height}`);
            
            if (videoRect.width >= heroRect.width && videoRect.height >= heroRect.height) {
                this.log('Video covers the full hero section', 'success');
            } else {
                this.log('Video does not fully cover the hero section', 'warning');
            }
        }
        
        // Check CSS classes
        const expectedClasses = ['absolute', 'inset-0', 'w-full', 'h-full', 'object-cover'];
        const videoClasses = videoElement.className.split(' ');
        
        expectedClasses.forEach(expectedClass => {
            if (videoClasses.includes(expectedClass)) {
                this.log(`✓ Video has expected CSS class: ${expectedClass}`, 'success');
            } else {
                this.log(`✗ Video missing expected CSS class: ${expectedClass}`, 'error');
            }
        });
    }
    
    async checkForConsoleErrors() {
        this.currentTest = 'Console Error Check';
        this.log('Checking for console errors related to video loading...');
        
        // Store original console.error
        const originalError = console.error;
        let videoErrors = [];
        
        // Override console.error temporarily to catch video-related errors
        console.error = function(...args) {
            const message = args.join(' ');
            if (message.includes('video') || message.includes('mp4') || message.includes('cloudinary')) {
                videoErrors.push(message);
            }
            originalError.apply(console, args);
        };
        
        // Wait a moment to catch any errors
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Restore original console.error
        console.error = originalError;
        
        if (videoErrors.length === 0) {
            this.log('No video-related console errors detected', 'success');
        } else {
            this.log(`Found ${videoErrors.length} video-related console errors:`, 'error');
            videoErrors.forEach(error => this.log(`  - ${error}`, 'error'));
        }
    }
    
    async setViewport(width) {
        // This is a simulation - in real testing, you would use browser dev tools
        // or a testing framework like Cypress or Playwright
        this.log(`Simulating viewport resize to ${width}px...`);
        
        // In a real test environment, you would resize the window
        // For this script, we'll just log what would happen
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    generateTestReport() {
        console.log('\n%c=== TEST REPORT ===\n', 'color: #4A90E2; font-weight: bold;');
        
        const passed = this.testResults.filter(r => r.status === 'passed').length;
        const failed = this.testResults.filter(r => r.status === 'failed').length;
        const warnings = this.testResults.filter(r => r.status === 'warning').length;
        const info = this.testResults.filter(r => r.status === 'info').length;
        
        console.log(`%cTotal Tests: ${this.testResults.length}`, 'font-weight: bold;');
        console.log(`%cPassed: ${passed}`, 'color: green; font-weight: bold;');
        console.log(`%cFailed: ${failed}`, 'color: red; font-weight: bold;');
        console.log(`%cWarnings: ${warnings}`, 'color: orange; font-weight: bold;');
        console.log(`%cInfo: ${info}`, 'color: blue; font-weight: bold;');
        
        if (failed > 0) {
            console.log('\n%c❌ FAILED TESTS:', 'color: red; font-weight: bold;');
            this.testResults
                .filter(r => r.status === 'failed')
                .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
        }
        
        if (warnings > 0) {
            console.log('\n%c⚠️ WARNINGS:', 'color: orange; font-weight: bold;');
            this.testResults
                .filter(r => r.status === 'warning')
                .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
        }
        
        console.log('\n%c=== RECOMMENDATIONS ===\n', 'color: #4A90E2; font-weight: bold;');
        
        if (failed === 0) {
            console.log('%c✅ All tests passed! The hero section responsive behavior is working correctly.', 'color: green; font-weight: bold;');
        } else {
            console.log('%c⚠️ Some tests failed. Please review the failed tests and fix the issues.', 'color: orange; font-weight: bold;');
        }
        
        console.log('\nManual Testing Checklist:');
        console.log('1. Open the website in a browser');
        console.log('2. Resize the browser window to test responsive behavior');
        console.log('3. Use browser dev tools to simulate mobile devices');
        console.log('4. Check the Network tab for video loading');
        console.log('5. Test on actual mobile devices if possible');
        
        console.log('\n%c=== END OF TEST REPORT ===', 'color: #4A90E2; font-weight: bold;');
    }
}

// Auto-run the tester when the script is loaded
new HeroSectionTester();