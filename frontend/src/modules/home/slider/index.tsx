'use client'
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import Image from "next/image"
import { useContext } from "react"
import { HomepageContext } from "@lib/context/homepage-context"

const Slider = () => {
  const homepageData = useContext(HomepageContext)
  const images = [...(homepageData?.slider?.sort((a, b) => a.placement - b.placement) ?? [])]

  return (
    <>
      {(homepageData?.slider && homepageData.slider.length > 0) ? (
        <div className="pt-8 w-full flex justify-center flex-wrap rounded-2 mb-5 px-4 sm:px-0">
          <Carousel
            autoPlay
            infiniteLoop
            showArrows={false}
            showStatus={false}
          interval={5000}
          showThumbs={false}
          onClickItem={(index) => window.location.href = images[index].link}
          className="relative cursor-pointer rounded-2 w-full"
          stopOnHover={true}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const indicatorStyle = {
              background: isSelected ? "white" : "gray",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              display: "inline-block",
              margin: "0 8px"
            };
            const ariaLabel = isSelected ? `Selected: ${label} ${index + 1}` : `${label} ${index + 1}`;
            const title = isSelected ? `Selected: ${label} ${index + 1}` : `${label} ${index + 1}`;

            return (
              <li
                style={indicatorStyle}
                aria-label={ariaLabel}
                title={title}
                onClick={onClickHandler}
              />
            );
          }}
          >
            {images.map((slide, index) => (
              <div key={index} className="relative aspect-[17/5] w-full overflow-hidden rounded-2xl">
                <Image
                  src={slide.src}
                  alt={slide?.alt_text ?? ""}
                  priority={index === 0 ? true : false}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <div className="py-20 w-full flex justify-center flex-wrap rounded-2xl my-5 px-4 sm:px-0 bg-gray-100">
          <p>Please insert slider images in the homepage content section of the Backend</p>
        </div>
      )}
    </>
  );
}

export default Slider