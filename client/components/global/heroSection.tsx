import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { heroSectionImages } from '@/public/assets/heroSection'
import { StaticImageData } from 'next/image'
import Image from 'next/image'

const heroSection = () => {
  return (
    <Carousel className="w-full sm:max-w-7xl">
      <CarouselContent>
        {heroSectionImages.map((image: StaticImageData, index: number) => (
          <CarouselItem key={index} className="w-full h-full">
            <Image src={image} alt={`Hero Section Image ${index + 1}`}  className="w-full h-full object-cover" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default heroSection