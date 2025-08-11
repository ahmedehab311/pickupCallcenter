import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function DescriptionFields({
  register,
  errors,
  labelEn,
  labelAr,
  maxLength,
  isEditing,
  handleGenerateDescription,
}) {
  return (
    <>
      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px] capitalize">{labelEn}:</Label>
        <div className="flex flex-col w-full">
          <Textarea
            {...register("enDesc")}
            className="w-[50%]"
            disabled={isEditing}
          />
          {errors.enDesc && (
            <span className="text-red-500 text-sm mt-1">
              {errors.enDesc.message}
            </span>
          )}
        </div>
      </div>
      {/* <button
  type="button"
  className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
  onClick={handleGenerateDescription}
>
  Generate Description
</button> */}

      <div className="col-span-2 flex flex-col lg:items-center lg:flex-row lg:gap-0 gap-2 mb-2">
        <Label className="lg:min-w-[160px] capitalize">{labelAr}:</Label>
        <Textarea
          {...register("arDesc")}
          className="w-[50%]"
          disabled={isEditing}
        />
      </div>
    </>
  );
}

export default DescriptionFields;
