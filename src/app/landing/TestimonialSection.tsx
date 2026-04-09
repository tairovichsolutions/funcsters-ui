'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
// 1. Import Autoplay here
import SecondaryContainer from '@/components/shared/container/SecondaryContainer';
import PrimaryHeader from '@/components/shared/Headers/PrimaryHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

const testimonials = [
  {
    id: 1,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
  {
    id: 2,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
  {
    id: 3,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
  {
    id: 4,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
  {
    id: 44,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
  {
    id: 414,
    text: "The hands-on challenges helped me improve faster than any tutorial I've tried. The platform focuses on, practical problem-solving, making it easy .",
    author: "Jhon Parker wide",
    date: "Jan 4 2027",
    role: "Doc Ricardo",
  },
];

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="57" height="40" viewBox="0 0 57 40" fill="none">
    <path d="M46.1126 13.8716C47.3599 10.7344 49.3253 7.63503 51.9523 4.64906C52.7838 3.70412 52.8972 2.34343 52.2168 1.28511C51.6877 0.453568 50.8183 0 49.8734 0C49.6088 0 49.3442 0.018898 49.0797 0.113392C43.5235 1.73867 30.5401 7.50274 30.1811 25.9856C30.0488 33.1103 35.2648 39.2335 42.0494 39.9327C45.8102 40.3107 49.5521 39.0823 52.3302 36.5877C53.7042 35.3416 54.8024 33.8219 55.5542 32.1263C56.3061 30.4306 56.6949 28.5964 56.6958 26.7415C56.6958 20.505 52.2735 15.0433 46.1126 13.8716ZM11.8872 39.9327C15.6292 40.3107 19.3711 39.0823 22.1492 36.5877C23.5233 35.3417 24.6215 33.822 25.3733 32.1263C26.1252 30.4306 26.514 28.5964 26.5147 26.7415C26.5147 20.505 22.0925 15.0433 15.9315 13.8716C17.1788 10.7344 19.1443 7.63503 21.7712 4.64906C22.6027 3.70412 22.7161 2.34343 22.0358 1.28511C21.5066 0.453568 20.6373 0 19.6923 0C19.4278 0 19.1632 0.018898 18.8986 0.113392C13.3424 1.73867 0.359081 7.50274 7.62939e-06 25.9856V26.2502C7.62939e-06 33.2615 5.15932 39.2335 11.8872 39.9327Z" fill="#008CFF" fillOpacity="0.5" />
  </svg>
);

export default function TestimonialSlider() {
  return (

    <SecondaryContainer>
      <>,
        <div className='flex lg:flex-row flex-col my-5 md:my-12  justify-between'>
          <div className='pt-10'>
            <PrimaryHeader
              eyebrow="Testimonial"
              eyebrowColor="text-orange-500 font-medium"

              title={<span className="text-[2.75rem] sm:text-5xl lg:text-[3.375rem] font-semibold  leading-[1.15] tracking-tight">
                Driven by Data, <br className='hidden lg:block' />
                <pre></pre> Validated by Clients.
              </span>}
              align="center"
              alignLg="left"
            />
          </div>
          <div className="flex flex-col lg:max-w-[29rem] items-end justify-end pt-5 md:pt-10 ] ">
            {/* Subtext with specific gray and line height */}
            <p className="text-neutral-05 text-center lg:text-start text-lg leading-[1.4]   tracking-tight">
              Take on real coding challenges, sharpen your logic, and build the skills to  level up — one solution at a time.
            </p>


          </div>
        </div>
        <div className=" bg-slate-50 max-w-full flex items-center justify-center ">



        </div>

        <div className="w-full max-w-7xl mx-auto py-5 md:py-12  pr-0 overflow-hidden">
          <Swiper
            // 2. Add Autoplay to the modules array
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.2}
            // 3. Configure autoplay settings
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.custom-prev-btn',
              nextEl: '.custom-next-btn',
            }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 2.6 },
            }}
            className="mySwiper pb-2!"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-[#e8ebed] rounded-xl p-8 border-[.5px]!  border-opac border-neutral-05/40 h-full flex flex-col justify-between">
                  <div>
                    <QuoteIcon />
                    <p className="text-neutral-04 text-[17px] leading-relaxed  my-4 lg:my-6 ">
                      {testimonial.text}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-neutral-04 font-medium text-[15px]">
                      {testimonial.author}
                    </h4>
                    <p className="text-neutral-05 text-[13px] mt-1">
                      {testimonial.date} • {testimonial.role}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center gap-3 mt-5 md:mt-10 pr-4">
            <button className="custom-prev-btn w-10 h-10 flex items-center justify-center rounded-md border border-neutral-05/50 bg-white text-gray-400 transition-colors hover:bg-gray-50 [&.swiper-button-disabled]:opacity-50 [&.swiper-button-disabled]:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="custom-next-btn w-10 h-10 flex items-center justify-center rounded-md bg-[#0080ff] text-white transition-colors hover:bg-[#006ee6] shadow-sm [&.swiper-button-disabled]:opacity-50 [&.swiper-button-disabled]:cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </>
    </SecondaryContainer>

  );
}