import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormMessage
} from '../../../../../../../../../../../components/ui/form';
import { FindTutorSchemaType } from '../../../validation';
import { Textarea } from '../../../../../../../../../../../components/ui/text-area';

function Description({ form }: { form: UseFormReturn<FindTutorSchemaType> }) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <Textarea
            className="h-48 max-h-48"
            placeholder="Description"
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default Description;
