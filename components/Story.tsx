'use client'
import React, { useEffect, useState } from 'react'
import type {Story as StoryType} from '../types/stories'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from './ui/carousel'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
type StoryProps ={
  story : StoryType
}
const Story = ({story}:StoryProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(()=>{
    if(!api) return
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() +1)
    api.on('select',()=>{
      setCurrent(api.selectedScrollSnap() +1)
    })
  },[api])
  return (
   <div className="">
    <div className="px-20">
      <Carousel setApi={setApi} className='w-full lg:w-4/5 mx-auto h-56'>
      <CarouselContent className='px-5'>
        {/** STORY PAGES */}
        {story.pages.map((page, i)=>(
          <CarouselItem key={i} className='p-5 md:p-10 border'>
            <Card>
              <h2 className='text-center text-gray-400'>{story.story}</h2>
              <CardContent className='p-5 xl:flex'>
                <Image src={page.png} alt={`Page ${i +1} image`} width={500} height={500} className='w-80 h-80  xl:h-[500px] rounded-3xl mx-auto float-right p-5 xl:order-last'/>
                <p className='font-semibold first-letter:text-3xl text-xl whitespace-pre-wrap'>{page.txt}</p>
              </CardContent>
              <p className='text-center text-gray-400'>
                Page: {current} of {count}
              </p>
            </Card>

          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
      </Carousel>

    </div>
   </div>
  )
}

export default Story