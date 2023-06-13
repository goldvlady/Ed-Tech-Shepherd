import React, { useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import ProfilePictureForm from "./components/steps/profile_picture.step";
import PaymentInformationForm from "./components/steps/payment_information.step";
import HourlyRateForm from "./components/steps/hourly_rate.step";
import SubjectLevelForm from "./components/steps/add_subjects";
import AvailabilityForm from "./components/steps/availabilty.steps";
import QualificationsForm from "./components/steps/qualifications.step";
import IntroVideoForm from "./components/steps/intro_video.step";
import BioForm from "./components/steps/bio.step";
import StepsLayout from "./components/StepsLayout";
import styled from "styled-components";
import Header from "../../components/Header";

const Root = styled(Box)`
  display: flex;
  background: #ffffff;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  width: 100%;
`;

const MainWrapper = styled(Box)`
  background: #ffffff;
  min-width: 100vw;
  min-height: 100vh;
`;

type Step = {
  id: string;
  position: number;
  title: string;
  supportingText: string;
  element: React.FC;
};

const CompleteProfile = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      id: "subjects",
      position: 0,
      element: SubjectLevelForm,
      title: "Please inform us of the subjects you would like to teach ",
      supportingText:
        "Kindly select your area of expertise and proficiency level, you may add multiple subjects",
    },
    {
      id: "qualifications",
      position: 1,
      element: QualificationsForm,
      title:
        "Add your professional qualifications relevant to the subjects you selected",
      supportingText:
        "Provide relevant educational background, certifications and experiences",
    },
    {
      id: "bio",
      position: 2,
      element: BioForm,
      title: "Write a bio to let your potential students know about you",
      supportingText:
        "Help potential students make an informed decision by showcasing your personality and teaching style.",
    },
    {
      id: "availability",
      position: 3,
      element: AvailabilityForm,
      title: "Write a bio to let your potential students know about you",
      supportingText:
        "Provide the days and time frame when will you be available",
    },
    {
      id: "intro_video",
      position: 4,
      element: IntroVideoForm,
      title:
        "Upload an intro video to show your proficiency in your chosen subjects",
      supportingText:
        "Be as detailed as possible, this lets your potential student know you are capable ",
    },
    {
      id: "hourly_rate",
      position: 5,
      element: HourlyRateForm,
      title: "Set your hourly rate",
      supportingText:
        "Your clients will send you offers based on this rate. You can always adjust your rate",
    },
    {
      id: "upload_profile_picture",
      position: 6,
      element: ProfilePictureForm,
      title: "Add a profile picture",
      supportingText:
        "Ensure this is a clear and actual picture of you, your picture helps your clients trust you",
    },
    {
      id: "payment",
      position: 7,
      element: PaymentInformationForm,
      title: "Provide your account details",
      supportingText:
        "Shepherd uses your account details to remit payment from clients to you ",
    },
  ];

  const currentStep = useMemo(
    () => steps.find((step) => step.position === activeStep),
    [activeStep]
  );

  const goToPreviousStep = () => {
    if (activeStep === 0) return;
    setActiveStep((prev) => prev - 1);
  };

  const goToNextStep = () => {
    if (steps.length === activeStep) return;
    setActiveStep((prev) => prev + 1);
  };

  const nextStep = useMemo(() => {
    if (activeStep === steps.length) return {} as Step;
    return steps.find((step) => step.position === activeStep + 1);
  }, [activeStep]);

  if (!currentStep) return <></>;

  const { element: Element } = currentStep;
  return (
    <MainWrapper>
      <Header />
      <Root>
        <StepsLayout
          currentStep={currentStep.position + 1}
          nextStep={nextStep?.id || "Preview"}
          onNextClick={() => goToNextStep()}
          onBackClick={() => goToPreviousStep()}
          stepText="Create your profile"
          totalSteps={steps.length}
          supportingText={currentStep.supportingText}
          mainText={currentStep?.title}
        >
          <Element />
        </StepsLayout>
      </Root>
    </MainWrapper>
  );
};
export default CompleteProfile;
