"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";

function DialogItemForMenu({
  isItemDialogOpen,
  setIsItemDialogOpen,
  selectedItem,
  counter,
  setCounter,
  toggleExtrasMainExtra,
  toggleExtras,
  language,
  note,
  setNote,
  totalExtrasPrice,
  setTotalExtrasPrice,
  isBranchManuallySelected,
  massegeNotSelectedBranch,
  deliveryMethod,
  selectedUser,
  massegeNotSerachPhone,
  massegeInvaildToken,
  handleAddToCart,
  isOpenMainExtra
}) {
  return (
      <Dialog
                     open={isItemDialogOpen}
                     onOpenChange={setIsItemDialogOpen}
                   >
                     <DialogContent size="3xl" hiddenCloseIcon={true}>
                       <div className=" flex justify-between items-center space-y-4">
                         <p className="text-xl">{selectedItem?.name}</p>
   
                         <div className="flex items-center space-">
                           {/* السعر الإجمالي */}
                           <p className="text-sm font-semibold text-gray-">
                             {(selectedItem?.price * counter).toFixed(2)} EGP
                           </p>
   
                           <button
                             onClick={() =>
                               setCounter((prev) => (prev > 1 ? prev - 1 : 1))
                             }
                             className="px-2 py-1 bg-red-500 text-white rounded-[6px] hover:bg-red-600 transition-colors mr-1 ml-4"
                           >
                             <FaMinus />
                           </button>
   
                           <input
                             type="number"
                             step="0.001"
                             value={counter}
                             onInput={(e) => {
                               if (e.target.value.length > 4) {
                                 e.target.value = e.target.value.slice(0, 4); // اقتصاص القيمة إلى 4 أرق
                               }
                             }}
                             onChange={(e) => {
                               const value = parseFloat(e.target.value);
                               if (!isNaN(value) && value >= 0.1) {
                                 // السماح بالأرقام العشرية وعدم السماح بالقيم السالبة
                                 setCounter(value);
                               }
                             }}
                             className="w-12 text-center border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:-blue-500 focus:border-transparent "
                           />
                           <button
                             onClick={() => setCounter((prev) => prev + 1)}
                             className="px-2 py-1 bg-green-500 text-white rounded-[6px] hover:bg-green-600 transition-colors ml5 mr-2 ml-1"
                           >
                             <FaPlus />
                           </button>
                         </div>
                       </div>
                       <div className="items-center">
                         <h3 className="font-medium ">
                           {selectedItem?.description}
                           {language === "en"
                             ? selectedItem?.description_en
                             : selectedItem?.description_ar}
                         </h3>
                       </div>
                       <hr className="my-2" />
                       <div className="mt-4">
                         <div className="flex flex-c gap-5">
                           {selectedItem?.info?.map((size, index) => (
                             <label
                               key={index}
                               className="flex items-center space-x-2"
                             >
                               <input
                                 type="radio"
                                 name="size"
                                 value={size?.size_en}
                                 checked={
                                   selectedItem?.selectedInfo === size?.size_en
                                 }
                                 onChange={() => {
                                   setIsOpenMainOption(true);
                                   setIsOpen(true);
                                   setIsOpenMainExtra(true);
                                   const newItemExtras =
                                     size?.size_condiments || [];
   
                                   const newExtraGroup = newItemExtras.find(
                                     (g) => g?.type === "extra"
                                   );
                                   const newOptionGroup = newItemExtras.find(
                                     (g) => g?.type === "option"
                                   );
                                   const newGroupRules = newExtraGroup
                                     ? {
                                       min: newExtraGroup?.min ?? 0,
                                       max: newExtraGroup?.max ?? 0,
                                     }
                                     : { min: 0, max: 0 };
                                   return setSelectedItem((prev) => ({
                                     ...prev,
                                     selectedInfo: size?.size_en,
                                     selectedIdSize: size?.id,
                                     price: size?.price?.price,
                                     availability:
                                       size?.availability?.availability,
                                     itemExtras: newItemExtras,
                                     extrasData: newExtraGroup?.condiments || [],
                                     optionSize:
                                       newOptionGroup?.condiments || [],
                                     groupNameSizes:
                                       newOptionGroup?.group_name || "",
   
                                     groupNameExtrasData:
                                       newExtraGroup?.group_name || "",
                                     // selectedoption:newOptionGroup?.condiments?.length > 0 ? [newOptionGroup[0]] : [],
                                     // selectedoptionId:newOptionGroup?.condiments?.length > 0 ? [newOptionGroup[0]?.id] : [],
   
                                     selectedoption:
                                       newOptionGroup?.condiments?.length > 0
                                         ? [newOptionGroup.condiments[0]]
                                         : [],
                                     selectedoptionId:
                                       newOptionGroup?.condiments?.length > 0
                                         ? [newOptionGroup.condiments[0].id]
                                         : [],
   
                                     selectedItemExtras: [],
                                     selectedExtras: [],
                                     selectedExtrasIds: [],
                                     groupExtrasRules: newGroupRules,
                                   }));
                                 }}
                               />
                               <span>
                                 {size?.size_en} ({selectedItem?.availability})
                               </span>
                             </label>
                           ))}
                         </div>
                       </div>
   
                       {selectedItem?.optionSize?.length > 0 && (
                         <div className="border rounded-lg overflow-hidden shadow-md">
                           <div
                             className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                             onClick={toggleOption}
                           >
                             <h3 className="font-bold text-[16px]">
                               {selectedItem?.groupNameSizes}
                             </h3>
                             <h3 className=" text-[16px]">
                               (Choose up to 1 Items)
                             </h3>
   
                             <span className="text-gray-600">
                               {isOpenMainOption ? "▲" : "▼"}
                             </span>
                           </div>
   
                           {/* العناصر المختارة */}
                           {selectedItem?.selectedoption?.length > 0 && (
                             <div className="p-3 bg-gray- border-t">
                               <span className="text-gray-500 font-medium">
                                 {selectedItem.selectedoption
                                   .map((extra) => extra.name)
                                   .join(", ")}
                               </span>
                             </div>
                           )}
   
                           {/* الاختيارات */}
                           <div
                             className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpenMainOption ? "max-h-96" : "max-h-0"
                               }`}
                           >
                             <div className="p-3 flex flex- flex-wrap gap-2">
                               {selectedItem?.optionSize?.map((extra, index) => (
                                 <label
                                   key={index}
                                   className="flex items-center space-x-2"
                                 >
                                   <input
                                     type="radio"
                                     value={extra.name_en}
                                     checked={selectedItem.selectedoption.some(
                                       (ex) => ex.id === extra.id
                                     )}
                                     onChange={() => {
                                       setIsOpenMainOption(false);
                                       setSelectedItem((prev) => ({
                                         ...prev,
                                         selectedoption: [extra], // اختيار واحد فقط
                                         selectedoptionId: [extra.id],
                                       }));
                                     }}
                                   />
                                   <span className="text-[#000] dark:text-[#fff]">
                                     {extra.name}
                                   </span>
                                   <span className="text-[#000] dark:text-[#fff]">
                                     {Number(extra.price) > 0 &&
                                       `(${Number(extra.price).toFixed(
                                         2
                                       )} EGP)`}{" "}
                                   </span>
                                 </label>
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
                       {selectedItem?.extrasData?.length > 0 && (
                         <div className="border rounded-lg overflow-hidden shadow-md">
                           <div className="flex  items-center justify-between">
                             <div
                               className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                               onClick={toggleExtras}
                             >
                               <h3
                                 className={`font-bold text-[16px] ${extrasError
                                   ? "text-red-500"
                                   : "text-black dark:text-white"
                                   }`}
                               >
                                 {selectedItem?.groupNameExtrasData}
                               </h3>
                               <h3 className="text-[16px]">
                                 (Choose up to{" "}
                                 {selectedItem?.groupExtrasRules?.max === 0
                                   ? selectedItem?.mainExtras?.length
                                   : selectedItem?.groupExtrasRules?.max}{" "}
                                 Items)
                               </h3>
   
                               <span className="text-gray-600">
                                 {isOpen ? "▲" : "▼"}
                               </span>
                             </div>
                             {extrasError && (
                               <p className="text-red-500 text-sm px-3 py-1">
                                 {extrasError}
                               </p>
                             )}
                           </div>
                           {/* العناصر المختارة */}
                           {selectedItem?.selectedExtras?.length > 0 && (
                             <div className="p-3 bg-gray- border-t">
                               <span className="text-gray-500 font-medium">
                                 {selectedItem.selectedExtras
                                   .map(
                                     (extra) =>
                                       `${extra.name} x${extra.quantity || 1}`
                                   )
                                   .join(", ")}
                               </span>
                             </div>
                           )}
   
                           {/* الاختيارات */}
                           <div
                             className="transition-all duration-300 ease-in-out overflow-hidden"
                             style={{ height }}
                           >
                             <div
                               ref={contentRef}
                               className="p-3 flex flex-wrap gap-2"
                             >
                               {selectedItem?.extrasData?.map((extra, index) => {
                                 const selected =
                                   selectedItem.selectedExtras.find(
                                     (ex) => ex.id === extra.id
                                   );
                                 const quantity = selected?.quantity || 0;
                                 const totalSelectedCount =
                                   selectedItem.selectedExtras.reduce(
                                     (sum, ex) => sum + (ex.quantity || 0),
                                     0
                                   );
   
                                 return (
                                   <div
                                     key={index}
                                     onClick={() => {
                                       if (selected) {
                                         // لو العنصر متعلم، إحذفه
                                         setSelectedItem((prev) => {
                                           const updatedExtras =
                                             prev.selectedExtras.filter(
                                               (ex) => ex.id !== extra.id
                                             );
                                           return {
                                             ...prev,
                                             selectedExtras: updatedExtras,
                                             selectedExtrasIds:
                                               updatedExtras.map((ex) => ex.id),
                                           };
                                         });
                                       } else {
                                         // لو مش متعلم، ضيفه لكن بعد التأكد إنه مش مكرر
                                         setSelectedItem((prev) => {
                                           const totalSelectedCount =
                                             prev.selectedExtras.reduce(
                                               (sum, ex) =>
                                                 sum + (ex.quantity || 0),
                                               0
                                             );
   
                                           if (
                                             groupMax > 0 &&
                                             totalSelectedCount >= groupMax
                                           ) {
                                             return prev;
                                           }
   
                                           const alreadyExists =
                                             prev.selectedExtras.some(
                                               (ex) => ex.id === extra.id
                                             );
                                           if (alreadyExists) return prev;
   
                                           const updatedExtras = [
                                             ...prev.selectedExtras,
                                             {
                                               id: extra.id,
                                               name: extra.name,
                                               price: extra.price,
                                               quantity: 1,
                                             },
                                           ];
   
                                           return {
                                             ...prev,
                                             selectedExtras: updatedExtras,
                                             selectedExtrasIds:
                                               updatedExtras.map((ex) => ex.id),
                                           };
                                         });
                                       }
                                     }}
                                     className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                                   >
                                     <input
                                       type="checkbox"
                                       checked={!!selected}
                                       readOnly
                                     />
                                     <span className="text-[#000] dark:text-[#fff]">
                                       {extra.name}
                                     </span>
                                     <span className="text-[#000] dark:text-[#fff]">
                                       {Number(extra.price) > 0 &&
                                         `(${Number(extra.price).toFixed(
                                           2
                                         )} EGP)`}{" "}
                                     </span>
   
                                     {extra.max !== 1 && (
                                       <div className="flex items-center gap-1">
                                         <button
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             if (!selected) return;
   
                                             setSelectedItem((prev) => {
                                               const existing =
                                                 prev.selectedExtras.find(
                                                   (ex) => ex.id === extra.id
                                                 );
                                               let updatedExtras;
   
                                               if (existing.quantity === 1) {
                                                 // احذف العنصر لو الكمية = 1
                                                 updatedExtras =
                                                   prev.selectedExtras.filter(
                                                     (ex) => ex.id !== extra.id
                                                   );
                                               } else {
                                                 // قلل الكمية
                                                 updatedExtras =
                                                   prev.selectedExtras.map(
                                                     (ex) =>
                                                       ex.id === extra.id
                                                         ? {
                                                           ...ex,
                                                           quantity:
                                                             ex.quantity - 1,
                                                         }
                                                         : ex
                                                   );
                                               }
   
                                               return {
                                                 ...prev,
                                                 selectedExtras: updatedExtras,
                                                 selectedExtrasIds:
                                                   updatedExtras.map(
                                                     (ex) => ex.id
                                                   ),
                                               };
                                             });
                                           }}
                                           className={`px-2 text-sm border rounded ${!selected
                                             ? "opacity-50 pointer-events-none"
                                             : ""
                                             }`}
                                         >
                                           -
                                         </button>
   
                                         <span className="w-4 text-center">
                                           {quantity}
                                         </span>
   
                                         <button
                                           onClick={(e) => {
                                             e.stopPropagation();
                                             if (
                                               !selected ||
                                               (extra.max > 0 &&
                                                 quantity >= extra.max)
                                             )
                                               return;
   
                                             setSelectedItem((prev) => {
                                               const updatedExtras =
                                                 prev.selectedExtras.map((ex) =>
                                                   ex.id === extra.id
                                                     ? {
                                                       ...ex,
                                                       quantity:
                                                         ex.quantity + 1,
                                                     }
                                                     : ex
                                                 );
   
                                               return {
                                                 ...prev,
                                                 selectedExtras: updatedExtras,
                                               };
                                             });
                                           }}
                                           disabled={
                                             !selected ||
                                             (groupMax > 0 &&
                                               totalSelectedCount >= groupMax)
                                           }
                                           className={`px-2 text-sm border rounded ${!selected ||
                                             (extra.max > 0 &&
                                               quantity >= extra.max)
                                             ? "opacity-50 pointer-events-none"
                                             : ""
                                             }`}
                                         >
                                           +
                                         </button>
                                       </div>
                                     )}
                                   </div>
                                 );
                               })}
                             </div>
                           </div>
                         </div>
                       )}
                       {selectedItem?.mainExtras?.length > 0 && (
                         <div className="border rounded-lg overflow-hidden shadow-md">
                           <div
                             className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                             onClick={toggleExtrasMainExtra}
                           >
                             <h3 className="font-bold text-[16px] ">
                               {selectedItem?.groupNameMainExtras}
                             </h3>
                             <h3 className=" text-[16px] ">
                               {selectedItem?.mainExtras?.category_ar} (Choose up
                               to {selectedItem?.mainExtras?.length} Items)
                             </h3>
   
                             <span className="text-gray-600">
                               {isOpenMainExtra ? "▲" : "▼"}
                             </span>
                           </div>
   
                           {/* العناصر المختارة */}
                           {selectedItem?.selectedMainExtras?.length > 0 && (
                             <div className="p-3 bg-gray- border-t">
                               <span className="text-gray-500 font-medium">
                                 {selectedItem.selectedMainExtras
                                   .map((extra) => extra.name)
                                   .join(", ")}
                               </span>
                             </div>
                           )}
   
                           {/* الاختيارات */}
                           <div
                             className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpenMainExtra ? "max-h-96" : "max-h-0"
                               }`}
                           >
                             <div className="p-3 flex flex- flex-wrap gap-2">
                               {selectedItem?.mainExtras?.map((extra, index) => (
                                 <label
                                   key={index}
                                   className="flex items-center space-x-2"
                                 >
                                   <input
                                     type="checkbox"
                                     value={extra.name_en}
                                     checked={selectedItem.selectedMainExtras.some(
                                       (ex) => ex.id === extra.id
                                     )}
                                     onChange={(e) => {
                                       const checked = e.target.checked;
                                       setSelectedItem((prev) => {
                                         let updatedExtras = checked
                                           ? [...prev.selectedMainExtras, extra]
                                           : prev.selectedMainExtras.filter(
                                             (ex) => ex.id !== extra.id
                                           );
   
                                         let updatedExtrasIds =
                                           updatedExtras.map((ex) => ex.id); // تخزين الـ ID فقط
   
                                         // حساب السعر الإجمالي الجديد
                                         const newTotalPrice =
                                           updatedExtras.reduce(
                                             (acc, curr) =>
                                               acc +
                                               parseFloat(curr.price || "0"), // تحويل السعر إلى رقم مع معالجة القيم الفارغة
                                             0
                                           );
   
                                         // console.log(
                                         //   "Selected Extras:",
                                         //   updatedExtras
                                         // );
                                         // console.log(
                                         //   "Total Price:",
                                         //   newTotalPrice
                                         // );
                                         setTotalExtrasPrice(newTotalPrice);
                                         return {
                                           ...prev,
                                           selectedMainExtras: updatedExtras,
                                           selectedMainExtrasIds:
                                             updatedExtrasIds, // تحديث قائمة الـ IDs
                                         };
                                       });
                                     }}
                                   />
                                   <span className="text-[#000] dark:text-[#fff]">
                                     {extra.name}
                                   </span>
                                   <span className="text-[#000] dark:text-[#fff]">
                                     {Number(extra.price) > 0 &&
                                       `(${Number(extra.price).toFixed(
                                         2
                                       )} EGP)`}{" "}
                                   </span>
                                 </label>
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
   
                       <div className="sticky  flex flex-col lg:flex-row lg:items-center gap-2 my-4">
                         <Label className="lg:min-w-[100px]">Note:</Label>
                         <Input
                           value={note}
                           onChange={(e) => setNote(e.target.value)}
                           type="text"
                           placeholder="Note"
                           className="w-full text-[#000] dark:text-[#fff]"
                         />
                       </div>
                       <div className="sticky bottom-[-23px] bg-white dark:bg-black p-4 border-t border-gray-300 dark:border-gray-700 shadow-md z-50 mt-4">
                         <div className="flex items-center justify-between">
                           <div>
                             {selectedItem?.selectedInfo && (
                               <p className="font-semibold">
                                 {counter > 1 ? `${counter}x` : ""}{" "}
                                 {selectedItem?.selectedInfo || ""}
                               </p>
                             )}
                           </div>
                           <div className="flex justify-end">
                             <p className="text-sm font-semibold mr-1">
                               Subtoal:{" "}
                             </p>
                             <p className="text-sm font-semibold mr-1">
                               {(
                                 (selectedItem?.price + totalExtrasPrices +
                                   totalOptionPrices +
                                   totalMainExtrasPrices) * counter
   
                               ).toFixed(2)}
                             </p>
                             <p className="text-sm font-semibold ">EGP</p>
                           </div>
                         </div>
                         <div className="flex justify-between items-center">
                           <div className="text-sm font-semibold flex flex-wrap max-w-[500px]">
                             <p className="text-gray-500 ml-3">
                               {(selectedItem?.selectedoption || [])
                                 .map((option) => option.name)
                                 .join(", ")}
   
                               {/* فاصل لو في option و extras */}
                               {selectedItem?.selectedoption?.length > 0 &&
                                 selectedItem?.selectedExtras?.length > 0 &&
                                 ", "}
   
                               {/* الإكسترا مع الكمية */}
                               {(selectedItem?.selectedExtras || [])
                                 .map((extra) =>
                                   extra.quantity > 1
                                     ? `${extra.name} x${extra.quantity}`
                                     : `${extra.name}`
                                 )
                                 .join(", ")}
   
                               {/* فاصل لو في main extras */}
                               {selectedItem?.selectedMainExtras?.length > 0 &&
                                 (selectedItem?.selectedoption?.length > 0 ||
                                   selectedItem?.selectedExtras?.length > 0) &&
                                 ", "}
   
                               {/* main extras */}
                               {(selectedItem?.selectedMainExtras || [])
                                 .map((extra) =>
                                   extra.quantity > 1
                                     ? `${extra.name} x${extra.quantity}`
                                     : `${extra.name}`
                                 )
                                 .join(", ")}
                             </p>
                           </div>
   
                           <DialogFooter className="mt-4">
                             <div className="flex items-center gap-4">
                               {/* <p className="text-sm font-semibold mr-1 ">
                                                   {selectedUser ? massegeNotSerachPhone : ""} 
                                                   </p> */}
                               {!selectedUser && massegeNotSerachPhone && (
                                 <p className="text-sm font-semibold mr-1">
                                   {massegeNotSerachPhone}
                                 </p>
                               )}
   
                               <p className="text-sm font-semibold mr-1 ">
                                 {deliveryMethod === "pickup" &&
                                   !isBranchManuallySelected
                                   ? massegeNotSelectedBranch
                                   : ""}
                               </p>
                               {massegeInvaildToken && (
                                 <p className="text-sm font-semibold text-red-500 mr-1">
                                   {massegeInvaildToken}{" "}
                                   <Link
                                     href={`/${language}/login`}
                                     className="text-blue-500 underline ml-1"
                                   >
                                     Login here
                                   </Link>
                                 </p>
                               )}
   
                               <Button
                                 type="submit"
                                 color="success"
                                 onClick={handleAddToCart}
                                 disabled={
                                   !selectedUser ||
                                   (deliveryMethod === "pickup" &&
                                     !isBranchManuallySelected) ||
                                   !selectedItem?.selectedInfo
                                 }
                               >
                                 Add to Cart
                               </Button>
                             </div>
                           </DialogFooter>
                         </div>
                       </div>
                     </DialogContent>
                   </Dialog>
  );
}

export default DialogItemForMenu;
