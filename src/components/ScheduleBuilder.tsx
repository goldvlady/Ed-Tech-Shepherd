import * as React from "react";
import styled from "styled-components";
import { Box, Button, Heading, IconButton, Text } from '@chakra-ui/react'
import { useRef } from "react";
import { Schedule } from "../types";
import { FiAlertTriangle, FiPlus, FiTrash } from "react-icons/fi"
import theme from "../theme";
import ScheduleBuilderDialog, { ScheduleBuilderDialogRef } from "./ScheduleBuilderDialog";
import { leadingZero, numberToDayOfWeekName } from "../util";
import { findIndex, isEmpty, uniq } from "lodash";
import DateTimeInput from "./DateTimeInput";
import EmptyState from "./EmptyState";

export interface ScheduleBuilderRef {
}

interface Props {
    value: Schedule[];
    onChange: (v: Props["value"]) => void;
}

const Root = styled(Box)`
`

const ScheduleBuilder = React.forwardRef<ScheduleBuilderRef, Props>(({ onChange, value }, ref) => {
    const scheduleBuilderDialogRef = useRef<ScheduleBuilderDialogRef>(null);

    const addTime = async (d: number | null) => {
        const schedule = await scheduleBuilderDialogRef.current?.buildSchedule(d) as Schedule[];
        onChange([...value, ...schedule]);
    }

    const deleteTime = (t: Schedule) => {
        const foundIndex = findIndex(value, (c) => {
            return (c.begin.getTime() === t.begin.getTime()) && (c.end.getTime() === t.end.getTime());
        })
        onChange(value.filter((v, i) => i !== foundIndex))
    }

    const daysInValue = uniq(value.map((v) => v.begin.getDay()));

    return <Root>
        <ScheduleBuilderDialog ref={scheduleBuilderDialogRef} />
        <Box display="flex" justifyContent={"space-between"} alignItems="center">
            <Heading as="h3">Availability</Heading>
            <Box>{!!!isEmpty(value) && <Button size={'sm'} onClick={() => addTime(null)} leftIcon={<FiPlus />} colorScheme='primary' variant={"solid"}>Add Availability</Button>}</Box>
        </Box>
        {
            daysInValue.length > 0 ? daysInValue.map((d, _) => {
                const dayOfWeekName = numberToDayOfWeekName(d);
                const timesInDay: Schedule[] = value.filter(v => v.begin.getDay() === d);

                return <Box key={d} marginBottom={10}>
                    <Text className="body2" mb={0}>{dayOfWeekName}</Text>
                    <Box marginTop={1}>
                        {timesInDay.length === 0 ? <Box display={"flex"} gap={"15px"} alignItems="center">
                            <Box width={"40px"} height={"40px"} background={theme.colors.primary[50]} display="flex" alignItems={"center"} justifyContent="center" borderRadius={"100%"}>
                                <FiAlertTriangle color={theme.colors.primary[700]} />
                            </Box>
                            <Box>
                                <Text as="b">No times added</Text>
                                <Text as="small" display={"block"}>Looks like you haven't indicated availability for {dayOfWeekName}.</Text>
                                <Box marginTop={1}>
                                    <Button onClick={() => addTime(d)} leftIcon={<FiPlus />} size='xs' colorScheme='primary' variant={"solid"}>Add Time</Button>
                                </Box>
                            </Box>
                        </Box> : <>
                            {timesInDay.map((t, i) => {
                                return <Box key={i} marginBottom={2}>
                                    <Box display={"flex"} alignItems="center" gap={"7px"}>
                                        <DateTimeInput readOnly type="time" value={`${leadingZero(t.begin.getHours())}:${leadingZero(t.begin.getMinutes())}`} />
                                        <Text as="small">to</Text>
                                        <DateTimeInput readOnly type="time" value={`${leadingZero(t.end.getHours())}:${leadingZero(t.end.getMinutes())}`} />
                                        <IconButton variant={'ghost'} onClick={() => deleteTime(t)} aria-label='Delete' icon={<FiTrash />} />
                                    </Box>
                                </Box>
                            })}
                            <Box>
                                <Button onClick={() => addTime(d)} leftIcon={<FiPlus />} size='xs' colorScheme='primary' variant={"solid"}>Add Another Time For {dayOfWeekName}</Button>
                            </Box>
                        </>}
                    </Box>
                </Box>
            }) : <EmptyState title="No availability added" subtitle={"Looks like you haven't indicated your availability yet, hit the button below to get started."} action={<Button onClick={() => addTime(null)} leftIcon={<FiPlus />} colorScheme='primary' variant={"solid"}>Add Availability</Button>} image={<img alt="no availability" style={{ height: "80px" }} src="/images/empty-state-schedule.png" />} />
        }
    </Root>
})

export default ScheduleBuilder;