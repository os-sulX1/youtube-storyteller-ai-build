import Story from '@/components/Story'
import { getAllStories, getStory } from '@/lib/getAllStories'
import { notFound } from 'next/navigation'
import React from 'react'

type StoryProps= {
  params:{
    id:string
  }
}

const StoryPage = ({params:{id}}:StoryProps) => {
  const decodedId = decodeURIComponent(id)
  const story = getStory(decodedId)

  if(!story){
    return notFound()
  }
  return (
    <Story story={story} />
  )
}

export default StoryPage


export const genrateStaticParams = async()=>{
  const stories = getAllStories()

  const paths = stories.map(stroy=>({
    id:stroy.story
  }))
return paths
}