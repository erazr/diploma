export const HomeLayout = ({ children }) => {
  return (
    <div className="grid h-full grid-cols-[75px_260px_1fr] grid-rows-[auto_1fr_auto] bg-[#0e1621]">
      {children}
    </div>
  );
};
