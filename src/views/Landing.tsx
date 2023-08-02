import BackArrow from '../assets/backArrow.svg';
import Star from '../assets/banner-star.svg';
import Arrow from '../assets/card-arrow.svg';
import Check from '../assets/checkIcon.svg';
import Collab from '../assets/collab.svg';
import Dashboard from '../assets/dashboard.svg';
import DashboardSmall from '../assets/dashboardSmall.svg';
import Docchat from '../assets/docchat.svg';
import DocchatSmall from '../assets/docchatSmall.svg';
import Dot from '../assets/dot.svg';
import FAQ from '../assets/faq.svg';
import Flash from '../assets/flashIcon.svg';
import FlashcardHover from '../assets/flashcardHover.svg';
import FlashcardSmall from '../assets/flashcardSmall.svg';
import Flashcards from '../assets/flashcards.svg';
import FrontArrow from '../assets/frontArrow.svg';
import Gpt from '../assets/gpt.svg';
import GptHovered from '../assets/gptHovered.svg';
import Heart from '../assets/heart.svg';
import Homework from '../assets/homework.svg';
import HomeworkSmall from '../assets/homeworkSmall.svg';
import Insta from '../assets/insta-icon.svg';
import Learn from '../assets/learning.svg';
import Linkedin from '../assets/linkedin-icon.svg';
import Mail from '../assets/mail-icon.svg';
import Marketplace from '../assets/marketplace.svg';
import Spark from '../assets/miniSparks.svg';
import Pricing from '../assets/pricing.svg';
import Question from '../assets/question.svg';
import Quiz from '../assets/quiz.svg';
import QuizSmall from '../assets/quizSmall.svg';
import Share from '../assets/share.svg';
import Sparkles from '../assets/sparkles.svg';
import Sparks from '../assets/sparks.svg';
import Study from '../assets/study.svg';
import StudyHover from '../assets/studyHovered.svg';
import StudySmall from '../assets/studySmall.svg';
import TutorCard from '../assets/tutorCard.svg';
import Twitter from '../assets/twitter-icon.svg';
import Logo from '../components/Logo';
import faqData from '../mocks/faqs.json';
import priceData from '../mocks/pricing.json';
import {
  Button,
  Box,
  Link,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Collapse,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('AI');
  const [openedAccordion, setOpenedAccordion] = useState<string>('accordion1');
  const [hoveredAccordion, setHoveredAccordion] = useState<string>('');
  const [hoveredFlashcard, setHoveredFlashcard] = useState(false);
  const [hoveredStudy, setHoveredStudy] = useState(false);
  // const accordionOrder = ['accordion1', 'accordion2', 'accordion3'];
  const handleAccordionToggle = (accordionName) => {
    if (openedAccordion === accordionName) {
      setOpenedAccordion(''); // Close the accordion if it's already open
    } else {
      setOpenedAccordion(accordionName); // Open the clicked accordion
      setHoveredAccordion(''); // Reset the hovered accordion
    }
  };

  const isAccordionOpen = (accordionName) => openedAccordion === accordionName;

  const shouldDisplayImage = (accordionName) => {
    return (
      (hoveredAccordion === '' && isAccordionOpen(accordionName)) || // Display when accordion is open and not hovered
      hoveredAccordion === accordionName || // Display when hovered
      (hoveredAccordion === '' && openedAccordion === '') // Display default image
    );
  };

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  // const handleCarouselNavigation = (direction) => {
  //   // Get the current index of the active accordion
  //   const currentIndex = accordionOrder.indexOf(openedAccordion);

  //   // Calculate the index of the next accordion based on the direction
  //   let nextIndex;
  //   if (direction === 'forward') {
  //     nextIndex = (currentIndex + 1) % accordionOrder.length;
  //   } else {
  //     nextIndex = currentIndex - 1;
  //     if (nextIndex < 0) {
  //       nextIndex = accordionOrder.length - 1;
  //     }
  //   }

  //   // Set the next opened accordion based on the index
  //   setOpenedAccordion(accordionOrder[nextIndex]);
  // };

  // const CarouselArrows = ({ onForward, onBack }) => {
  //   return (
  //     <div className="carousel-arrows">
  //       <button className="carousel-arrow" onClick={onBack}>
  //         {FrontArrow}
  //       </button>
  //       <button className="carousel-arrow" onClick={onForward}>
  //         {BackArrow}
  //       </button>
  //     </div>
  //   );
  // };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const faqAccordionRef = useRef<HTMLDivElement>(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-gradient">
        <div className="landing-header">
          <div className="logo-wrapper">
            <Logo customWidth="width: 124px" customHeight="height: 51px" />
          </div>
          <div className="header-cta">
            <Link className="header-link" onClick={() => navigate(`/login`)}>
              Sign in
            </Link>
            <Button className="header-btn" onClick={() => navigate(`/onboard`)}>
              Get Started
            </Button>
          </div>
        </div>
        <div className="landing-title-wrapper">
          <Text className="landing-title-sub" style={{ color: '#207df7' }}>
            LEARN BETTER
          </Text>
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
        </div>
        <img className="landing-img" src={Dashboard} />
        <img className="landing-img-small" src={DashboardSmall} />
      </div>

      <div className="post-gradient">
        <div className="landing-section-info">
          <img className="landing-icon" src={Sparks} />
          <Text className="landing-title-sub" style={{ color: '#207df7' }}>
            PERSONAL AI ASSISTANT
          </Text>
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
          <img className="landing-hw-img-small" src={HomeworkSmall} />
          <div className="landing-section-img">
            <img
              className="landing-flash-img"
              onMouseEnter={() => setHoveredFlashcard(true)}
              onMouseLeave={() => setHoveredFlashcard(false)}
              src={hoveredFlashcard ? FlashcardHover : Flashcards}
            />
            <img className="landing-flash-img-small" src={FlashcardSmall} />
            <img
              className="landing-study-img"
              onMouseEnter={() => setHoveredStudy(true)}
              onMouseLeave={() => setHoveredStudy(false)}
              src={hoveredStudy ? StudyHover : Study}
            />
            <img className="landing-study-img-small" src={StudySmall} />
          </div>
          <div className="landing-section-img">
            <img className="landing-doc-img" src={Docchat} />
            <img className="landing-doc-img-small" src={DocchatSmall} />
            <img className="landing-quiz-img" src={Quiz} />
            <img className="landing-quiz-img-small" src={QuizSmall} />
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
          {/* <div className="landing-desc-info dweb"> */}
          <div className="landing-desc-info">
            <VStack alignItems={'flex-start'}>
              <Text
                className={`landing-info-mini  ${
                  isAccordionOpen('accordion1') ? 'accordion-selected' : ''
                }`}
                mb="5px !important"
                onClick={() => handleAccordionToggle('accordion1')}
                onMouseEnter={() => setHoveredAccordion('accordion1')}
                onMouseLeave={() => setHoveredAccordion('')}
              >
                Shepherd detects your struggle
              </Text>
              <Collapse in={isAccordionOpen('accordion1')} animateOpacity>
                <VStack alignItems={'flex-start'}>
                  <Text className="landing-desc-mini">
                    Shepherd observes your learning journey and identifies the
                    areas where you need help the most.
                  </Text>
                  <Button
                    mt="30px !important"
                    className="landing-btn"
                    onClick={() => navigate(`/onboard/student`)}
                  >
                    Find a Tutor
                  </Button>
                </VStack>
              </Collapse>
            </VStack>
            <VStack alignItems={'flex-start'}>
              <Text
                className={`landing-info-mini  ${
                  isAccordionOpen('accordion2') ? 'accordion-selected' : ''
                }`}
                mb="5px !important"
                onClick={() => handleAccordionToggle('accordion2')}
                onMouseEnter={() => setHoveredAccordion('accordion2')}
                onMouseLeave={() => setHoveredAccordion('')}
              >
                Shepherd recommends a tutor
              </Text>
              <Collapse in={isAccordionOpen('accordion2')} animateOpacity>
                <VStack alignItems={'flex-start'}>
                  <Text className="landing-desc-mini">
                    All Shepherd tutors are thoroughly vetted and then provided
                    with AI enabled tools to make sure teaching is very
                    productive.
                  </Text>
                  <Button
                    mt="30px !important"
                    className="landing-btn"
                    onClick={() => navigate(`/onboard/student`)}
                  >
                    Find a Tutor
                  </Button>
                </VStack>
              </Collapse>
            </VStack>
            <VStack alignItems={'flex-start'}>
              <Text
                className={`landing-info-mini  ${
                  isAccordionOpen('accordion3') ? 'accordion-selected' : ''
                }`}
                mb="5px !important"
                onClick={() => handleAccordionToggle('accordion3')}
                onMouseEnter={() => setHoveredAccordion('accordion3')}
                onMouseLeave={() => setHoveredAccordion('')}
              >
                Interactive learning
              </Text>
              <Collapse in={isAccordionOpen('accordion3')} animateOpacity>
                <VStack alignItems={'flex-start'}>
                  <Text className="landing-desc-mini">
                    Shepherd shares information about your learning experience
                    with the tutor to make sure your learning experience is very
                    productive.
                  </Text>
                  <Button
                    marginTop="30px !important"
                    className="landing-btn"
                    onClick={() => navigate(`/onboard/student`)}
                  >
                    Find a Tutor
                  </Button>
                </VStack>
              </Collapse>
            </VStack>
          </div>
          {/* <div className="landing-desc-info mweb">
            <VStack alignItems={'flex-start'}>
              <Text
                className='landing-info-mini'
                mb="5px !important"
                // onClick={() => setOpenedAccordion('accordion1')}
              >
                Shepherd detects your struggle
              </Text>
            </VStack>
            <VStack alignItems={'flex-start'}>
              <Text
                className='landing-info-mini'
                mb="5px !important"
                // onClick={() => setOpenedAccordion('accordion2')}
              >
                Shepherd recommends a tutor
              </Text>
            </VStack>
            <VStack alignItems={'flex-start'}>
              <Text
                className='landing-info-mini'
                mb="5px !important"
                // onClick={() => setOpenedAccordion('accordion3')}
              >
                Interactive learning
              </Text>
            </VStack>
          </div>
          <CarouselArrows onForward={() => handleCarouselNavigation('forward')} onBack={() => handleCarouselNavigation('back')} /> */}
          <img
            className="landing-gpt-img"
            src={
              shouldDisplayImage('accordion1')
                ? hoveredAccordion === 'accordion1'
                  ? GptHovered
                  : Gpt
                : shouldDisplayImage('accordion2')
                ? TutorCard
                : shouldDisplayImage('accordion3')
                ? Learn
                : Gpt
            }
          />
        </div>
        <div className="landing-section-metric">
          <div className="landing-metric-mini">
            <Text
              className="landing-info-mini"
              _hover={{ color: '#969ca6', cursor: 'default' }}
            >
              Join Shepherd
            </Text>
            <Text className="landing-desc-mini">
              With Shepherd, no one is left out, by leveraging our array of
              AI-powered tools everyone can tap into the transformative power of
              technology, unlocking their full potential.
            </Text>
          </div>
          <div className="landing-cta-wrapper">
            <div className="landing-cta-card">
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">100+</Text>
                <Text className="landing-metric-tag">LEARNERS</Text>
              </div>
              <Link
                as="button"
                className="landing-title-sub"
                style={{
                  display: 'flex',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#207df7'
                }}
                onClick={() => openModal('Waitlist Coming Soon')}
              >
                Join our waitlist{' '}
                <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
            <div className="landing-cta-card">
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">100+</Text>
                <Text className="landing-metric-tag">TUTORS</Text>
              </div>
              <Link
                as="button"
                className="landing-title-sub"
                style={{
                  display: 'flex',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#207df7'
                }}
                onClick={() => navigate(`/onboard/tutor`)}
              >
                Become a tutor{' '}
                <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
            <div className="landing-cta-card">
              <div className="landing-metric-wrapper">
                <Text className="landing-metric">50+</Text>
                <Text className="landing-metric-tag">SCHOOLS</Text>
              </div>
              <Link
                as="button"
                className="landing-title-sub"
                style={{
                  display: 'flex',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#207df7'
                }}
                onClick={() => openModal('Institution Application Coming Soon')}
              >
                Bring Shepherd to your school{' '}
                <img className="landing-card-arrow" src={Arrow} />
              </Link>
            </div>
          </div>
        </div>
        <div className="landing-section-info">
          <Text className="landing-title-sub-bubble">COMING SOON</Text>
          <Text
            className="landing-title-sub"
            style={{ color: '#FB8441', fontSize: '15px' }}
          >
            LEARN TOGETHER
          </Text>
          <Text className="landing-info">Collaborate with other learners</Text>
          {/* <div className="landing-coming-soon">
            <div className="landing-section-item">
              <img className="landing-coming-soon-icon" src={Collab} />
              <Text className="landing-desc-mini">
                Be a part of a learning community in your school or across other
                schools.
              </Text>
            </div>
            <div className="landing-section-item">
              <img className="landing-coming-soon-icon" src={Share} />
              <Text className="landing-desc-mini">
                Share your notes, flashcards with other learners.
              </Text>
            </div>
            <div className="landing-section-item">
              <img className="landing-coming-soon-icon" src={Spark} />
              <Text className="landing-desc-mini">
                Start a group study session moderated by Shepherd.
              </Text>
            </div>
            <div className="landing-section-item">
              <img className="landing-coming-soon-icon" src={Question} />
              <Text className="landing-desc-mini">
                Ask questions and get them answered by people studying the
                subject.
              </Text>
            </div>
          </div> */}
          <Button
            className="landing-title-btn"
            onClick={() => navigate(`/signup`)}
          >
            Meet Shepherd
          </Button>
        </div>
        <div
          className="landing-section-info"
          style={{
            backgroundColor: '#FAFAFA',
            padding: '80px',
            marginTop: '50px',
            gap: '12px'
          }}
        >
          <img className="landing-icon" src={Pricing} />
          <Text className="landing-title-sub" style={{ color: '#FB8441' }}>
            PRICING
          </Text>
          <div className="landing-price-wrapper">
            {priceData.map((priceCard) => (
              <div
                className="landing-price-card"
                style={{ position: priceCard.popular ? 'relative' : 'static' }}
              >
                {priceCard.popular && (
                  <Text className="landing-price-sub-bubble">Popular</Text>
                )}
                <div className="landing-metric-wrapper">
                  <Text className="landing-price-level">{priceCard.tier}</Text>
                </div>
                <div className="landing-metric-wrapper">
                  <Text className="landing-price-point">{priceCard.price}</Text>
                  {priceCard.cycle && (
                    <Text
                      className="landing-metric-tag"
                      style={{ fontWeight: '400' }}
                    >
                      {priceCard.cycle}
                    </Text>
                  )}
                </div>
                {/* <div className="landing-metric-wrapper">
                  {priceCard.subscription &&
                  <Text
                  className="landing-metric-tag"
                  style={{ fontWeight: '400' }}
                >
                {priceCard.subscription}
                </Text>
                }
                </div> */}
                <div className="landing-section-item">
                  {priceCard['value'].map((value) => (
                    <div className="landing-price-value">
                      <img className="landing-check-icon" src={Check} />
                      <Text className="landing-desc-mini">{value}</Text>
                    </div>
                  ))}
                  <Button
                    className="landing-price-btn"
                    onClick={() => openModal('Trials Coming Soon')}
                  >
                    Try for Free
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-section-faq" ref={faqAccordionRef}>
          <div className="landing-faq-title-wrapper">
            <Text className="landing-title-sub" style={{ color: '#207df7' }}>
              FAQs
            </Text>
            <Text className="landing-faq-title">
              We thought of <img className="landing-faq-icon" src={FAQ} /> you
              might have
            </Text>
          </div>
          <div className="landing-faq-filters">
            <div
              className={`landing-faq-filter ${
                activeTab === 'AI' ? 'active' : ''
              }`}
              id="AI"
              onClick={() => handleTabClick('AI')}
            >
              {' '}
              AI
            </div>
            <div
              className={`landing-faq-filter ${
                activeTab === 'Tutors' ? 'active' : ''
              }`}
              id="Tutors"
              onClick={() => handleTabClick('Tutors')}
            >
              Tutors
            </div>
            <div
              className={`landing-faq-filter ${
                activeTab === 'Data' ? 'active' : ''
              }`}
              id="Data"
              onClick={() => handleTabClick('Data')}
            >
              Data
            </div>
            <div
              className={`landing-faq-filter ${
                activeTab === 'Pricing' ? 'active' : ''
              }`}
              id="Pricing"
              onClick={() => handleTabClick('Pricing')}
            >
              Pricing
            </div>
            <div
              className={`landing-faq-filter ${
                activeTab === 'General' ? 'active' : ''
              }`}
              id="General"
              onClick={() => handleTabClick('General')}
            >
              General
            </div>
          </div>
          <div className="faq-data-wrapper">
            <Accordion className="faq-accordion" allowToggle>
              {faqData[activeTab].map((faq, index) => (
                <AccordionItem className="faq-item-data" key={index}>
                  <AccordionButton className="faq-accordion-btn">
                    <Box as="span" flex="1" textAlign="left">
                      {faq.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel className="faq-accordion-panel">
                    {faq.content}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="landing-cta-banner">
          <div className="landing-cta-banner-info">
            <Text className="landing-title-sub" style={{ color: '#207df7' }}>
              YOU ARE CONVINCED
            </Text>
            <Text className="landing-banner-title">
              Join us today, it's time to supercharge{' '}
              <img className="banner-icon" src={Flash} /> your learning
            </Text>
            <Text className="banner-desc">
              Shepherd provides an integrated experience to improve your
              learning outcomes. It understands you, your learning journey and
              connects you to everything you need to learn better.
            </Text>
            <Button
              className="landing-banner-btn"
              onClick={() => navigate(`/onboard`)}
            >
              Get Started for Free
            </Button>
          </div>
          {/* <img className="banner-img" src={Star} style={{marginTop: '200px'}} /> */}
        </div>
        <div className="landing-footer">
          <div className="landing-links">
            <div className="landing-footer-logo">
              <Logo
                customWidth="width: 124px"
                customHeight="height: 51px"
                style={{ margin: '0px' }}
              />
              <Text className="landing-address">
                123 Hackerway,Menlo Park, CA 94025,USA
              </Text>
            </div>
            <div className="landing-links-wrapper">
              <div className="landing-link-wrapper">
                <Text className="landing-links-title">Product</Text>
                <Link
                  as="button"
                  className="landing-link"
                  onClick={() => navigate(`/onboard`)}
                >
                  Shepherd
                </Link>
                <Link
                  as="button"
                  className="landing-link"
                  onClick={() => openModal('Tutor Application Coming Soon')}
                >
                  Become a Tutor
                </Link>
              </div>
              <div className="landing-link-wrapper">
                <Text className="landing-links-title">Resources</Text>
                <Link
                  as="button"
                  className="landing-link"
                  onClick={() => openModal('Pricing Details Coming Soon')}
                >
                  Pricing
                </Link>
                <Link
                  as="button"
                  className="landing-link"
                  onClick={() => faqAccordionRef.current?.scrollIntoView()}
                >
                  FAQs
                </Link>
              </div>
            </div>
            <div className="landing-footer-socials">
              <div className="landing-link-wrapper">
                <Text
                  className="landing-links-title"
                  style={{ color: '#7A7E85' }}
                >
                  Reach out to us
                </Text>
                <div className="landing-footer-icons">
                  <a href="#footer-icon">
                    <img className="footer-icon" src={Mail} />
                  </a>
                  <a href="https://twitter.com/ShepherdLearn">
                    <img className="footer-icon" src={Twitter} />
                  </a>
                  <a href="#footer-icon">
                    <img className="footer-icon" src={Linkedin} />
                  </a>
                  <a href="https://www.instagram.com/shepherdtutors/">
                    <img className="footer-icon" src={Insta} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-signature">
            <Text className="landing-signature-info">
              &#169; 2023 Shepherd Tutors
            </Text>
            <Text className="landing-signature-info">
              Built with love <img className="landing-heart-icon" src={Heart} />
            </Text>
            <div className="landing-terms">
              <Text
                as="button"
                className="landing-signature-info"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal('Policy Details Coming Soon')}
              >
                Privacy policy
              </Text>
              <img className="landing-dot-icon" src={Dot} />
              <Text
                as="button"
                className="landing-signature-info"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal('Term Details Coming Soon')}
              >
                Terms of use
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Landing;
