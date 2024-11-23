import { Control, Path, useController } from "react-hook-form";
import { FormData } from "@/pages/admin/QuizCreator"
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import RichTextEditor from "./RTE";

// type FormData = {
//   name: string;
//   description: string;
//   duration: number;
//   subjects: string[];
//   isSubjectTest: boolean;
//   services: string[];
//   questions: {
//     question: string;
//     image: string;
//     options: string[];
//     correct: string;
//   }[];
// };

interface WrapperProps {
  name: Path<FormData>;
  control: Control<FormData>;
  label: string;
}

const WrapperTextEditor = ({ name, control, label }: WrapperProps) => {
  const { field } = useController({
    name,
    control,
  });

  const handleEditorChange = (content: string) => {
    field.onChange(content);
  };

   const editorValue = typeof field.value === 'string' ? field.value : ''

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RichTextEditor
          initialValue={editorValue}
          onChange={handleEditorChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default WrapperTextEditor;
