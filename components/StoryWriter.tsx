"use client";
import React, { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import type { Frame } from "@gptscript-ai/gptscript";
import renderEventMassage from "@/lib/renderEventMasagge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const storiesPath = 'public/stories'

const StoryWriter = () => {
  const [story, setStory] = useState<string>('')
  const [pages, setPages] = useState<number>()
  const [progress, setProgress] = useState('')
  const [runStarted, setRunStarted] = useState<boolean>(false)
  const [runFinished, setRunFinished] = useState<null | boolean>(null)
  const [currentTool, setCurrentTool] = useState('')
  const [event, setEvent] = useState<Frame[]>([])
  const router = useRouter()

  

  const runScript = async () => {
    setRunStarted(true)
    setRunFinished(false)
    const response = await fetch('/api/run-script',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({story , pages ,path:storiesPath})
    } )
    if(response.ok && response.body){
     //Handle streams from the API
     //...
       console.log('Stream started')
       const reader =response.body.getReader()
       const decoder = new TextDecoder()

       handleStream(reader, decoder)
    //...
    }else{
      setRunFinished(true)
      setRunStarted(false)
      console.log('Failed to start Streaming')
      throw new Error('Failed to start Streaming')
    }
  }

  const handleStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // Exit the loop if the stream is done
  
      const chunk = decoder.decode(value, { stream: true });
  
      // Split and filter event data from the chunk
      const eventData = chunk.split('\n\n').filter(line => line.startsWith('event: '))
        .map(line => line.replace(/^event: /, ''));
  
      // Parse the JSON data and update the state accordingly
      // biome-ignore lint/complexity/noForEach: <explanation>
              eventData.forEach(data => {
        try {
          const parsedData = JSON.parse(data);
  
          if (parsedData.type === 'callProgress') {
            const lastOutput = parsedData.output[parsedData.output.length - 1];
            setProgress(prevProgress => lastOutput.content);
            setCurrentTool(parsedData.tool?.description || '');
          } else if (parsedData.type === 'callStart') {
            setCurrentTool(parsedData.tool?.description || '');
          } else if (parsedData.type === 'runFinish') {
            setRunFinished(true);
            setRunStarted(false);
          } else {
            setEvent(prevEvent => [...prevEvent, parsedData]);
          }
        } catch (error) {
          console.error('Failed to parse JSON', error);
        }
      });
    }
  };
  
  

  useEffect(()=>{
    toast.success('Story generated successfully!',{
      action:(
        <Button onClick={()=> router.push('/stories')} className="bg-purple-500 ml-auto">
          View Stories
        </Button>
      )
    })
  
  },[runFinished , router])



	return (
		<div className="flex flex-col container">
			<section className="flex-1 flex flex-col border border-green-300 rounded-md p-10 space-y-2">
				<Textarea 
        placeholder="Write a story about a robot and a human who become  friends ..."
        value={story}
        onChange={e=> setStory(e.target.value)}
         className="flex-1 text-black"/>
        <Select onValueChange={value=> setPages(Number.parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder='How many pages should  the story be ?' />
          </SelectTrigger>
          <SelectContent className="w-full">
           {Array.from({length: 10 }, (_ , i)=>(
            <SelectItem key={i} value={String(i + 1)}>
              {i+1}
            </SelectItem>
           ) )}
          </SelectContent>
        </Select>

        <Button disabled={!story || !pages || runStarted} className="w-full " size={'lg'} onClick={runScript} >Generate Story</Button>
			</section>
      <section  className="flex-1 pb-5 mt-5">
            <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
              <div className="">
                {runFinished === null && (
                  <>
                  <p className="animate-pulse">In waiting for you to Generate a story above ...   </p>
                  <br />
                  </>
                )}
                <span className="mr-5">{'>>'}</span>
                {progress}
              </div>
              {/**Current tool */}
              {
                currentTool && (
                  <div className="py-10">
                    <span className="mr-5">
                      {'--- [Current Tool ---]'}

                      {currentTool}
                    </span>
                  </div>
                )
              }

              {/**Render Events  */}
              <div className="space-y-5">
                {event.map((event , index)=>(
                  <div className="" key={index}>
                    <span className="mr-5">{'>>'}</span>
                    {renderEventMassage(event)}
                  </div>
                ))}
              </div>


              {runStarted && (
                <div className="">
                  <span className="mr-5 animate-in">
                    {' --- [AI Storyteller Has Started] ---'}
                  </span>
                  <br />
                </div>
              )}
            </div>
      </section>
		</div>
	);
};

export default StoryWriter;
