import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import { FindTutorSchemaType } from '../../../validation';
import { Input } from '../../../../../../../../../../../components/ui/input';

function Price({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
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
  );
}

export default Price;
