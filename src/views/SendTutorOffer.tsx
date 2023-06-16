import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { capitalize, isEmpty } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { FiChevronRight } from 'react-icons/fi';
import { MdInfo } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import * as Yup from 'yup';

import CalendarDateInput from '../components/CalendarDateInput';
import LinedList from '../components/LinedList';
import PageTitle from '../components/PageTitle';
import Panel from '../components/Panel';
import Select, { Option } from '../components/Select';
import TimePicker from '../components/TimePicker';
import TutorCard from '../components/TutorCard';
import { useTitle } from '../hooks';
import ApiService from '../services/ApiService';
import resourceStore from '../state/resourceStore';
import theme from '../theme';
import { Tutor } from '../types';
import { numberToDayOfWeekName } from '../util';

const LeftCol = styled(Box)`
  min-height: 100vh;
`;
const RightCol = styled(Box)``;

const Root = styled(Box)``;

const TutorOfferSchema = Yup.object().shape({
  course: Yup.string().required('Select a course'),
  level: Yup.string().required('Select a level'),
  days: Yup.array().min(1, 'Select days').required('Select days'),
  schedule: Yup.object().required('Select a schedule'),
  note: Yup.string(),
  rate: Yup.number().required('Enter a rate').min(1, 'Rate has to be greater than 0'),
  //paymentOption: Yup.string().required('Choose a payment option'),
  expirationDate: Yup.date().required('Select an expiration date'),
  contractStartDate: Yup.date().required('Select a start date'),
  contractEndDate: Yup.date().required('Select an end date'),
});

const levels = ['A - Level', 'GCSE', 'Grade 12'];

const SendTutorOffer = () => {
  useTitle('Send an offer');

  const { courses: courseList } = resourceStore();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<any>>(null);
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const { tutorId } = useParams() as { tutorId: string };
  const [isEditing, setIsEditing] = useState(true);

  const EditField = styled(Text).attrs({ onClick: () => setIsEditing(true) })`
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.001em;
    margin-bottom: 0;
    color: ${theme.colors.text[200]};

    &:after {
      content: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.59967 2.56938L9.42807 5.39777L2.82843 11.9974H0V9.16904L6.59967 2.56938ZM7.54247 1.62656L8.95667 0.21235C9.21707 -0.0479968 9.63913 -0.0479968 9.89947 0.21235L11.7851 2.09797C12.0455 2.35832 12.0455 2.78043 11.7851 3.04078L10.3709 4.45499L7.54247 1.62656Z' fill='%23585F68'/%3E%3C/svg%3E%0A");
      margin-left: 5px;
    }
  `;

  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure();

  const loadTutor = useCallback(async () => {
    setLoadingTutor(true);

    try {
      const resp = await ApiService.getTutor(tutorId);
      setTutor(await resp.json());
    } catch (e) {}

    setLoadingTutor(false);
  }, []); 

  const courseOptions = useMemo(
    () => tutor?.coursesAndLevels.map((c) => ({ label: c.course.label, value: c.course._id })) || [],
    [tutor]
  );
  const levelOptions = useMemo(() => levels.map((l) => ({ label: l, value: l })), []);

  useEffect(() => {
    loadTutor();
  }, []);

  const loading = loadingTutor;

  const setScheduleValue = (value: any, day: number, property: 'begin' | 'end') => {
    let scheduleValue = formikRef.current?.values.schedule;
    if (!scheduleValue[day]) {
      scheduleValue[day] = {};
    }
    scheduleValue[day] = { ...scheduleValue[day], [property]: value };
    formikRef.current?.setFieldValue('schedule', scheduleValue);
  };

  const dayOptions = [...new Array(7)]
    .filter((_, i) => !!tutor?.schedule[i])
    .map((_, i) => {
      return { label: numberToDayOfWeekName(i), value: i };
    });

  return (
    <Root className="container-fluid">
      <Box className="row">
        <LeftCol mb="32px" className="col-lg-8">
          {loading && (
            <Box textAlign={'center'}>
              <Spinner />
            </Box>
          )}
          {!!tutor && (
            <Box>
              <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody>
                    <Box w={'100%'} mt={5} textAlign="center">
                      <Box display={'flex'} justifyContent="center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20" cy="20" r="20" fill="#EDF7EE" />
                          <path
                            d="M18.0007 23.1709L27.1931 13.9785L28.6073 15.3927L18.0007 25.9993L11.6367 19.6354L13.0509 18.2212L18.0007 23.1709Z"
                            fill="#4CAF50"
                          />
                        </svg>
                      </Box>
                      <Box marginTop={3}>
                        <Text className="modal-title">Offer successfully sent</Text>
                        <div style={{ color: theme.colors.text[400] }}>
                          You’ll be notified within 24 hours once {tutor.user.name.first} responds
                        </div>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Breadcrumb spacing="8px" separator={<FiChevronRight size={10} color="gray.500" />}>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Find a tutor</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    {tutor.user.name.first} {tutor.user.name.last}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink href="#">Send Offer</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <PageTitle
                marginTop={'28px'}
                mb={10}
                title="Send an Offer"
                subtitle={`Provide your contract terms. We’ll notify you via email when ${tutor.user.name.first} responds`}
              />
              <Formik
                initialValues={{
                  course: '',
                  level: '',
                  days: [],
                  schedule: {},
                  note: '',
                  rate: tutor.rate,
                  expirationDate: new Date(),
                  contractStartDate: null,
                  contractEndDate: null,
                }}
                validationSchema={TutorOfferSchema}
                innerRef={formikRef}
                onSubmit={async (values, { setSubmitting }) => {
                  if (isEditing) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsEditing(false);
                    setSubmitting(false);
                  } else {
                    try {
                      await ApiService.createOffer({
                        ...values,
                        tutor: tutorId,
                      });
                      onSuccessModalOpen();
                    } catch (e) {}
                    setSubmitting(false);
                  }
                }}>
                {({ errors, isSubmitting, values }) => (
                  <Form>
                    <VStack spacing="32px" alignItems={'stretch'}>
                      <TutorCard tutor={tutor} />
                      <Panel mt={'32px'}>
                        <Text className="sub1" mb={8}>
                          Offer Settings
                        </Text>
                        <VStack spacing={8} alignItems="stretch">
                          <Field name="expirationDate">
                            {({ field, form }: FieldProps) => (
                              <FormControl
                                isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                                <FormLabel>Offer expiration date</FormLabel>
                                {isEditing ? (
                                  <CalendarDateInput
                                    value={field.value}
                                    onChange={(d) => form.setFieldValue(field.name, d)}
                                  />
                                ) : (
                                  <EditField>
                                    {moment(field.value).format('MMMM Do YYYY')}
                                  </EditField>
                                )}
                                <FormErrorMessage>
                                  {form.errors[field.name] as string}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <SimpleGrid width={'100%'} columns={{ base: 1, sm: 2 }} spacing="15px">
                            <Field name="contractStartDate">
                              {({ field, form }: FieldProps) => (
                                <FormControl
                                  isInvalid={
                                    !!form.errors[field.name] && !!form.touched[field.name]
                                  }>
                                  <FormLabel>Contract starts</FormLabel>
                                  {isEditing ? (
                                    <CalendarDateInput
                                      inputProps={{
                                        placeholder: 'Select date',
                                        onClick: () =>
                                          form.setTouched({
                                            ...form.touched,
                                            [field.name]: true,
                                          }),
                                      }}
                                      value={field.value}
                                      onChange={(d) => form.setFieldValue(field.name, d)}
                                    />
                                  ) : (
                                    <EditField>
                                      {moment(field.value).format('MMMM Do YYYY')}
                                    </EditField>
                                  )}
                                  <FormErrorMessage>
                                    {form.errors[field.name] as string}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <Field name="contractEndDate">
                              {({ field, form }: FieldProps) => (
                                <FormControl
                                  isInvalid={
                                    !!form.errors[field.name] && !!form.touched[field.name]
                                  }>
                                  <FormLabel>Contract ends</FormLabel>
                                  {isEditing ? (
                                    <CalendarDateInput
                                      inputProps={{
                                        placeholder: 'Select date',
                                        onClick: () =>
                                          form.setTouched({
                                            ...form.touched,
                                            [field.name]: true,
                                          }),
                                      }}
                                      value={field.value}
                                      onChange={(d) => form.setFieldValue(field.name, d)}
                                    />
                                  ) : (
                                    <EditField>
                                      {moment(field.value).format('MMMM Do YYYY')}
                                    </EditField>
                                  )}
                                  <FormErrorMessage>
                                    {form.errors[field.name] as string}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </SimpleGrid>
                        </VStack>
                      </Panel>
                      <Panel>
                        <Text className="sub1" mb={0}>
                          Offer Details
                        </Text>
                        <Field name="course">
                          {({ field, form }: FieldProps) => (
                            <FormControl
                              mt={8}
                              isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                              <FormLabel>Course</FormLabel>
                              {isEditing ? (
                                <Select
                                  defaultValue={courseOptions.find((s: any) => s.value === field.value)}
                                  tagVariant="solid"
                                  placeholder="Select course"
                                  options={courseOptions}
                                  isInvalid={
                                    !!form.errors[field.name] && !!form.touched[field.name]
                                  }
                                  size={'md'}
                                  onFocus={() =>
                                    form.setTouched({
                                      ...form.touched,
                                      [field.name]: true,
                                    })
                                  }
                                  onChange={(option) =>
                                    form.setFieldValue(field.name, (option as Option).value)
                                  }
                                />
                              ) : (
                                <EditField>
                                  {courseOptions.find((s: any) => s.value === field.value)?.label}
                                </EditField>
                              )}
                              <FormErrorMessage>
                                {form.errors[field.name] as string}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="level">
                          {({ field, form }: FieldProps) => (
                            <FormControl
                              mt={'24px'}
                              isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                              <FormLabel>Level</FormLabel>
                              {isEditing ? (
                                <Select
                                  defaultValue={levelOptions.find((s) => s.value === field.value)}
                                  tagVariant="solid"
                                  placeholder="Select level"
                                  options={levelOptions}
                                  isInvalid={
                                    !!form.errors[field.name] && !!form.touched[field.name]
                                  }
                                  size={'md'}
                                  onFocus={() =>
                                    form.setTouched({
                                      ...form.touched,
                                      [field.name]: true,
                                    })
                                  }
                                  onChange={(option) =>
                                    form.setFieldValue(field.name, (option as Option).value)
                                  }
                                />
                              ) : (
                                <EditField>
                                  {levelOptions.find((s) => s.value === field.value)?.label}
                                </EditField>
                              )}
                              <FormErrorMessage>
                                {form.errors[field.name] as string}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="days">
                          {({ field, form }: FieldProps) => (
                            <FormControl
                              mt={'24px'}
                              isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                              <FormLabel>What days would you like to have your classes</FormLabel>
                              {isEditing ? (
                                <Select
                                  isMulti
                                  defaultValue={(field.value as number[]).map((v) =>
                                    dayOptions.find((d: any) => d.value === v)
                                  )}
                                  tagVariant="solid"
                                  placeholder="Select days"
                                  options={dayOptions}
                                  size={'md'}
                                  onFocus={() =>
                                    form.setTouched({
                                      ...form.touched,
                                      [field.name]: true,
                                    })
                                  }
                                  // @ts-ignore
                                  onChange={(option: Option[]) => {
                                    let scheduleValue = values.schedule;
                                    values[field.name].map((fv: string) => {
                                      if (!option.find((opt) => opt.value === fv)) {
                                        if (scheduleValue[fv]) {
                                          delete scheduleValue[fv];
                                          form.setFieldValue('schedule', scheduleValue);
                                        }
                                      }
                                    });
                                    form.setFieldValue(
                                      field.name,
                                      option.map((o) => o.value)
                                    );
                                  }}
                                />
                              ) : (
                                <EditField>
                                  {(field.value as number[])
                                    .map((v) => {
                                      return dayOptions.find((d) => d.value === v)?.label;
                                    })
                                    .join(', ')}
                                </EditField>
                              )}
                              <FormErrorMessage>
                                {form.errors[field.name] as string}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        {/* <Field name='schedule'>
                                            {({ field, form }: FieldProps) => (
                                                <FormControl mt={'24px'} isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                                                    <FormLabel>How often would you like your classes?</FormLabel>
                                                    {isEditing ? <ButtonGroup width={'100%'} isAttached variant='outline'>
                                                        {
                                                            scheduleOptions.map(so => <Button key={so.value} isActive={field.value === so.value} onClick={() => form.setFieldValue(field.name, so.value)}>{so.label}</Button>)
                                                        }
                                                    </ButtonGroup> : <EditField>{scheduleOptions.find(so => so.value === field.value)?.label}</EditField>}
                                                    <FormErrorMessage>{form.errors[field.name] as string}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field> */}

                        {!isEmpty(values.days) && (
                          <VStack mt={'24px'} spacing={'24px'}>
                            {values.days.map((d: number) => (
                              <SimpleGrid
                                key={d}
                                width={'100%'}
                                columns={{ base: 1, sm: 2 }}
                                spacing="15px">
                                <FormControl>
                                  <FormLabel>
                                    Start time ({numberToDayOfWeekName(d, 'ddd')})
                                  </FormLabel>
                                  {isEditing ? (
                                    <TimePicker
                                      inputProps={{ placeholder: '00:00 AM' }}
                                      value={values.schedule[d]?.begin ?? ''}
                                      onChange={(v) => setScheduleValue(v, d, 'begin')}
                                    />
                                  ) : (
                                    <EditField>{values.schedule[d]?.begin}</EditField>
                                  )}
                                  <Box mt={2}>
                                    <Text className="body2" mb={0}>
                                      {capitalize(tutor.user.name.first)} is available on{' '}
                                      {numberToDayOfWeekName(d)}s at these times:
                                    </Text>
                                    {!!tutor.schedule[d] &&
                                      tutor.schedule[d].map((s) => (
                                        <Text className="body3" mb={0}>
                                          {s.begin} - {s.end}
                                        </Text>
                                      ))}
                                  </Box>
                                </FormControl>
                                <FormControl>
                                  <FormLabel>
                                    End time ({numberToDayOfWeekName(d, 'ddd')})
                                  </FormLabel>
                                  {isEditing ? (
                                    <TimePicker
                                      inputProps={{ placeholder: '00:00 AM' }}
                                      value={values.schedule[d]?.end ?? ''}
                                      onChange={(v) => setScheduleValue(v, d, 'end')}
                                    />
                                  ) : (
                                    <EditField>{values.schedule[d]?.end}</EditField>
                                  )}
                                </FormControl>
                              </SimpleGrid>
                            ))}
                          </VStack>
                        )}
                        <Field name="note">
                          {({ field, form }: FieldProps) => (
                            <FormControl mt={'24px'}>
                              <FormLabel>Add a note</FormLabel>
                              {isEditing ? (
                                <Textarea
                                  {...field}
                                  placeholder={`Let ${tutor.user.name.first} know what you need help with`}
                                />
                              ) : (
                                <EditField>{field.value}</EditField>
                              )}
                            </FormControl>
                          )}
                        </Field>
                      </Panel>
                      <Panel>
                        <Text className="sub1" mb={0}>
                          Payment Details
                        </Text>
                        <Box mt={'32px'}>
                          <Field name="rate">
                            {({ field, form }: FieldProps) => (
                              <FormControl
                                isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                                <FormLabel>How much would you like to pay per hour?</FormLabel>
                                {isEditing ? (
                                  <InputGroup>
                                    <InputLeftAddon children="$" />
                                    <Input
                                      type={'number'}
                                      {...field}
                                      isInvalid={
                                        !!form.errors[field.name] && !!form.touched[field.name]
                                      }
                                    />
                                  </InputGroup>
                                ) : (
                                  <EditField>${field.value}/hr</EditField>
                                )}
                                <FormErrorMessage>
                                  {form.errors[field.name] as string}
                                </FormErrorMessage>
                                <Text color={'#585F68'} className="body3" mb={0} mt={'10px'}>
                                  {tutor.user.name.first}'s rate is ${tutor.rate.toFixed(0)}/hr
                                </Text>
                              </FormControl>
                            )}
                          </Field>
                          {/* <Field name='paymentOption'>
                                                {({ field, form }: FieldProps) => (
                                                    <FormControl mt={'24px'} isInvalid={!!form.errors[field.name] && !!form.touched[field.name]}>
                                                        <FormLabel>Payment options</FormLabel>
                                                        <Box>
                                                            <LargeSelect showRadio optionProps={{ style: { height: '145px' } }} value={field.value} onChange={(v) => form.setFieldValue(field.name, v)} options={[
                                                                {
                                                                    value: "installment",
                                                                    title: <Box display={'flex'} gap='1px' alignItems='center'><Text color='#000' className='sub2' mb={0}>Pay in installments</Text> <FiArrowRight color='#6E7682' size={'15px'} /><Text color='#000' className='sub2' mb={0}>${values.rate}/hr</Text></Box>,
                                                                    subtitle: <Text mt={'4px'} mb={0} textAlign={'left'} color={'#585F68'} className='body3'>With this option, the fee will be deducted from your account after each session</Text>,
                                                                    icon: <BsBookmarkStarFill size={'20px'} style={{ fill: '#6E7682' }} />
                                                                },
                                                                {
                                                                    value: "monthly",
                                                                    title: <Box display={'flex'} gap='1px' alignItems='center'><Text color='#000' className='sub2' mb={0}>Pay in installments</Text> <FiArrowRight color='#6E7682' size={'15px'} /><Text color='#000' className='sub2' mb={0}>${values.rate}/hr</Text></Box>,
                                                                    subtitle: <Text mt={'4px'} mb={0} textAlign={'left'} color={'#585F68'} className='body3'>With this option, the total fee for the time frame selected per month will be deducted</Text>,
                                                                    icon: <RiMoneyDollarCircleFill size={'20px'} style={{ fill: '#6E7682' }} />
                                                                }
                                                            ]} />
                                                        </Box>
                                                    </FormControl>
                                                )}
                                            </Field> */}

                          <Alert status="info" mt="18px">
                            <AlertIcon>
                              <MdInfo color={theme.colors.primary[500]} />
                            </AlertIcon>
                            <AlertDescription>
                              Payment will not be deducted until after your first lesson, You may
                              decide to cancel after your initial lesson.
                            </AlertDescription>
                          </Alert>
                        </Box>
                        <Box marginTop={'48px'} textAlign="right">
                          <Button
                            isDisabled={Object.values(errors).length !== 0}
                            size="md"
                            type="submit"
                            isLoading={isSubmitting}>
                            {isEditing ? 'Review Offer' : 'Confirm and Send'}
                          </Button>
                        </Box>
                      </Panel>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </LeftCol>
        <div className="col-lg-4">
          <RightCol height="100%">
            <Panel p="24px" borderRadius={'10px'} position={'sticky'} top="90px">
              <HStack>
                <BsQuestionCircleFill color="#969CA6" />
                <Text className="sub2">How this Works</Text>
              </HStack>
              <LinedList
                mt={'20px'}
                items={[
                  {
                    title: 'Send a Proposal',
                    subtitle:
                      'Find your desired tutor and prepare an offer on your terms and send to the tutor',
                  },
                  {
                    title: 'Get a Response',
                    subtitle:
                      'Proceed to provide your payment details once the tutor accepts your offer',
                  },
                  {
                    title: 'A Test-Run',
                    subtitle:
                      'You won’t be charged until after your first session, you may cancel after the first lesson.',
                  },
                ]}
              />
            </Panel>
          </RightCol>
        </div>
      </Box>
    </Root>
  );
};

export default SendTutorOffer;
