import React from 'react';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <h1>About Us</h1>

      <Section title="Who Made This?" content={<WhoMadeIt />} />
      <Section title="How to Use the Website" content={<HowToUse />} />
      <Section title="Need a Developer?" content={<HireMe />} />
    </div>
  );
};

const Section = ({ title, content }) => (
  <section className={`about-us-section ${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <h2>{title}</h2>
    {content}
  </section>
);

const WhoMadeIt = () => (
  <p>
    This website was developed by <strong>Seyfadin</strong> from AASTU, a passionate software developer skilled in both front-end and back-end technologies. I created this platform to offer an engaging and intuitive experience for browsing and posting Ideas, infos and products.
  </p>
);

const HowToUse = () => (
  <div>
    <p>Here’s how to get the most out of this website:</p>
    <ol>
      <li>Explore all posts in the <strong>All Posts</strong> section.</li>
      <li>Visit the <strong>Marketplace</strong> to browse products available for sale.</li>
      <li>Create your own post or product by clicking on the <strong>+ icon</strong>.</li>
      <li>Click on any product to view its details and description.</li>
      <li>Use pagination to explore more posts or products.</li>
    </ol>
  </div>
);

const HireMe = () => (
  <div>
    <p>
      Looking for a passionate developer to bring your next project to life? I specialize in full-stack development and would love to help.
    </p>
    <p>Feel free to reach out at: <strong>seyfadincompany@example.com</strong></p>
  </div>
);

export default AboutUsPage;
