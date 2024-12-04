import React from 'react';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <h1>About Us</h1>

      <Section title="Who Made This?" content={<WhoMadeIt />} />
      <Section title="Technologies Used" content={<TechnologiesUsed />} />
      <Section title="How to Use the Website" content={<HowToUse />} />
      <Section title="Need a Developer?" content={<HireMe />} />
      <Section title="Want to Explore My Portfolios?" content={<Portfolios />} />
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
    This website was developed by <strong>Seyfadin</strong>, a passionate software developer skilled in both front-end and back-end technologies. I , Seyfadin aimed to create this movie browsing app to provide users with an enjoyable movie search experience.
  </p>
);

const TechnologiesUsed = () => (
  <div>
    <p>
      The website is built using modern web development tools and frameworks. Here are the main technologies used:
    </p>
    <ul>
      <li><strong>React.js</strong>: A powerful JavaScript library for building user interfaces, enabling efficient rendering and a seamless user experience.</li>
      <li><strong>Firebase</strong>: Used for backend services.</li>
      <li><strong>CSS</strong>: For styling components and pages to create a clean, responsive design that adapts to different screen sizes.</li>
      <li><strong>React Router</strong>: Facilitates smooth navigation between the homepage and detailed movie pages.</li>
    </ul>
  </div>
);

const HowToUse = () => (
  <div>
    <p>The website is designed for posting blogs. To use it:</p>
    <ol>
      <li>Navigate to the homepage to see all posts.</li>
      <li>The Marketplace page displays only products.</li>
      <li>You can create YOUR OWN POST  by clicking on + icon</li>
      <li>we don't have a hosting , so you have to upload  your image and get the link</li>
      <li>Click on a product to view details and a short description.</li>
      <li>Use pagination controls to browse through pages of movies.</li>
    </ol>
  </div>
);

const HireMe = () => (
  <div>
    <p>
      If you’re looking for a passionate developer to bring your next project to life, feel free to reach out. I specialize in full-stack development.
    </p>
    <p>Contact me at: <strong>seyfadincompany@example.com</strong></p>
  </div>
);

const Portfolios = () => (
  <div>
    <p>Explore my portfolios:</p>
    <ul>
      {[
        { name: "Z-Crypto", url: "https://z-crypto.vercel.app/" },
        { name: "Portfolio 1", url: "https://webseyf.github.io/portfolio1/" },
        { name: "Tafach Projects", url: "https://tafach-seyfadin-abdelas-projects.vercel.app/" },
        { name: "TechNova", url: "https://webseyf.github.io/TechNova/" },
        { name: "Seyf Portfolio", url: "https://seyfportfolio.vercel.app/" },
        { name: "Weather App", url: "https://seyf-weather.vercel.app/" },
        { name: "AASTU Software", url: "http://aastu.software/" },
        { name: "GreatStack", url: "https://greatstack.in/" },
        { name: "Scientific Calculator", url: "https://webseyf.github.io/scienfic-calculator/" },
        { name: "Bootstrap Web", url: "https://webseyf.github.io/bootstrap-web/" },
        { name: "Vist Ethio", url: "https://vist-ethio.vercel.app/" },
      ].map(({ name, url }) => (
        <li key={name}>
          <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
        </li>
      ))}
    </ul>
    <p>Contact me at: <strong>seyfadincompany@example.com</strong></p>
  </div>
);

export default AboutUsPage;