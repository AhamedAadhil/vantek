// 'use client';

// import { useState } from 'react';
// import { FileText, X } from 'lucide-react';
// import { Dialog } from '@headlessui/react';

// export default function TermsModal() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);

//   return (
//     <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
//       <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-zinc-900 text-white shadow-lg">
//           <div className="flex items-center justify-between border-b border-zinc-700 bg-violet-600 px-6 py-4 rounded-t-xl">
//             <div className="flex items-center gap-2">
//               <FileText className="w-6 h-6 text-white" />
//               <Dialog.Title className="text-lg font-semibold">YNEX - Terms & Conditions</Dialog.Title>
//             </div>
//             <button onClick={() => setIsOpen(false)} className="text-white hover:text-zinc-300">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="p-6 space-y-4 text-sm text-zinc-300 max-h-[70vh] overflow-y-auto">
//             <p>
//               If you stay in the USA the ynex{' '}
//               <a href="#" className="text-blue-400 underline">
//                 Terms and Conditions
//               </a>{' '}
//               consists of below rules and{' '}
//               <a href="#" className="text-blue-400 underline">
//                 User Agreements
//               </a>{' '}
//               consists of below policies{' '}
//               <a href="#" className="text-blue-400 underline">
//                 Ynex Rules & Privacy Policies
//               </a>{' '}
//               incorporated with the below conditions.
//             </p>
//             <p>
//               If you stay any where in the world other than USA the ynex{' '}
//               <a href="#" className="text-blue-400 underline">
//                 Terms and Conditions
//               </a>{' '}
//               consists of below rules and{' '}
//               <a href="#" className="text-blue-400 underline">
//                 User Agreements
//               </a>{' '}
//               consists of below policies{' '}
//               <a href="#" className="text-blue-400 underline">
//                 Ynex Rules & Privacy Policies
//               </a>{' '}
//               incorporated with the below conditions.
//             </p>

//             <div className="space-y-3 text-white">
//               <h2 className="text-base font-semibold">Terms & Services :</h2>

//               <div>
//                 <p className="font-semibold">1 - Lorem ipsum dolor sit amet.</p>
//                 <p className="text-zinc-400">
//                   Note that you'll sometimes see this agreement referred to as a Terms of Use, User Agreement or Terms of
//                   Service agreement. These terms are interchangeable and refer to the same type of agreement
//                 </p>
//               </div>

//               <div>
//                 <p className="font-semibold">2 - Consectetur adipisicing elit.</p>
//                 <p className="text-zinc-400">
//                   While they are not legally required, terms and conditions set the stage for any successful business
//                   relationship. By making it clear and putting these guidelines in writing, business owners can avoid
//                   misunderstandings with their customers.
//                 </p>
//                 <p className="text-zinc-400">
//                   It also allows you to decide what you consider acceptable and which type of conduct could lead you to
//                   terminate a relationship with a user.
//                 </p>
//               </div>

//               <div>
//                 <p className="font-semibold">3 - There are many variations.</p>
//                 <p className="text-zinc-400">
//                   Limitation of liability disclaimers is one of the main reasons why business owners take the time to
//                   include terms and conditions on their websites. When reasonable and drafted adequately, such clauses
//                   can help protect your business against claims and lawsuits and limit the amount of money that you would
//                   have to pay in damages.
//                 </p>
//               </div>

//               <div>
//                 <p className="font-semibold">4 - If you allow your users to share.</p>
//                 <p className="text-zinc-400">
//                   If you allow your users to share comments or photos on your website or leave reviews of the products
//                   that you sell, you will want to have a section in your terms that governs their conduct and sets out
//                   what is acceptable and what isn’t.
//                 </p>
//                 <p className="text-zinc-400">
//                   In this clause, you could reserve the right to monitor the user-generated content shared on your website
//                   and remove anything that goes against your guidelines. You could expressly ask your users not to post
//                   anything that contains obscene language or any material that could be considered harmful or violent or
//                   infringes on someone else’s copyright.
//                 </p>
//               </div>

//               <div>
//                 <p className="font-semibold">5 - You could also make it clear.</p>
//                 <p className="text-zinc-400">
//                   You could also make it clear that you reserve the right to suspend or delete the accounts of repeat
//                   infringers. This will help you make your website more secure.
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-2 pt-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox rounded border-zinc-600 bg-zinc-800 text-violet-600"
//                   checked={acceptedPrivacy}
//                   onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
//                 />
//                 <span>
//                   I agree with the{' '}
//                   <a href="#" className="text-blue-400 underline">
//                     Privacy Policy
//                   </a>
//                 </span>
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox rounded border-zinc-600 bg-zinc-800 text-violet-600"
//                   checked={acceptedTerms}
//                   onChange={() => setAcceptedTerms(!acceptedTerms)}
//                 />
//                 <span>
//                   I agree with the{' '}
//                   <a href="#" className="text-blue-400 underline">
//                     Terms & Conditions
//                   </a>
//                 </span>
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-700 bg-zinc-800 rounded-b-xl">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600"
//             >
//               DECLINE
//             </button>
//             <button
//               disabled={!(acceptedPrivacy && acceptedTerms)}
//               onClick={() => setIsOpen(false)}
//               className={`rounded-lg px-4 py-2 text-sm font-medium ${
//                 acceptedPrivacy && acceptedTerms
//                   ? 'bg-violet-600 hover:bg-violet-500 text-white'
//                   : 'bg-violet-900 text-zinc-400 cursor-not-allowed'
//               }`}
//             >
//               ACCEPT
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }
