"use client";

const Banner = () => {
  return (
    <section className="bg-cover bg-center bg-gray-200 dark:bg-transparent h-30 flex items-center justify-center text-center text-white border-indigo-500/100 dark:border-white rounded-md">
      <div className="p-6 rounded-lg bg-opacity-50">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-text bg-[length:200%_200%] animate-gradient">
          Chào mừng đến với NovelToon
        </h2>
        <p className="mt-2 text-black dark:text-white">
          Đọc truyện miễn phí với hàng ngàn đầu truyện hay nhất!
        </p>
      </div>
    </section>
  );
};

export default Banner;
