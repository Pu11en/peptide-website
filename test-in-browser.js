/**
 * Browser Console Testing Script for Dual-Video Hero Section
 * Copy and paste this script into the browser console on the main page
 */

(function() {
    console.log('🎬 Starting Dual-Video Hero Section Tests...');
    
    const testResults = {
        desktopVideo: {},
        mobileVideo: {},
        responsiveBehavior: {},
        videoAttributes: {},
        consoleErrors: [],
        positioning: {},
        networkRequests: [],
        summary: {}
    };
    
    // Setup console monitoring
    const originalError = console.error;
    const originalWarn = console.warn;
    const capturedErrors = [];
    
    console.error = (...args) => {
        const errorText = args.join(' ');
        if (errorText.includes('video') || errorText.includes('Video') || 
            errorText.includes('media') || errorText.includes('play') ||
            errorText.includes('load') || errorText.includes('source')) {
            capturedErrors.push({
                timestamp: new Date().toISOString(),
                message: errorText,
                type: 'error'
            });
        }
        originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
        const warnText = args.join(' ');
        if (warnText.includes('video') || warnText.includes('Video') || 
            warnText.includes('media') || warnText.includes('play') ||
            warnText.includes('load') || warnText.includes('autoplay')) {
            capturedErrors.push({
                timestamp: new Date().toISOString(),
                message: warnText,
                type: 'warning'
            });
        }
        originalWarn.apply(console, args);
    };
    
    // Test 1: Check video elements exist
    function testVideoElements() {
        console.log('🔍 Testing video elements...');
        
        const desktopVideo = document.querySelector('video:not(.md\\:hidden)');
        const mobileVideo = document.querySelector('video.md\\:hidden');
        
        if (desktopVideo) {
            testResults.desktopVideo = analyzeVideoElement(desktopVideo, 'desktop');
        } else {
            testResults.desktopVideo = { found: false, error: 'Desktop video element not found' };
        }
        
        if (mobileVideo) {
            testResults.mobileVideo = analyzeVideoElement(mobileVideo, 'mobile');
        } else {
            testResults.mobileVideo = { found: false, error: 'Mobile video element not found' };
        }
        
        console.log('Desktop video:', testResults.desktopVideo.found ? '✅ Found' : '❌ Not found');
        console.log('Mobile video:', testResults.mobileVideo.found ? '✅ Found' : '❌ Not found');
    }
    
    function analyzeVideoElement(videoElement, type) {
        const analysis = {
            found: true,
            type: type,
            attributes: {},
            source: null,
            networkState: videoElement.networkState,
            readyState: videoElement.readyState,
            dimensions: {
                videoWidth: videoElement.videoWidth,
                videoHeight: videoElement.videoHeight,
                offsetWidth: videoElement.offsetWidth,
                offsetHeight: videoElement.offsetHeight
            },
            playback: {
                paused: videoElement.paused,
                ended: videoElement.ended,
                currentTime: videoElement.currentTime,
                duration: videoElement.duration,
                muted: videoElement.muted,
                volume: videoElement.volume
            }
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
        
        return analysis;
    }
    
    // Test 2: Check video attributes
    function testVideoAttributes() {
        console.log('⚙️ Testing video attributes...');
        
        const videos = document.querySelectorAll('video');
        const attributeTests = [];
        
        videos.forEach((video, index) => {
            const videoType = video.classList.contains('md:hidden') ? 'mobile' : 'desktop';
            const test = {
                videoIndex: index,
                type: videoType,
                attributes: {}
            };
            
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
        
        testResults.videoAttributes = {
            totalVideos: videos.length,
            tests: attributeTests,
            allTestsPassed: attributeTests.every(test => test.allRequiredPresent && test.preloadCorrect)
        };
        
        console.log('Video attributes test:', testResults.videoAttributes.allTestsPassed ? '✅ Passed' : '❌ Failed');
    }
    
    // Test 3: Check video positioning
    function testVideoPositioning() {
        console.log('📐 Testing video positioning...');
        
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
                }
            };
            
            test.positioning.coversViewport = test.dimensions.coversViewport;
            test.positioning.absolutePositioned = test.positioning.position === 'absolute';
            test.positioning.insetZero = test.positioning.top === '0px' && test.positioning.left === '0px';
            
            positioningTests.push(test);
        });
        
        testResults.positioning = {
            totalVideos: videos.length,
            tests: positioningTests,
            allTestsPassed: positioningTests.every(test => 
                test.positioning.coversViewport && 
                test.positioning.absolutePositioned && 
                test.positioning.insetZero
            )
        };
        
        console.log('Video positioning test:', testResults.positioning.allTestsPassed ? '✅ Passed' : '❌ Failed');
    }
    
    // Test 4: Check responsive behavior
    function testResponsiveBehavior() {
        console.log('📱 Testing responsive behavior...');
        
        const originalWidth = window.innerWidth;
        const testResults = {
            originalWidth: originalWidth,
            tests: []
        };
        
        // Check current state
        const desktopVideo = document.querySelector('video:not(.md\\:hidden)');
        const mobileVideo = document.querySelector('video.md\\:hidden');
        
        const desktopVisible = desktopVideo && 
                             desktopVideo.offsetParent !== null && 
                             window.getComputedStyle(desktopVideo).display !== 'none';
        
        const mobileVisible = mobileVideo && 
                             mobileVideo.offsetParent !== null && 
                             window.getComputedStyle(mobileVideo).display !== 'none';
        
        const currentViewport = window.innerWidth <= 767 ? 'mobile' : 'desktop';
        const expectedVideo = currentViewport === 'mobile' ? 'mobile' : 'desktop';
        const actualVideo = desktopVisible ? 'desktop' : (mobileVisible ? 'mobile' : 'none');
        
        const testResult = {
            viewportSize: { width: window.innerWidth, name: currentViewport },
            desktopVisible: desktopVisible,
            mobileVisible: mobileVisible,
            actualVideo: actualVideo,
            expectedVideo: expectedVideo,
            testPassed: actualVideo === expectedVideo,
            timestamp: new Date().toISOString()
        };
        
        testResults.tests.push(testResult);
        
        console.log(`Current viewport (${window.innerWidth}px):`, testResult.testPassed ? '✅ Correct video' : '❌ Wrong video');
        console.log(`Expected: ${expectedVideo}, Actual: ${actualVideo}`);
        
        return testResults;
    }
    
    // Test 5: Check network requests
    function testNetworkRequests() {
        console.log('🌐 Analyzing network requests...');
        
        // Check performance entries for video resources
        const videoEntries = performance.getEntriesByType('resource').filter(entry => 
            entry.name.includes('.mp4') || entry.name.includes('video')
        );
        
        const networkRequests = videoEntries.map(entry => ({
            url: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            timestamp: entry.startTime,
            success: true
        }));
        
        testResults.networkRequests = networkRequests;
        
        console.log(`Found ${networkRequests.length} video network requests`);
        networkRequests.forEach(req => {
            console.log(`- ${req.url.substring(0, 50)}... (${req.duration.toFixed(2)}ms)`);
        });
    }
    
    // Run all tests
    function runAllTests() {
        const startTime = performance.now();
        
        try {
            testVideoElements();
            testVideoAttributes();
            testVideoPositioning();
            testResults.responsiveBehavior = testResponsiveBehavior();
            testNetworkRequests();
            
            const endTime = performance.now();
            const totalTestTime = endTime - startTime;
            
            testResults.consoleErrors = capturedErrors;
            testResults.summary = {
                totalTestTime: totalTestTime,
                timestamp: new Date().toISOString(),
                overallStatus: calculateOverallStatus()
            };
            
            console.log('\n📊 TEST SUMMARY:');
            console.log('================');
            console.log(`Total test time: ${totalTestTime.toFixed(2)}ms`);
            console.log(`Overall status: ${testResults.summary.overallStatus}`);
            console.log(`Console errors: ${capturedErrors.length}`);
            
            if (capturedErrors.length > 0) {
                console.log('\n⚠️ Console Errors:');
                capturedErrors.forEach(error => {
                    console.log(`[${error.type.toUpperCase()}] ${error.message}`);
                });
            }
            
            console.log('\n📋 Detailed Results:');
            console.log('Desktop video:', testResults.desktopVideo.found ? '✅' : '❌');
            console.log('Mobile video:', testResults.mobileVideo.found ? '✅' : '❌');
            console.log('Video attributes:', testResults.videoAttributes.allTestsPassed ? '✅' : '❌');
            console.log('Video positioning:', testResults.positioning.allTestsPassed ? '✅' : '❌');
            console.log('Responsive behavior:', testResults.responsiveBehavior.tests[0].testPassed ? '✅' : '❌');
            
            console.log('\n🎉 Tests completed! Check testResults object for detailed data.');
            
            // Make results available globally
            window.dualVideoTestResults = testResults;
            
            return testResults;
            
        } catch (error) {
            console.error('❌ Test execution failed:', error);
            testResults.error = error.message;
            return testResults;
        }
    }
    
    function calculateOverallStatus() {
        const hasErrors = capturedErrors.length > 0;
        const desktopVideoOk = testResults.desktopVideo.found !== false;
        const mobileVideoOk = testResults.mobileVideo.found !== false;
        const responsiveOk = testResults.responsiveBehavior.tests?.every(test => test.testPassed) || false;
        const attributesOk = testResults.videoAttributes.allTestsPassed || false;
        const positioningOk = testResults.positioning.allTestsPassed || false;
        
        if (hasErrors || !desktopVideoOk || !mobileVideoOk) {
            return 'FAILED';
        } else if (!responsiveOk || !attributesOk || !positioningOk) {
            return 'WARNING';
        } else {
            return 'PASSED';
        }
    }
    
    // Auto-run tests
    console.log('🚀 Running dual-video hero section tests...');
    setTimeout(() => {
        runAllTests();
    }, 2000); // Wait 2 seconds for page to fully load
    
    // Make functions available globally
    window.testDualVideoHero = {
        runAllTests: runAllTests,
        testVideoElements: testVideoElements,
        testVideoAttributes: testVideoAttributes,
        testVideoPositioning: testVideoPositioning,
        testResponsiveBehavior: testResponsiveBehavior,
        testNetworkRequests: testNetworkRequests
    };
    
})();