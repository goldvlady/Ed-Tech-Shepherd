import * as React from "react";
import styled from "styled-components";
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { useRef, useState } from "react";
import { Schedule } from "../types";
import { numberToDayOfWeekName } from "../util";
import moment from "moment";
import { isEmpty } from "lodash";
import TimePicker from "./TimePicker";
import Select from "./Select";

export interface ScheduleBuilderDialogRef {
    buildSchedule: (dayOfWeek: number | null) => Promise<Schedule[]>
}

interface Props {
    children?: React.ReactNode;
}

const Root = styled(Box)`
`

const dayOptions = [...new Array(7)].map((_, i) => {
    return { label: numberToDayOfWeekName(i), value: i }
});

const ScheduleBuilderDialog = React.forwardRef<ScheduleBuilderDialogRef, Props>((props, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [days, setDays] = useState<Array<any>>([]);
    const promiseResolve = useRef<((value: Schedule[] | PromiseLike<Schedule[]>) => void) | null>(null);
    const promiseReject = useRef<((value: Schedule[] | PromiseLike<Schedule[]>) => void) | null>(null);

    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");

    const parseDateFormat = "MM-DD-YYYY";
    const parseTimeFormat = "hh:mm A";

    React.useImperativeHandle(ref, () => {
        return {
            buildSchedule: async (dayOfWeek) => {
                onOpen();
                if (dayOfWeek !== null) {
                    setDays([dayOptions.find((v) => v.value === dayOfWeek)])
                }
                return new Promise<Schedule[]>((resolve, reject) => {
                    promiseResolve.current = resolve;
                    promiseReject.current = resolve;
                });
            }
        }
    });

    const reset = () => {
        setFromTime("");
        setToTime("");
        setDays([])
    }

    const done = () => {
        onClose();

        const resolveValue = days.map((d) => {
            const begin = moment(fromTime, parseTimeFormat);
            const end = moment(toTime, parseTimeFormat);

            begin.weekday(d.value);
            end.weekday(d.value);

            return {
                begin: begin.toDate(),
                end: end.toDate()
            }
        });

        promiseResolve.current?.(resolveValue);

        reset();
    }

    const dateStr = moment().format(parseDateFormat)

    const fromTimeDate = moment(`${dateStr}, ${fromTime}`, `${parseDateFormat}, ${parseTimeFormat}`);
    const toTimeDate = moment(`${dateStr}, ${toTime}`, `${parseDateFormat}, ${parseTimeFormat}`);

    const hoursDiff = moment.duration(toTimeDate.diff(fromTimeDate)).asHours();

    const canDone = !isEmpty(days) && !!fromTime && !!toTime && hoursDiff > 0;

    return <Root>
        <Modal isOpen={isOpen} onClose={() => { onClose(); reset() }}>
            <ModalOverlay />
            <ModalContent overflow='visible'>
                <ModalHeader>Add availability</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Box>
                            <FormLabel>
                                <Box mb={2}>
                                    Day of the week
                                    <Box>
                                        <Text variant={"muted"} mb={0}>Select multiple days of the week to repeat availability across them</Text>
                                    </Box>
                                </Box>
                                <Select
                                    value={days}
                                    isMulti
                                    onChange={(v => setDays(v as Array<any>))}
                                    tagVariant="solid"
                                    options={dayOptions}
                                    size={'lg'}
                                />
                            </FormLabel>
                        </Box>
                        <Box>
                            <FormControl>
                                <FormLabel>
                                    <Box>Time</Box>
                                </FormLabel>

                                <Box display={"flex"} alignItems="center" gap={"7px"}>
                                    <TimePicker inputGroupProps={{ size: 'lg' }} inputProps={{ size: 'lg', placeholder: '01:00 PM' }} value={fromTime} onChange={(v: string) => {
                                        setFromTime(v)
                                    }} />
                                    <Text as="small">to</Text>
                                    <TimePicker inputGroupProps={{ size: 'lg' }} inputProps={{ placeholder: '06:00 PM' }} value={toTime} onChange={(v: string) => {
                                        setToTime(v)
                                    }} />
                                </Box>
                            </FormControl>
                        </Box>
                        {hoursDiff < 0 && !!fromTime && !!toTime && <Alert status='error' mt={3}>
                            <AlertIcon />
                            The start time should be before the end time.
                        </Alert>}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={!canDone} onClick={done}>Done</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Root >
})

export default ScheduleBuilderDialog;