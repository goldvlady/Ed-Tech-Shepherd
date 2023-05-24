import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import OnFire from "../../../assets/fire.svg";
import EnergyUp from "../../../assets/energy-up.svg";
import Less50 from "../../../assets/less-50.svg";

export default function Carousel() {
  const arrowStyles = {
    cursor: "pointer",
    pos: "absolute",
    top: "30%",
    w: "auto",
    mt: "-22px",
    p: "16px",
    color: "#6E7682",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "0.6s ease",
    borderRadius: "0 3px 3px 0",
    userSelect: "none",
    _hover: {
      opacity: 0.8,
      //   bg: "black",
    },
  } as const;

  const slides = [
    {
      //   img: OnFire,
      //   description: "spend a little extra time learning",
      label: "You’ve scored a total of 65% in all quizzes this week!",
    },
    {
      img: EnergyUp,
      description: "Complete a flash deck to make it 4",
      label: "You’re on a 3 day streak!",
    },
    {
      img: OnFire,
      description: "spend a little extra time learning",
      label: "You spent 5 hours learning this week",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesCount = slides.length;

  const prevSlide = () => {
    setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
  };
  const setSlide = (slide: number) => {
    setCurrentSlide(slide);
  };
  const carouselStyle = {
    transition: "all .5s",
    ml: `-${currentSlide * 100}%`,
  };

  const SLIDES_INTERVAL_TIME = 10000;
  const ANIMATION_DIRECTION = "right";
  useEffect(() => {
    const prevSlide = () => {
      setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
    };

    const nextSlide = () => {
      setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
    };

    const automatedSlide = setInterval(() => {
      ANIMATION_DIRECTION.toLowerCase() === "left" ? prevSlide() : nextSlide();
    }, SLIDES_INTERVAL_TIME);
    return () => clearInterval(automatedSlide);
  }, [slidesCount]);

  return (
    <Flex
      w="full"
      //   bg="#edf3f8"
      _dark={{ bg: "#3e3e3e" }}
      p={5}
      alignItems="center"
      justifyContent="center"
    >
      <Flex w="full" pos="relative" overflow="hidden">
        <Flex h="250px" w="full" {...carouselStyle}>
          {slides.map((slide, sid) => (
            <Box key={`slide-${sid}`} boxSize="full" flex="none">
              <Text
                color="white"
                fontSize="xs"
                p="8px 12px"
                pos="absolute"
                top="0"
              >
                {sid + 1} / {slidesCount}
              </Text>

              <Stack
                p="8px 12px"
                pos="absolute"
                bottom="24px"
                textAlign="center"
                w="full"
                mb="8"
                color="black"
              >
                {slide.img ? (
                  <Image
                    src={slide.img}
                    alt="carousel image"
                    boxSize="100px"
                    backgroundSize="cover"
                    alignSelf={"center"}
                  />
                ) : (
                  <CircularProgress
                    value={65}
                    size="100px"
                    thickness="7px"
                    alignSelf={"center"}
                    color={"#207DF7"}
                    mb={5}
                  >
                    <CircularProgressLabel>
                      <Center>
                        <Image src={Less50} />
                      </Center>
                    </CircularProgressLabel>
                  </CircularProgress>
                )}

                <Text fontSize="14px" fontWeight={500}>
                  {slide.label}
                </Text>
                <Text fontSize="12px" fontWeight={400}>
                  {slide.description}
                </Text>
              </Stack>
            </Box>
          ))}
        </Flex>
        <Text {...arrowStyles} left={-3} onClick={prevSlide}>
          &#10094;
        </Text>
        <Text {...arrowStyles} right={-3} onClick={nextSlide}>
          &#10095;
        </Text>
        <HStack justify="center" pos="absolute" top="1px" w="full">
          {Array.from({ length: slidesCount }).map((_, slide) => (
            <Box
              key={`dots-${slide}`}
              cursor="pointer"
              //   boxSize={["67px", null, "5px"]}
              width="120px"
              height="3px"
              m="0 2px"
              bg={currentSlide === slide ? "#207DF7" : "#EEF0F1"}
              //   rounded="100%"
              display="inline-block"
              transition="background-color 0.6s ease"
              //   _hover={{ bg: "blackAlpha.800" }}
              onClick={() => setSlide(slide)}
            ></Box>
          ))}
        </HStack>
      </Flex>
    </Flex>
  );
}
