import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, Text, Divider, Avatar, HStack } from '@chakra-ui/react';
import styled from 'styled-components';
import { FiBookOpen } from 'react-icons/fi';
import theme from '../theme';
import { Course, Tutor } from '../types';
import { capitalize } from 'lodash';
import { formatContentFulCourse, getContentfulClient } from '../contentful';
import Panel from './Panel';

type Props = {
    tutor: Tutor
} & ComponentProps<typeof Box>

const Root = styled(Panel)`
background: #FFF;
width: 100%;
height: 100%;
display: flex;
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
            <Box width={"100%"} display={"flex"} flexDirection="row" gap='20px'>
                <Box>
                    <Avatar width={'45px'} height='45px' name={`${tutor.name.first} ${tutor.name.last}`} src={tutor.avatar} />
                </Box>
                <Box flexGrow={1}>
                    <HStack justifyContent={"space-between"}>
                        <Text className='sub2' color={'text.200'} mb={0}>{capitalize(tutor.name.first)} {capitalize(tutor.name.last)}</Text>
                    </HStack>
                    <Text noOfLines={2} whiteSpace={"normal"} mt={1} mb={0} className='body2' color={'text.200'}>{tutor.description}</Text>
                </Box>
                <Text color="text.200" className='sub2' mb={0}>${tutor.rate}/hour</Text>
            </Box>
        </Root>
    )
}

export default TutorCard;