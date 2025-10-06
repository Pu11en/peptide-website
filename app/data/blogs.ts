export type Blog = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  url: string;
  content?: string;
};

export const blogs: Blog[] = [
  {
    id: 'blog-1',
    title: 'The Benefits of Peptide Therapy',
    description: 'Peptide therapy is a cutting-edge approach to health and wellness that utilizes specific amino acid sequences to target various bodily functions.',
    content: '<p>Peptide therapy is a cutting-edge approach to health and wellness that utilizes specific amino acid sequences to target various bodily functions. These small proteins can help with everything from weight management to muscle growth, skin health, and cognitive function.</p><p>Research has shown that peptides can be particularly effective for:</p><ul><li>Accelerating healing and recovery</li><li>Reducing inflammation</li><li>Boosting immune function</li><li>Enhancing hormone production</li><li>Improving sleep quality</li></ul><p>As we age, our natural peptide production decreases, which is why supplementation can be beneficial for maintaining optimal health and performance.</p>',
    image: '/images/d429586b-bf0a-484a-ae5f-bb8722228b61.png',
    date: '2024-07-24',
    url: '/blogs/blog-1'
  },
  {
    id: 'blog-2',
    title: 'Coming Soon',
    description: 'Our second blog post is coming soon. Stay tuned for the latest research and educational content on peptides.',
    image: '/images/Untitled design (44).png',
    date: '2023-12-01',
    url: '#'
  },
  {
    id: 'blog-3',
    title: 'Coming Soon',
    description: 'Our third blog post is coming soon. Stay tuned for the latest research and educational content on peptides.',
    image: '/images/b69578d1-7d80-4aaa-a24c-6eaf81ee3c5d.png',
    date: '2023-12-01',
    url: '#'
  }
];