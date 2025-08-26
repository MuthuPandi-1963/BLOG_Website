// // MsgContext.tsx
// import React, { createContext, useContext } from "react";
// import { message } from "antd";

// export interface MessageType {
//   type: "success" | "error" | "warning" | "info" | "loading";
//   content: string;
//   duration?: number; // ms
// }

// interface MessageContextType {
//   showMessage: (msg: MessageType) => void;
//   destroyMessage: () => void;
//   contextHolder: React.ReactNode;
// }

// const MessageContext = createContext<MessageContextType | null>(null);

// export const MessageContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [messageApi, contextHolder] = message.useMessage();

//   const showMessage = (msg: MessageType) => {
//     // Convert ms → seconds (AntD expects seconds)
//     const { duration, ...rest } = msg;
//     messageApi.open({
//       ...rest,
//       duration: duration ? duration / 1000 : 3,
//     });
//   };

//   const destroyMessage = () => {
//     messageApi.destroy();
//   };

//   return (
//     <MessageContext.Provider value={{ showMessage, destroyMessage, contextHolder }}>
//       {contextHolder}
//       {children}
//     </MessageContext.Provider>
//   );
// };

// export const useMsg = () => {
//   const ctx = useContext(MessageContext);
//   if (!ctx) throw new Error("useMsg must be used inside MessageContextProvider");
//   return ctx;
// };
