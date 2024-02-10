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
import useResourceStore from '../../../../../../../../../../../state/resourceStore';

function Level({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  const { levels } = useResourceStore();
  return (
    <FormField
      control={form.control}
      name="levelId"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {levels?.map((item) => (
                <SelectItem value={item._id}>{item.label}</SelectItem>
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
