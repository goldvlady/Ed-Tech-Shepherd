import React from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'
import Banner from './components/Banner'
import TutorCard from './components/TutorCard'


export default function Marketplace() {
    return (
        <>
            <Box bgColor={"black"} borderRadius={"14px"} height={"200px"}><Banner /></Box>
            <Box my={65} py={2}>
                <SimpleGrid minChildWidth='359px' spacing='30px' >
                    <TutorCard />
                    <TutorCard />
                    <TutorCard />
                    <TutorCard />
                    <TutorCard />
                    <TutorCard />
                </SimpleGrid>
            </Box>
        </>
    )
}
