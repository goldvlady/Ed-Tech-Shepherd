import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import { FindTutorSchemaType } from '../../../validation';
import { Input } from '../../../../../../../../../../../components/ui/input';

function Topic({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
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
  );
}

export default Topic;
