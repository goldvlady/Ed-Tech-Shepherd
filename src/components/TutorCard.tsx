import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, Text, Divider, Avatar, HStack } from '@chakra-ui/react';
import styled from 'styled-components';
import { FiBookOpen } from 'react-icons/fi';
import theme from '../theme';
import { Course, Tutor } from '../types';
import { capitalize } from 'lodash';
import { formatContentFulCourse, getContentfulClient } from '../contentful';

type Props = {
    tutor: Tutor
} & ComponentProps<typeof Box>

const Root = styled(Box)`
background: #FFF;
width: 100%;
height: 100%;
min-height: 250px;
display: flex;
border-radius: ${theme.radii.md};
border: 1px solid ${theme.colors.gray[200]};
position: relative;
`

const MetaIcon = styled(Box)`
margin-top: 2px;
color: ${theme.colors.gray[500]};
`

const client = getContentfulClient();

const TutorCard: React.FC<Props> = ({ tutor, ...rest }) => {

    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const loadCourses = useCallback(async () => {
        setLoadingCourses(true);

        try {
            const resp = await client.getEntries({
                content_type: 'course'
            })

            let courseList: Array<Course> = [];
            resp.items.map((i: any) => {
                courseList.push(formatContentFulCourse(i));
            })

            setCourseList(courseList);
        } catch (e) {

        }
        setLoadingCourses(false);
    }, []);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const tutorCourses = useMemo(() => {
        return tutor.courses.map(tc => {
            return courseList.find(ac => ac.id === tc);
        })
    }, [tutor, courseList]);

    const tutorMeta = useMemo(() => [
        {
            label: "Classes",
            icon: <FiBookOpen />,
            value: tutorCourses.map(tc => tc?.title).join(", ")
        }
    ], [tutorCourses]);

    return (
        <Root {...rest}>
            <Box width={"100%"} display={"flex"} flexDirection="column" p={4}>
                <Box mb={3}>
                    <Avatar name={`${tutor.name.first} ${tutor.name.last}`} src={tutor.avatar} />
                </Box>
                <Box flexGrow={1}>
                    <HStack justifyContent={"space-between"}>
                        <Text fontSize="lg" fontWeight={"bold"}>{capitalize(tutor.name.first)} {capitalize(tutor.name.last)}</Text>
                        <Text color="gray.600" fontWeight={600}>${tutor.rate}/hour</Text>
                    </HStack>
                    <Box paddingBlock={2}>
                        <Stack spacing={1}>
                            {tutorMeta.map(tm => <Box key={tm.label} display={"flex"} gap={2} alignItems="flex-start">
                                <MetaIcon mt={"2px"}>{tm.icon}</MetaIcon> <Text as="small" variant={"muted"} color="gray.500">{tm.value}</Text>
                            </Box>)}
                        </Stack>
                    </Box>
                    <Divider />
                    <Text noOfLines={5} whiteSpace={"normal"} mt={1} fontSize="small">{tutor.description}</Text></Box>
            </Box>
        </Root>
    )
}

export default TutorCard;