import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../../../../../../components/ui/select';
import { FindTutorSchemaType } from '../../../validation';

function SelectSubject({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
    <FormField
      control={form.control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  );
}

export default SelectSubject;
