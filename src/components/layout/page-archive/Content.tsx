import NovaTable from "/assets/nova-alphabet-table.jpg";

const Content = () => {
  return (
    <div className="flex min-w-full min-h-full justify-center items-center p-8">
      <div
        className="max-w-full max-h-full gap-6 overflow-hidden grid
        grid-cols-[40px_minmax(0,1fr)_40px]
        grid-rows-[40px_minmax(0,1fr)_40px]"
      >
        {/* Top */}
        <div></div>
        <div className="bg-pink-400"></div>
        <div></div>

        {/* Left */}
        <div className="bg-green-300"></div>

        {/* Center */}
        <div
          className="bg-white border border-gray-300
          transition-transform duration-300"
        >
          <img
            src={NovaTable}
            alt="Nova Table"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right */}
        <div className="bg-green-300"></div>

        {/* Bottom */}
        <div></div>
        <div className="bg-blue-400"></div>
        <div></div>
      </div>
    </div>
  );
};

export default Content;
