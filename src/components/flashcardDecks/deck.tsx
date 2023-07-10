import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 300px;
  height: 200px;
  position: relative;
  perspective: 600px;
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #212224;
  backface-visibility: hidden;
  will-change: transform, opacity;
`;

type Flashcard = {
  front: string;
  back: string;
};

type FlashcardDeckProps = {
  cards: Flashcard[];
};

const FlashCardDeck: React.FC<FlashcardDeckProps> = ({ cards }) => {
  const [isFlipped, setIsFlipped] = useState<boolean[]>(
    new Array(cards.length).fill(false)
  );

  const handleFlipCard = (index: number) => {
    setIsFlipped((prevState) =>
      prevState.map((flip, i) => (i === index ? !flip : flip))
    );
  };

  const handleDragEnd = (index: number, offset: number) => {
    if (Math.abs(offset) > 400) {
      cards.splice(index, 1);
      setIsFlipped((prevState) => {
        const copy = [...prevState];
        copy.splice(index, 1);
        return copy;
      });
    }
  };

  const variants = {
    enter: { x: 1000, opacity: 0 },
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: { zIndex: 0, x: -1000, opacity: 0 },
  };

  const flipAnimation = {
    hidden: { rotateY: 0 },
    show: { rotateY: 180 },
  };

  return (
    <div>
      <CardContainer>
        <AnimatePresence initial={false}>
          {[...cards].map((card, i) => (
            <Card
              key={i}
              style={{
                zIndex: cards.length - i,
                transform: `translateY(${i * 10}px) scale(${
                  i === 0 ? 1 : 0.9
                })`,
              }}
              variants={
                i === 0 ? (isFlipped[i] ? flipAnimation : variants) : {}
              }
              initial="hidden"
              animate="show"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                handleDragEnd(i, offset.x);
              }}
              whileHover={{ cursor: "grab" }}
              whileTap={{ cursor: "grabbing" }}
              onClick={() => handleFlipCard(i)}
            >
              {isFlipped[i] ? card.back : card.front}
            </Card>
          ))}
        </AnimatePresence>
      </CardContainer>
    </div>
  );
};

export default FlashCardDeck;
