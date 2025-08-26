// import React, { useState, useRef, useEffect } from 'react';
// import { FiFileText, FiCode, FiTrendingUp, FiChevronDown, FiBook, FiMessageCircle } from 'react-icons/fi';

// interface DropdownItem {
//   itemIcon: React.ComponentType<{ className?: string }>;
//   label: string;
//   href: string;
//   key: string;
// }

// interface DropdownMenuProps {
//   items: DropdownItem[];
//   onItemClick?: (key: string, href: string) => void;
// }

// const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, onItemClick }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleItemClick = (item: DropdownItem) => {
//     setIsOpen(false);
//     if (onItemClick) {
//       onItemClick(item.key, item.href);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       {/* Dropdown Button */}
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center text-nowrap  py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//       >
//         <FiFileText className='mr-3'/>
//         Quiz & Progress
//         <FiChevronDown
//           className={`ml-2 h-4 w-4 transition-transform duration-200 ${
//             isOpen ? 'transform rotate-180' : ''
//           }`}
//         />
//       </button>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute -right-10 md:right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-opacity-5 focus:outline-none z-50">
//           <div className="py-1">
//             {items.map((item) => {
//               const Icon = item.itemIcon;
//               return (
//                 <button
//                   key={item.key}
//                   onClick={() => handleItemClick(item)}
//                   className="group my-2 flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 hover:scale-105 hover:rounded-md cursor-pointer outline-none"
//                 >
//                   <Icon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" />
//                   {item.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Usage example
// const DropdownExample: React.FC = () => {
//   const items: DropdownItem[] = [
//     { 
//       itemIcon: FiFileText, 
//       label: "Aptitude Quiz", 
//       href: "/student/aptitude", 
//       key: '1' 
//     },
//     { 
//       itemIcon: FiCode, 
//       label: "Coding Challenges", 
//       href: "/student/coding", 
//       key: '2' 
//     },
//     { 
//       itemIcon: FiTrendingUp, 
//       label: "Results & Progress", 
//       href: "/student/results", 
//       key: '3' 
//     },
//      { itemIcon: FiBook, label: "Study Materials", href: "/student/materials",key:'4' },
//      { itemIcon: FiMessageCircle,key:'5', label: "Ask Doubts", href: "/student/doubts" },
//   ];

//   const handleItemClick = (key: string, href: string) => {
//     key ;
//     href;
//     // You can add navigation logic here (e.g., using react-router)
//   };

//   return (
//     <div className="">
//       <DropdownMenu items={items} onItemClick={handleItemClick} />
//     </div>
//   );
// };

// export default DropdownExample;