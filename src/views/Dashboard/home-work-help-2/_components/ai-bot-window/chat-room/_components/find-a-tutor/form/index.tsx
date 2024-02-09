import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../../../../../../../components/ui/form';
import { format } from 'date-fns';

import { FindTutorSchema, FindTutorSchemaType } from '../validation';
import { Input } from '../../../../../../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../../../../components/ui/select';
import { Textarea } from '../../../../../../../../../components/ui/text-area';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../../../../../../components/ui/radio-group';
import { DatePicker } from '../../../../../../../../../components/ui/date-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../../../../../../components/ui/popover';
import { Button } from '../../../../../../../../../components/ui/button';
import { cn } from '../../../../../../../../../library/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '../../../../../../../../../components/ui/calender';

function BountyForm({ handleClose }: { handleClose: () => void }) {
  const form = useForm<FindTutorSchemaType>({
    resolver: zodResolver(FindTutorSchema),
    defaultValues: {}
  });

  function onSubmit(values: FindTutorSchemaType) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full flex flex-col gap-3 p-5 ">
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="Math">Math</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <SelectItem value={level.toString()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Topic" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    className="max-h-36"
                    placeholder="Description"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full grid grid-cols-2 gap-2 items-center">
              {/* price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="Price ($)" type="number" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row gap-3 space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="half-hour" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Half Hour
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="full-hour" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Full Hour
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="instructionMode"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mode of Instruction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full bg-white flex items-stretch">
                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Expiration date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <footer className="h-[72px] border-t p-5 pt-5 overflow-hidden w-full flex justify-end gap-4 items-center bg-[#F7F7F8]">
            <Button
              size="sm"
              className="shadow-md bg-white text-[#5C5F64] hover:shadow-lg text-sm font-normal"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              className="shadow-md hover:shadow-lg text-sm font-normal text-white bg-[#207DF7] hover:bg-[#0E6EFA]"
            >
              Confirm
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
}

export default BountyForm;
