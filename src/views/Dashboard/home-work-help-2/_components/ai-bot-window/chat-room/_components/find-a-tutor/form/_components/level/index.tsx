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

function Level({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
    <FormField
      control={form.control}
      name="level"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {[1, 2, 3, 4, 5].map((level) => (
                <SelectItem value={level.toString()}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Level;
