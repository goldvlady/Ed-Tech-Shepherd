import React, { useState } from 'react'
import {
	Box,
	IconButton,
	useBreakpointValue,
	Stack,
	Container, SimpleGrid, Card, Grid, GridItem, CardHeader, Heading, CardBody, Text, CardFooter, Button
} from '@chakra-ui/react'
import Slider from 'react-slick';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import ribbon1 from "../../assets/ribbon1.png"
import ribbon2 from "../../assets/ribbon2.png"
import briefCase from "../../assets/briefcase.png"
import magicStar from "../../assets/magic-star.png"
import timer from "../../assets/timer.png"


export default function Index() {

	const [slider, setSlider] = useState<Slider | null>(null);

	const top = useBreakpointValue({ base: '90%', md: '50%' });
	const side = useBreakpointValue({ base: '30%', md: '40px' });

	const cards = [
		{
			title: 'Design Projects 1',
			text:
				"The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image:
				'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
		},
		{
			title: 'Design Projects 2',
			text:
				"The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image:
				'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80',
		},
		{
			title: 'Design Projects 3',
			text:
				"The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
			image:
				'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
		},
	];
	// Settings for the slider
	const settings = {
		dots: true,
		arrows: false,
		fade: true,
		infinite: true,
		autoplay: true,
		speed: 500,
		autoplaySpeed: 5000,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<>
			<Grid
				h='200px'
				templateRows='repeat(2, 1fr)'
				templateColumns='repeat(5, 1fr)'
				gap={4}
			>
				<GridItem rowSpan={1} colSpan={1} >
					<Card bg={"#207DF7"} bgImage={briefCase} bgRepeat={"no-repeat"} bgSize={"160px"} bgPosition={"right -10px bottom 10px"} height={"250px"}>
						<CardHeader>
							<img src={ribbon1} width={"40px"} />
						</CardHeader>

						<CardBody>
							{/* <Text>30</Text> */}
						</CardBody>
						<CardFooter display={"inline-block"} color="white">
							<Text fontSize={"32px "} fontWeight={600}>30</Text>
							<Text fontSize={"14px"} fontWeight={400}>All Subjects</Text>
						</CardFooter>
					</Card>
				</GridItem>
				<GridItem rowSpan={1} colSpan={1} >
					<Card bg={"#E7EAEE"} bgImage={magicStar} bgRepeat={"no-repeat"} bgSize={"160px"} bgPosition={"right -10px bottom 10px"} height={"250px"}>
						<CardHeader>
							<img src={ribbon2} width={"40px"} />
						</CardHeader>

						<CardBody>
							{/* <Text>30</Text> */}
						</CardBody>
						<CardFooter display={"inline-block"} color="#000">
							<Text fontSize={"32px "} fontWeight={600}>20</Text>
							<Text fontSize={"14px"} fontWeight={400}>Completed Subjects</Text>
						</CardFooter>
					</Card>
				</GridItem>
				<GridItem rowSpan={1} colSpan={1}><Card bg={"#E7EAEE"} bgImage={timer} bgRepeat={"no-repeat"} bgSize={"160px"} bgPosition={"right -10px bottom 10px"} height={"250px"}>
					<CardHeader>
						<img src={ribbon2} width={"40px"} />
					</CardHeader>

					<CardBody>
						{/* <Text>30</Text> */}
					</CardBody>
					<CardFooter display={"inline-block"} color="#000">
						<Text fontSize={"32px"} fontWeight={600}>40 <span style={{ fontSize: "16px" }}>hours</span></Text>
						<Text fontSize={"14px"} fontWeight={400}>Time spent learning </Text>
					</CardFooter>
				</Card>
				</GridItem>

				<GridItem colSpan={2} bg='papayawhip'>

				</GridItem>
				<GridItem colSpan={3} bg='papayawhip' />
				<GridItem colSpan={2} bg='tomato' />
			</Grid>


		</>





	)
}
