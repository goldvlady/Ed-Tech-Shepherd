import Dashboard from '../assets/dashboard.svg';
import Docchat from '../assets/docchat.svg';
import Flashcards from '../assets/flashcards.svg';
import Gpt from '../assets/gpt.svg';
import Homework from '../assets/homework.svg';
import Marketplace from '../assets/marketplace.svg';
import Quiz from '../assets/quiz.svg';
import Sparkles from '../assets/sparkles.svg';
import Sparks from '../assets/sparks.svg';
import Study from '../assets/study.svg';
import Arrow from '../assets/card-arrow.svg';
import Pricing from '../assets/pricing.svg';
import Logo from '../components/Logo';
import { Button, Link, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

function Landing() {
  //   const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="landing-gradient">
        <div className="landing-header">
          <div className="logo-wrapper">
            <Logo customWidth="width: 124px" customHeight="height: 51px" />
          </div>
          <div className="header-cta">
            <Link className="header-link">Sign in</Link>
            <Button className="header-btn">Get Started</Button>
          </div>
        </div>
        <div className="landing-title-wrapper">
          <Text className="landing-title-sub" style={{color: '#207df7'}}>LEARN BETTER</Text>
          <Text className="landing-title">
            Your all in one AI{' '}
            <img className="landing-title-img" src={Sparkles} /> powered
            learning assistant
          </Text>
          <Text className="landing-desc">
            Shepherd provides an integrated experience to improve your learning
            outcomes. It understands you, your learning journey and connects you
            to everything you need to learn better.
          </Text>
          <Button className="landing-title-btn">Get to Know Shepherd</Button>
        </div>
        <img className="landing-img" src={Dashboard} />
      </div>

      <div className="post-gradient">
        <div className="landing-section-info">
          <img className="landing-icon" src={Sparks} />
          <Text className="landing-title-sub" style={{color: '#207df7'}}>PERSONAL AI ASSISTANT</Text>
          <Text className="landing-info">
            Unlock a vast array of AI-enabled learning tools and resources with
            Shepherd
          </Text>
          <Text className="landing-desc">
            Shepherd is optimized for learning. It is trained on some of the
            most up-to-date subject texts to minimize errors.
          </Text>
        </div>
        <div className="landing-section">
          <img className="landing-hw-img" src={Homework} />
          <div className="landing-section-img">
            <img className="landing-flash-img" src={Flashcards} />
            <img className="landing-study-img" src={Study} />
          </div>
          <div className="landing-section-img">
            <img className="landing-doc-img" src={Docchat} />
            <img className="landing-quiz-img" src={Quiz} />
          </div>
        </div>
        <div className="landing-section-info">
          <img className="landing-icon" src={Marketplace} />
          <Text className="landing-title-sub" style={{ color: '#BB38FA' }}>
            A MODERN TUTOR MARKET PLACE
          </Text>
          <Text className="landing-info">Still Stuck? Don't worry!</Text>
          <Text className="landing-desc" style={{ width: '714px' }}>
            Shepherd understands one on one tutors are the biggest drivers for
            improving learning outcomes. Shepherd connects you with the right
            affordable tutor for you!
          </Text>
        </div>
        <div className="landing-section-desc">
          <div className="landing-desc-info">
            <Text className="landing-info-mini">
              Shepherd detects your struggle
            </Text>
            <Text className="landing-desc-mini">
              Shepherd observes your learning journey and identifies the areas
              where you need help the most.
            </Text>
            <Button className="landing-btn">Find a Tutor</Button>
            <Text className="landing-info-mini" style={{ color: '#969CA6' }}>
              Shepherd recommends a tutor
            </Text>
            <Text className="landing-info-mini" style={{ color: '#969CA6' }}>
              Interactive learning
            </Text>
          </div>
          <img className="landing-gpt-img" src={Gpt} />
        </div>
        <div className="landing-section-metric">
          <div className="landing-metric-mini">
            <Text className="landing-info-mini">Join Shepherd</Text>
            <Text className="landing-desc-mini">
              With Shepherd, no one is left out, by leveraging our array of
              AI-powered tools everyone can tap into the transformative power of
              technology, unlocking their full potential.
            </Text>
          </div>
          <div className="landing-cta-wrapper">
            <div className="landing-cta-card"> 
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">1M+</Text>
                <Text className="landing-metric-tag">LEARNERS</Text>
              </div>
              <Link className="landing-title-sub" style={{ display:'flex', fontSize:'15px', fontWeight:'500', color: '#207df7' }}>
                Join our waitlist <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
            <div className="landing-cta-card"> 
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">100+</Text>
                <Text className="landing-metric-tag">TUTORS</Text>
              </div>
              <Link className="landing-title-sub" style={{ display:'flex', fontSize:'15px', fontWeight:'500', color: '#207df7' }}>
                Become a tutor <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
            <div className="landing-cta-card"> 
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">50+</Text>
                <Text className="landing-metric-tag">SCHOOLS</Text>
              </div>
              <Link className="landing-title-sub" style={{ display:'flex', fontSize:'15px', fontWeight:'500', color: '#207df7' }}>
                Bring Shepherd to your school <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
          </div>
        </div>
        <div className="landing-section-info">
          <Text className="landing-title-sub-bubble">
            COMING SOON
          </Text>
          <Text className="landing-title-sub" style={{ color: '#FB8441', fontSize:'15px'}}>
            LEARN TOGETHER
          </Text>
          <Text className="landing-info">Collaborate with other learners</Text>
        </div>
      </div>
    </div>
  );
}

export default Landing;
