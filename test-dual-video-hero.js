document.addEventListener('DOMContentLoaded', () => {
  const videoContainer = document.getElementById('dual-video-hero');
  
  if (!videoContainer) {
    console.error('Dual video hero container not found');
    return;
  }

  // Create video elements
  const video1 = document.createElement('video');
  const video2 = document.createElement('video');
  
  // Set common attributes
  [video1, video2].forEach(video => {
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.opacity = '0'; // Start with opacity 0
  });

  // Set specific video sources with fallbacks
  const videoSources = [
    {
      id: 'vp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Replace with actual video ID
      element: video1
    },
    {
      id: 'vp-yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', // Replace with actual video ID
      element: video2
    }
  ];

  videoSources.forEach(({ id, element }) => {
    // Try multiple video formats
    const sources = [
      `https://cdn.shopify.com/videos/c/vp/${id}/mp4/${id}.mp4`,
      `https://cdn.shopify.com/videos/c/vp/${id}/webm/${id}.webm`,
      `https://cdn.shopify.com/videos/c/vp/${id}/mov/${id}.mov`
    ];
    
    // Try each source until one works
    sources.forEach(src => {
      const source = document.createElement('source');
      source.src = src;
      source.type = src.includes('.mp4') ? 'video/mp4' : 
                   src.includes('.webm') ? 'video/webm' : 'video/quicktime';
      element.appendChild(source);
    });
    
    // Add error handling
    element.addEventListener('error', (e) => {
      console.error(`Failed to load video ${id}:`, e);
      // You could fall back to an image or placeholder here
    });
  });

  // Add videos to container
  videoContainer.appendChild(video1);
  videoContainer.appendChild(video2);

  // Function to switch videos periodically
  function switchVideos() {
    const videos = [video1, video2];
    let currentIndex = 0;
    
    // Set initial video to visible
    videos[currentIndex].style.opacity = '1';
    
    setInterval(() => {
      videos[currentIndex].style.opacity = '0';
      currentIndex = (currentIndex + 1) % videos.length;
      videos[currentIndex].style.opacity = '1';
    }, 5000); // Switch every 5 seconds
  }

  // Start switching
  switchVideos();
});